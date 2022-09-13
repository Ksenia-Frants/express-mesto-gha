const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-err");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // const { JWT_SECRET } = process.env;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Необходима авторизация.");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError("Необходима авторизация.");
  }

  req.user = payload;

  next();
};
