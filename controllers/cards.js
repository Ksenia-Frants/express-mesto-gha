const Card = require("../models/card");
const {
  INCORRECT_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errorCodes");

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(INCORRECT_DATA_ERROR).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Произошла ошибка." });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: "Произошла ошибка." });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Карточка с указанным _id не найдена." });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(INCORRECT_DATA_ERROR).send({
          message: "Переданы некорректные данные при удалении карточки.",
        });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Произошла ошибка." });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({
          message: "Передан несуществующий _id карточки.",
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(INCORRECT_DATA_ERROR).send({
          message: "Переданы некорректные данные для постановки лайка.",
        });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Произошла ошибка." });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({
          message: "Передан несуществующий _id карточки.",
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(INCORRECT_DATA_ERROR).send({
          message: " Переданы некорректные данные для снятия лайка.",
        });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Произошла ошибка" });
      }
    });
};
