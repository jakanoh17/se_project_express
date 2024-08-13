const User = require("../models/user");
const { errorMsg400, errorMsg404, errorMsg500 } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((foundUsers) => {
      res.send(foundUsers);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      res.status(500).send({ message: errorMsg500 });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const unfoundResourceErr = new Error(errorMsg404);
      unfoundResourceErr.name = "UnfoundResourceError";
      throw unfoundResourceErr;
    })
    .then((foundUser) => {
      res.send(foundUser);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      if (err.name === "CastError") {
        res.status(400).send({ message: errorMsg400 });
      } else if (err.name === "UnfoundResourceError") {
        res.status(404).send({ message: errorMsg404 });
      } else {
        res.status(500).send({ message: errorMsg500 });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(400).send({ message: errorMsg400 });
      } else {
        res.status(500).send({ message: errorMsg500 });
      }
    });
};

module.exports = { getUsers, getUser, createUser };
