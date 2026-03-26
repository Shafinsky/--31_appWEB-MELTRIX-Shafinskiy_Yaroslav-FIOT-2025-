const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("game_store", "root", "mySQLy@r1kkIT!", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;