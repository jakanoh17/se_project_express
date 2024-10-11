const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { badRequest, notFound } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error(badRequest.message);
    }
    const user = await User.findUserByCredentials(email, password);
    const window = typeof window;
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.send({ window, token });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error(notFound.message))
    .then((currentUser) => {
      res.send(currentUser);
    })
    .catch(next);
};

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, avatar, email, password: hash });
    const foundUser = await User.findById(newUser._id);
    res.status(201).send(foundUser);
  } catch (err) {
    // Could possibly throw 11000 error from MongoDB for duplicate user
    next(err);
  }
};

const updateCurrentUser = (req, res, next) => {
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
      res.send(updatedUser);
    })
    .catch(next);
};
module.exports = { createUser, login, getCurrentUser, updateCurrentUser };
