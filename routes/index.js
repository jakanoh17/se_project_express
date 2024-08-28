const index = require("express").Router();
const { login, createUser } = require("../controllers/users");

index.post("/signup", createUser);
index.post("/signin", login);

module.exports = index;
