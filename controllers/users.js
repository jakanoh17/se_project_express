const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const { errorMsg400, errorMsg404, errorMsg500 } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((foundUsers) => {
      res.status(200).send(foundUsers);
    })
    .catch((err) => {
      console.error(`Error: ${err.name}`);
      if (err.name === "ValidationError") {
        res.status(400).send({ error: err.message });
      } else if (err.name === "UnfoundResourceError") {
        res.status(404).send({ error: err.message });
      } else {
        res.status(500).send(errorMsg500);
      }
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).send({ error: errorMsg400 });
    return;
  }

  User.findById(userId)
    .orFail(() => {
      const unfoundResourceErr = new Error(errorMsg404);
      unfoundResourceErr.name = "UnfoundResourceError";
      throw unfoundResourceErr;
    })
    .then((foundUser) => {
      res.status(200).send(foundUser);
    })
    .catch((err) => {
      console.error(`Error: ${err.name}`);
      if (err.name === "CastError") {
        res.status(400).send({ error: errorMsg400 });
      } else if (err.name === "UnfoundResourceError") {
        res.status(404).send({ error: errorMsg404 });
      } else {
        res.status(500).send({ error: errorMsg500 });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  if (!name || !avatar) {
    res.status(400).send({ error: errorMsg400 });
    return;
  }

  User.create({ name, avatar })
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      if (err.name === "ValidationError") {
        res.status(400).send({ error400: err.message });
      }
      res.status(500).send(errorMsg500);
    });
};

module.exports = { getUsers, getUser, createUser };
