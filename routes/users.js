const router = require("express").Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getMyUser,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getMyUser);
router.get("/:userId", getUser);
router.patch("/me", updateUser);
router.patch("/me/avatar", updateAvatar);

module.exports = router;
