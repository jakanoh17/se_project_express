const users = require("express").Router();
const { getUser, getUsers, createUser } = require("../controllers/users");

users.get("/", getUsers);

users.get("/:userId", getUser);

users.post("/", createUser);

module.exports = users;
