const jwt = require("jsonwebtoken");
const JWT_TOKEN = require("../utils/config");
const { unauthorizedUserError, mapAndSendErrors } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new Error(unauthorizedUserError.message);
  }
  // payload contains user._id
  try {
    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_TOKEN);
    req.user = payload;
  } catch {
    mapAndSendErrors(err, res);
  }
  next();
};

module.exports = auth;
