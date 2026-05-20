require("dotenv").config();

const express = require("express");
const securityMiddleware = require("./src/middleware/security.middleware");
const rateLimiter = require("./src/middleware/rateLimit.middleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const morgan = require("morgan");
const { Game } = require("./models");
const app = express();
const sequelize = require("./config/sequelize");
const logger = require("./src/utils/logger");

const userRoutes = require("./routes/user.routes");
const gameRoutes = require("./routes/game.routes");
const authRoutes = require("./src/routes/auth.routes");
const perf = require("./src/middleware/performance.middleware");
const errorMiddleware = require("./src/middleware/error.middleware");
app.use("/api/upload", require("./src/routes/upload.routes"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(securityMiddleware);
app.use(rateLimiter);

app.use(morgan("combined"));
app.use(express.json());
app.use(perf);

// підключаємо API
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate()
      .then(() => console.log("DB connected"))
      .catch(err => console.error("DB error", err));

    //await sequelize.sync()
    //  .then(() => console.log("Models synced"));

    // await seedGames();

    const server = app.listen(PORT, () => {
      console.log("Server running on port 3000");
      logger.info(`Server started on port ${PORT}`);
    });

    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();


async function seedGames() {
  const count = await Game.count();
  if (count > 0) {
    console.log("DB already seeded");
    return;
  }

  console.log("Seeding database with games...");

  const games = [];
  for (let i = 1; i <= 1000; i++) {
    games.push({
      title: `Game ${i}`,
      genre: "Action",
      price: Math.floor(Math.random() * 60) + 10,
    });
  }

  await Game.bulkCreate(games);
  console.log("Seeding finished 🚀");
}

app.get("/", (req, res) => {
  res.send("API WORKING 🚀");
});

app.get("/status", (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.use(errorMiddleware);