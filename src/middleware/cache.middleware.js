const redisClient = require("../config/redis");

module.exports = (keyPrefix) => async (req, res, next) => {
  try {
    const key = `${keyPrefix}:${req.originalUrl}`;

    const cachedData = await redisClient.get(key);

    if (cachedData) {
      console.log("⚡ CACHE HIT (Redis)");
      return res.json(JSON.parse(cachedData));
    }

    console.log("❌ CACHE MISS");

    // перехоплюємо відповідь контролера
    const originalJson = res.json.bind(res);

    res.json = (body) => {
      redisClient.setEx(key, 60, JSON.stringify(body)); // кеш 60 сек
      return originalJson(body);
    };

    next();
  } catch (err) {
    next();
  }
};