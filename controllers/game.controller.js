const Game = require("../models/game.model");
const redisClient = require("../src/config/redis");

// CREATE
exports.createGame = async (req, res) => {
  const game = await Game.create(req.body);
  console.log("GAME CREATED:", game.toJSON());
  res.json(game);
};

// GET ALL
exports.getGames = async (req, res, next) => {
  try {
    const games = await Game.findAll();
    console.log("ALL GAMES:", games.map(g => g.toJSON()));

    console.log("DB REQUEST 🔎");

    // запис у кеш на 60 сек
    await redisClient.setEx("games", 60, JSON.stringify(games));

    res.json(games);
  } catch (err) {
    next(err);
  }
};