const router = require("express").Router();
const auth = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const limiter = require("../middleware/rateLimit");
const validate = require("../middleware/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/user.validator");
const cache = require("../middleware/cache.middleware");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Реєстрація користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, confirmPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               confirmPassword:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post("/register", validate(registerSchema), auth.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Логін користувача
 *     tags: [Auth]
 */
router.post("/login", limiter, validate(loginSchema), auth.login);
router.post("/refresh", auth.refresh);
router.post("/logout", auth.logout);
router.put("/change-password", authMiddleware, auth.changePassword);
router.delete("/me", authMiddleware, auth.deleteMe);
router.put("/profile", authMiddleware, auth.updateProfile);
router.get("/profile", authMiddleware, auth.profile);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);
router.get("/verify-email", auth.verifyEmail);
router.get("/me", authMiddleware,cache,auth.getMe);

module.exports = router;