const clothingItems = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

clothingItems.get("/", getItems);
clothingItems.post("/", createItem);
clothingItems.delete("/:itemId", deleteItem);
clothingItems.put("/:itemId/likes", likeItem);
clothingItems.delete("/:itemId/likes", unlikeItem);

module.exports = clothingItems;
