const express = require("express");
const router = express.Router();

const gameController = require("../controllers/game.controller");
const cache = require("../src/middleware/cache.middleware");

router.get("/", cache("games"), gameController.getGames);
router.post("/", gameController.createGame);

module.exports = router;