const db = require("../config/db");
const User = require("../models/user.model");

// SELECT
exports.getUsers = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Users");
  console.log("GET USERS:", rows);
  res.json(rows);
};

// INSERT
exports.createUser = async (req, res) => {
  const { email, username } = req.body;

  const [result] = await db.query(
    "INSERT INTO Users (email, username, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())",
    [email, username]
  );

  console.log("USER CREATED:", result);

  res.json({
    message: "User created",
    insertId: result.insertId
  });
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { display_name } = req.body;

  const [result] = await db.query(
    "UPDATE Users SET display_name = ? WHERE id = ?",
    [display_name, id]
  );

  console.log("USER UPDATED:", result);

  res.json({
    message: "User updated",
    affectedRows: result.affectedRows
  });
};

// DELETE
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const [result] = await db.query(
    "DELETE FROM Users WHERE id = ?", [id]
  );

  console.log("USER DELETED:", result);

  res.json({
    message: "User deleted",
    affectedRows: result.affectedRows
  });
};

// DEV DELETE WITHOUT TOKEN (for Swagger testing)
exports.deleteUserByIdDev = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await User.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({
      status: "success",
      message: `User ${id} deleted (DEV MODE)`,
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};