const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require('../src/middleware/auth.middleware');
const role = require("../src/middleware/role.middleware");
const user = require('../controllers/user.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: user@gmail.com
 *         username:
 *           type: string
 *           example: yaro
 *         display_name:
 *           type: string
 *           example: Yaroslav
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Отримати список користувачів
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список користувачів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", userController.getUsers);
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Створити нового користувача
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, username]
 *             properties:
 *               email:
 *                 type: string
 *                 example: newuser@gmail.com
 *               username:
 *                 type: string
 *                 example: new_user
 *     responses:
 *       200:
 *         description: Користувача створено
 */
router.post("/", userController.createUser);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Оновити display_name користувача
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID користувача
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [display_name]
 *             properties:
 *               display_name:
 *                 type: string
 *                 example: Yaroslav Shafinskiy
 *     responses:
 *       200:
 *         description: Користувача оновлено
 */
router.put("/:id", userController.updateUser);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Видалити користувача
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID користувача
 *     responses:
 *       200:
 *         description: Користувача видалено
 */
router.delete("/:id", authMiddleware, role("admin"), userController.deleteUser);
/**
 * @swagger
 * /api/users/dev/{id}:
 *   delete:
 *     summary: Delete user by ID (DEV, no auth)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete("/dev/:id", userController.deleteUserByIdDev);

module.exports = router;