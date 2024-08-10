const clothingItems = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");

clothingItems.get("/", getItems);
clothingItems.post("/", createItem);
clothingItems.delete("/:itemId", deleteItem);

module.exports = clothingItems;
