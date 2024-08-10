const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Avatar input is not a valid url",
    },
  },
});

module.exports = mongoose.model("user", userSchema);
