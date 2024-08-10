const ClothingItem = require("../models/clothingitem");

const getItems = async (req, res) => {
  const foundItems = await ClothingItem.find({});
  res.status(200).send(foundItems);
};

const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const createdItem = await ClothingItem.create({ name, weather, imageUrl });
    res.status(201).send({ data: createdItem });
  } catch {
    res.status(404).send({ message: "Resource could not be created" });
  }
};

const deleteItem = async (req, res) => {
  try {
    await ClothingItem.findByIdAndRemove(req.params.itemId);
    res.status(200).send({ message: "Resource has been deleted" });
  } catch {
    res.status(404).send({
      message: "Requested resource not found",
    });
  }
};

module.exports = { getItems, createItem, deleteItem };
