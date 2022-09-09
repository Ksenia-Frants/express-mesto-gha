require("dotenv").config();
const helmet = require("helmet");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require("./routes");
const errorHandler = require("./middlewares/error");
const {
  validateCreateUser,
  validateLogin,
} = require("./middlewares/validation");

const { errors } = require("celebrate");

const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/signup", validateCreateUser, createUser);
app.post("/signin", validateLogin, login);

app.use(auth);

app.use(router);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
