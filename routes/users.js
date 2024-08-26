const users = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

users.get("/me", auth, getCurrentUser);
users.patch("/me", auth, updateCurrentUser);

module.exports = users;
