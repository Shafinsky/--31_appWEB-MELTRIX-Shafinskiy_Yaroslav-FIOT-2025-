const logger = require("../utils/logger");

module.exports = function (err, req, res, next) {
  logger.error({
    message: err.message,
    status: err.status || 500,
    url: req.originalUrl,
    method: req.method,
    time: new Date().toISOString(),
  });

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Server error",
  });
};