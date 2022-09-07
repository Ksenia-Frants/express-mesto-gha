const helmet = require("helmet");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./routes");

const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: "62eff4b2a051020c723aaf72",
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);

app.use(router);

app.listen(PORT);
