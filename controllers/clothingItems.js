const ClothingItem = require("../models/clothingitem");
const { badRequest, notFound, forbiddenError } = require("../utils/errors");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((foundItems) => {
      res.send(foundItems);
    })
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((newItem) => {
      res.status(201).send({ data: newItem });
    })
    .catch(next);
};

const deleteItem = async (req, res, next) => {
  try {
    const foundItem = await ClothingItem.findById(req.params.itemId).orFail(
      () => {
        throw new Error(notFound.message);
      }
    );
    if (req.user._id !== foundItem.owner.id.toString("hex")) {
      throw new Error(forbiddenError.message);
    }
    await ClothingItem.findByIdAndRemove(req.params.itemId);
    res.send({ message: "Resource has been deleted" });
  } catch (err) {
    next(err);
  }
};

const likeItem = (req, res, next) => {
  if (!req.user._id) {
    res.status(badRequest.status).send({ message: badRequest.message });
    return;
  }

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new Error(notFound.message);
    })
    .then((updatedItem) => {
      res.send(updatedItem);
    })
    .catch(next);
};

const unlikeItem = (req, res, next) => {
  if (!req.user._id) {
    res.status(badRequest.status).send({ message: badRequest.message });
    return;
  }

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new Error(notFound.message);
    })
    .then((updatedItem) => {
      res.send(updatedItem);
    })
    .catch(next);
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
