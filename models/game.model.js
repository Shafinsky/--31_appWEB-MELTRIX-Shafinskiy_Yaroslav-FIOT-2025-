const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Game = sequelize.define("Game", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  slug: {
    type: DataTypes.STRING,
    unique: true,
  },

  developer: {
    type: DataTypes.STRING,
  },

  publisher_id: {
    type: DataTypes.INTEGER,
  },

  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },

  discount_price: {
    type: DataTypes.DECIMAL,
  },

  description: {
    type: DataTypes.TEXT,
  },

  image_url: {
    type: DataTypes.STRING,
  },

  trailer_url: {
    type: DataTypes.STRING,
  },

  release_date: {
    type: DataTypes.DATE,
  },

}, {
  tableName: "GAME",
  timestamps: false,
});

module.exports = Game;