const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const UnauthorizedError = require("../errors/unauthorized-err");
const ConflictError = require("../errors/conflict-err");
const { JWT_SECRET } = require("../utils/config");

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => res.status(201).send(user.toJSON()))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError(
          "Переданы некорректные данные при создании пользователя."
        );
      }

      if (err.code === 11000) {
        throw new ConflictError("Пользователь с таким email уже существует.");
      }
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь по указанному _id не найден.");
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError(
          "Переданы некорректные данные при обращении к пользователю."
        );
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь с указанным _id не найден.");
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError(
          "Переданы некорректные данные при обновлении профиля."
        );
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь с указанным _id не найден.");
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError(
          "Переданы некорректные данные при обновлении аватара."
        );
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // const { NODE_ENV, JWT_SECRET = "dev-secret" } = process.env;

  return User.findUserByCredentials(email, password)

    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch(() => {
      throw new UnauthorizedError("Необходима авторизация.");
    })
    .catch(next);
};

module.exports.getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь по указанному _id не найден.");
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError(
          "Переданы некорректные данные при обращении к пользователю."
        );
      } else {
        next(err);
      }
    })
    .catch(next);
};
