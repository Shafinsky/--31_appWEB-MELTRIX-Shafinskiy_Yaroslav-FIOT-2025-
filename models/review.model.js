const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Review = sequelize.define("Review", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  game_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

rating: {
  type: DataTypes.INTEGER,
  allowNull: false,
  validate: {
    min: 1,
    max: 5,
  },
},

  comment: {
    type: DataTypes.TEXT,
  },

  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "REVIEW",
  timestamps: false,
});

module.exports = Review;