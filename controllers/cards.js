const Card = require("../models/card");
const NotFoundError = require("../errors/not-found-err");
const { DEFAULT_ERROR } = require("../utils/errorCodes");
const BadRequestError = require("../errors/bad-request-err");

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError(
          "Переданы некорректные данные при создании карточки."
        );
      }
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка с указанным _id не найдена.");
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError(
          "Переданы некорректные данные при удалении карточки."
        );
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Передан несуществующий _id карточки.");
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError(
          "Переданы некорректные данные для постановки лайка."
        );
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Передан несуществующий _id карточки.");
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError(
          "Переданы некорректные данные для снятия лайка."
        );
      }
    })
    .catch(next);
};
