const User = require("../models/user");
const { badRequest, notFound, serverError } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((foundUsers) => {
      res.send(foundUsers);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      res.status(serverError.status).send({ message: serverError.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const unfoundResourceErr = new Error(notFound.message);
      unfoundResourceErr.name = "UnfoundResourceError";
      throw unfoundResourceErr;
    })
    .then((foundUser) => {
      res.send(foundUser);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      if (err.name === "CastError") {
        res.status(badRequest.status).send({ message: badRequest.message });
      } else if (err.name === "UnfoundResourceError") {
        res.status(notFound.status).send({ message: notFound.message });
      } else {
        res.status(serverError.status).send({ message: serverError.message });
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
        res.status(badRequest.status).send({ message: badRequest.message });
      } else {
        res.status(serverError.status).send({ message: serverError.message });
      }
    });
};

module.exports = { getUsers, getUser, createUser };
