const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  email: { type: DataTypes.STRING, unique: true },
  password_hash: { type: DataTypes.STRING },

  username: { type: DataTypes.STRING, unique: true },
  display_name: { type: DataTypes.STRING },

  avatar_url: { type: DataTypes.STRING },

  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  verify_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  reset_token: {
    type: DataTypes.TEXT,
  },

  reset_token_exp: {
    type: DataTypes.DATE,
  },

  role: {
    type: DataTypes.ENUM("user", "publisher", "admin"),
    defaultValue: "user",
    allowNull: false,
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "Users",
  timestamps: true,
});

module.exports = User;