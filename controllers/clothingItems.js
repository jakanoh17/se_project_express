const ClothingItem = require("../models/clothingitem");
const {
  badRequest,
  notFound,
  forbiddenError,
  mapAndSendErrors,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((foundItems) => {
      res.send(foundItems);
    })
    .catch((err) => {
      mapAndSendErrors(err, res);
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((newItem) => {
      res.status(201).send({ data: newItem });
    })
    .catch((err) => {
      mapAndSendErrors(err, res);
    });
};

const deleteItem = async (req, res) => {
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
    mapAndSendErrors(err, res);
  }
};

const likeItem = (req, res) => {
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
    .catch((err) => {
      mapAndSendErrors(err, res);
    });
};

const unlikeItem = (req, res) => {
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
    .catch((err) => {
      mapAndSendErrors(err, res);
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
