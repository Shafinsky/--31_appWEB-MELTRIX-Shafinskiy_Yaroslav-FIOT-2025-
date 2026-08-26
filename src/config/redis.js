const { createClient } = require("redis");

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

redisClient.on("error", (err) =>
  console.log("Redis error:", err)
);

(async () => {
  await redisClient.connect();
  console.log("Redis connected");
})();

module.exports = redisClient;