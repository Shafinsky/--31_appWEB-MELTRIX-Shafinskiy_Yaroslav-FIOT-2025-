const User = require("../../models/user.model");
const { hashPassword, comparePassword } = require("../utils/hash.service");
const { generateAccessToken, generateRefreshToken } = require("../utils/token.service");
const redisClient = require("../config/redis");
const { clearUserCache } = require("../utils/cache");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

//REGISTER
exports.register = async (req, res) => {
  try {
    const { email, password, confirmPassword, role } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Заповніть всі обов'язкові поля" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Пароль повинен містити мінімум 6 символів" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Паролі не співпадають" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email вже використовується" });
    }

    let userRole = "user";

    if (role) {
      const allowedRoles = ["user", "publisher", "admin"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ 
          message: "Невірна роль. Доступні: user, publisher, admin" 
        });
      }
      userRole = role;
    }

    const hashedPassword = await hashPassword(password);

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      email,
      password_hash: hashedPassword,
      verify_token: verifyToken,
      role: userRole
    });

    console.log("📧 VERIFY LINK:");
    console.log(`http://localhost:3000/api/auth/verify-email?token=${verifyToken}`);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refresh_token = refreshToken;
    await user.save();

    res.status(201).json({
      message: "Реєстрація успішна",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        verify_token: user.verifyToken
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: "Невірний email або пароль" });

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Невірний email або пароль" });

    if (!user.is_verified)
      return res.status(401).json({ message: "Confirm email first" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refresh_token = refreshToken;
    await user.save();

    res.json({
      message: "Успішний вхід",
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
  await clearUserCache(user.id);

  res.json({ token });
};

//UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    const { username, display_name, avatar_url } = req.body;

    const updateData = {};

    if (username !== undefined) updateData.username = username;
    if (display_name !== undefined) updateData.display_name = display_name;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Не передано полів для оновлення" });
    }

    await user.update(updateData);

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'username', 'display_name', 'avatar_url', 'role']
    });

    res.json({
      message: "Профіль успішно оновлено",
      user: updatedUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
  await clearUserCache(user.id);

  res.json({ token });
};

//CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    const match = await comparePassword(oldPassword, user.password_hash);
    if (!match)
      return res.status(400).json({ message: "Wrong old password" });

    user.password_hash = await hashPassword(newPassword);
    await user.save();

    res.json({ message: "Password changed" });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

//DELETE OWN ACCOUNT
exports.deleteMe = async (req, res) => {
  await User.destroy({ where: { id: req.user.id } });
  res.json({ message: "Account deleted" });
};

//Redis
exports.getMe = async (req, res) => {
  const user = await User.findByPk(req.user.id);

  // зберігаємо в кеш на 60 секунд
  await redisClient.setEx(
    `user:${user.id}`,
    60,
    JSON.stringify(user)
  );

  console.log("📀 Data from DB");

  res.json(user);
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Введіть email" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({ 
        message: "Якщо email існує, посилання для скидання пароля надіслано" 
      });
    }

    const resetToken = require('crypto').randomBytes(32).toString("hex");
    const resetTokenExp = new Date(Date.now() + 3600000);

    user.reset_token = resetToken;
    user.reset_token_exp = resetTokenExp;
    await user.save();

    console.log("🔑 RESET PASSWORD LINK:");
    console.log(`http://localhost:3000/api/auth/reset-password?token=${resetToken}`);

    res.json({ 
      message: "Посилання для скидання пароля надіслано на email",
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmNewPassword } = req.body;

    if (!token || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "Заповніть всі поля" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Пароль повинен бути мінімум 6 символів" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Паролі не співпадають" });
    }

    const user = await User.findOne({
      where: { 
        reset_token: token,
        reset_token_exp: { [require('sequelize').Op.gt]: new Date() } 
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Невірний або прострочений токен" });
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password_hash = hashedPassword;
    user.reset_token = null;
    user.reset_token_exp = null;
    await user.save();

    res.json({ message: "Пароль успішно змінено" });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Verify email
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({ where: { verify_token: token } });
  if (!user)
    return res.status(400).json({ message: "Invalid token" });

  user.is_verified = true;
  user.verify_token = null;
  await user.save();

  res.send("Email verified 🎉");
};

//Refresh token
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: "No token" });

    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//Logout
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  const user = await User.findOne({ where: { refresh_token: refreshToken } });
  if (!user) return res.sendStatus(204);

  user.refresh_token = null;
  await user.save();

  res.json({ message: "Logged out" });
  await clearUserCache(user.id);

  res.json({ token });
};

//Захищений маршрут
exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};