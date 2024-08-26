const clothingItems = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

clothingItems.get("/", getItems);
clothingItems.post("/", auth, createItem);
clothingItems.delete("/:itemId", auth, deleteItem);
clothingItems.put("/:itemId/likes", auth, likeItem);
clothingItems.delete("/:itemId/likes", auth, unlikeItem);

module.exports = clothingItems;
