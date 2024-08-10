const User = require("../models/user");

const getUsers = async (req, res) => {
  const foundUsers = await User.find({});
  res.status(200).send(foundUsers);
};

const getUser = async (req, res) => {
  try {
    await User.findById(req.params.userId);
    res.status(200).send(foundUser);
  } catch {
    res.status(404).send({
      message: "Requested resource not found",
    });
  }
};

// This is not working correctly
const createUser = async (req, res) => {
  const { name, avatar } = req.body;
  const newUser = await User.create({ name, avatar });
  res.status(201).send(newUser);
};

module.exports = { getUsers, getUser, createUser };
