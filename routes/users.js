const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getMyUser,
} = require('../controllers/users');
const {
  validateGetUser,
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getMyUser);
router.get('/:userId', validateGetUser, getUser);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
