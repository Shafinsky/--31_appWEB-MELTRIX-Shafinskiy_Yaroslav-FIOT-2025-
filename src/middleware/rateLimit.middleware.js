const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 хв
  max: 100, // максимум 100 запитів з IP
  message: {
    error: "Too many requests. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;