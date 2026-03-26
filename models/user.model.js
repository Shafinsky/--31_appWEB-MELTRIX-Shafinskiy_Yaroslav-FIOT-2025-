const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  email: { type: DataTypes.STRING, unique: true },
  password_hash: { type: DataTypes.STRING },

  username: { type: DataTypes.STRING, unique: true },
  display_name: { type: DataTypes.STRING },

  avatar_url: { type: DataTypes.STRING },

  role: {
    type: DataTypes.ENUM("user", "publisher", "admin"),
    defaultValue: "user",
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = User;