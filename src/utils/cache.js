const redisClient = require("../config/redis");

exports.clearUserCache = async (userId) => {
  await redisClient.del(`user:${userId}`);
};