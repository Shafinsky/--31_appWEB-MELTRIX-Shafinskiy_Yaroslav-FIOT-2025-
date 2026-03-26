const express = require("express");
const app = express();
const sequelize = require("./config/sequelize");

const userRoutes = require("./routes/user.routes");
const gameRoutes = require("./routes/game.routes");

app.use(express.json());

// підключаємо API
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);

sequelize.authenticate()
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB error", err));

sequelize.sync()
  .then(() => console.log("Models synced"));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.get("/", (req, res) => {
  res.send("API WORKING 🚀");
});