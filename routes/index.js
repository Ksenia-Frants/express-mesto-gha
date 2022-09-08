const router = require("express").Router();
const userRouter = require("./users");
const cardRouter = require("./cards");
const NotFoundError = require("../errors/not-found-err");

router.use("/users", userRouter);
router.use("/cards", cardRouter);
router.use((req, res) => {
  throw new NotFoundError("Страница не найдена.");
});

module.exports = router;
