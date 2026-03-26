const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "mySQLy@r1kkIT!",
  database: "game_store",
});

module.exports = pool.promise();