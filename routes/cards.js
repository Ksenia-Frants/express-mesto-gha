const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  validateCreateCard,
  validateWithCardId,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateWithCardId, deleteCard);
router.put('/:cardId/likes', validateWithCardId, likeCard);
router.delete('/:cardId/likes', validateWithCardId, dislikeCard);

module.exports = router;
