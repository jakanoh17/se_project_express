const index = require("express").Router();
const { login, createUser } = require("../controllers/users");
const {
  validateNewUserData,
  validateAuthenticationData,
} = require("../middlewares/validaton");

index.post("/signup", validateNewUserData, createUser);
index.post("/signin", validateAuthenticationData, login);

module.exports = index;
