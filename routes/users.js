const users = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const {
  validateUpdatedUserData,
  validateUserId,
} = require("../middlewares/validaton");

users.get("/me", auth, validateUserId, getCurrentUser);
users.patch("/me", auth, validateUpdatedUserData, updateCurrentUser);

module.exports = users;
