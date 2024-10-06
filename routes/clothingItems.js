const clothingItems = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  validateNewClothingItem,
  validateClothingId,
} = require("../middlewares/validaton");

clothingItems.get("/", getItems);
clothingItems.post("/", auth, validateNewClothingItem, createItem);
clothingItems.delete("/:itemId", auth, validateClothingId, deleteItem);
clothingItems.put("/:itemId/likes", auth, validateClothingId, likeItem);
clothingItems.delete("/:itemId/likes", auth, validateClothingId, unlikeItem);

module.exports = clothingItems;
