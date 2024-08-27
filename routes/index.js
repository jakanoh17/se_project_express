const { login, createUser } = require("../controllers/users");
const index = require("express").Router();

index.post("/signup", createUser);
index.post("/signin", login);

module.exports = index;
