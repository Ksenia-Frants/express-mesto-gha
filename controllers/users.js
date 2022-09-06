const User = require("../models/user");
const {
  INCORRECT_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errorCodes");

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  User.create({
    name,
    about,
    avatar,
    email,
    password,
  })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(INCORRECT_DATA_ERROR).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Произошла ошибка." });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: "Произошла ошибка." });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Пользователь по указанному _id не найден." });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(INCORRECT_DATA_ERROR).send({
          message: "Переданы некорректные данные при обращении к пользователю.",
        });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: `${err.name} ${err.message}` });
      }
    });
};

module.exports.updateUser = (req, res) => {
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
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Пользователь с указанным _id не найден." });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(INCORRECT_DATA_ERROR).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Произошла ошибка." });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
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
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Пользователь с указанным _id не найден." });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(INCORRECT_DATA_ERROR).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Произошла ошибка." });
      }
    });
};
