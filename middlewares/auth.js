const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-err");

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  if (!token) {
    throw new UnauthorizedError("Необходима авторизация.");
  }

  try {
    payload = jwt.verify(token, process.env["JWT_SECRET"]);
  } catch (err) {
    throw new UnauthorizedError("Необходима авторизация.");
  }

  req.user = payload;

  next();
};
