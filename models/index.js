const User = require("./user.model");
const Game = require("./game.model");
const Review = require("./review.model");

// User → Review
User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

// Game → Review
Game.hasMany(Review, { foreignKey: "game_id" });
Review.belongsTo(Game, { foreignKey: "game_id" });

module.exports = { User, Game, Review };