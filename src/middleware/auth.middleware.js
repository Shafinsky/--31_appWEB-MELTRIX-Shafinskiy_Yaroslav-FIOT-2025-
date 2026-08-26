const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(ApiError.unauthorized("Token missing"));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(ApiError.unauthorized("Invalid token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (e) {
    next(ApiError.unauthorized("Token expired or invalid"));
  }
};