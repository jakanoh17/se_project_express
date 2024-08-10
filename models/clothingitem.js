const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  weather: { type: String, required: true, enum: ["hot", "warm", "cold"] },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "ImageUrl input is not a valid url",
    },
  },
  // owner: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "user",
  //   required: true,
  // },
  // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  // createdAt: { type: Date, value: Date.now() },
});

module.exports = mongoose.model("clothingitem", clothingItemSchema);
