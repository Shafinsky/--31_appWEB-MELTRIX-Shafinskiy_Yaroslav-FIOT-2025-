const Game = require("../models/game.model");

// CREATE
exports.createGame = async (req, res) => {
  const game = await Game.create(req.body);
  console.log("GAME CREATED:", game.toJSON());
  res.json(game);
};

// GET ALL
exports.getGames = async (req, res) => {
  const games = await Game.findAll();
  console.log("ALL GAMES:", games.map(g => g.toJSON()));
  res.json(games);
};