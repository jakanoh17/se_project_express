const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  unauthorizedUserError,
  notFound,
  mapAndSendErrors,
  badRequest,
} = require("../utils/errors");
const JWT_TOKEN = require("../utils/config");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_TOKEN, { expiresIn: "7d" });
    res.status(200).send({ token });
  } catch (err) {
    mapAndSendErrors(err, res);
  }
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(new Error(notFound.message))
    .then((currentUser) => {
      res.status(200).send(currentUser);
    })
    .catch((err) => {
      mapAndSendErrors(err, res);
    });
};

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, avatar, email, password: hash });
    const foundUser = await User.findById(newUser._id);
    res.status(201).send(foundUser);
  } catch (err) {
    // Could possibly throw 11000 error from MongoDB for duplicate user
    mapAndSendErrors(err, res);
  }
};

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      runValidators: true,
      new: true,
    }
  )
    .orFail(new Error(notFound.message))
    .then((updatedUser) => {
      res.status(200).send(updatedUser);
    })
    .catch((err) => {
      mapAndSendErrors(err, res);
    });
};
module.exports = { createUser, login, getCurrentUser, updateCurrentUser };
