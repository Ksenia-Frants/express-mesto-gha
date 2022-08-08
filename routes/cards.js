const router = require('express').Router();
const { createCard, getCards, deleteCard } = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', createCard);

router.delete('/cards/:cardId', deleteCard);
