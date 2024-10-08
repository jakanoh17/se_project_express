const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { unauthorizedUserError } = require("../utils/errors");

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new Error(unauthorizedUserError.message);
  }
  // payload contains user._id
  try {
    const token = authorization.replace("Bearer ", "");
    await jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.user = decoded;
        return;
      }
      throw new Error(unauthorizedUserError.message);
    });
  } catch (err) {
    next(err);
  }
  next();
};

module.exports = auth;
