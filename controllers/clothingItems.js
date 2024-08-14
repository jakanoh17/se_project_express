const ClothingItem = require("../models/clothingitem");
const { badRequest, notFound, serverError } = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((foundItems) => {
      res.send(foundItems);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      res.status(serverError.status).send(serverError.message);
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((newItem) => {
      console.log(req.user._id);
      res.status(201).send({ data: newItem });
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      if (err.name === "ValidationError") {
        res.status(badRequest.status).send({ message: badRequest.message });
      } else {
        res.status(serverError.status).send({ message: serverError.message });
      }
    });
};

const deleteItem = async (req, res) => {
  try {
    await ClothingItem.findByIdAndRemove(req.params.itemId).orFail(() => {
      const unfoundResourceErr = new Error(notFound.message);
      unfoundResourceErr.name = "UnfoundResourceError";
      throw unfoundResourceErr;
    });
    res.send({ message: "Resource has been deleted" });
  } catch (err) {
    console.error(`Error: ${err}`);
    if (err.name === "CastError") {
      res.status(badRequest.status).send({ message: badRequest.message });
    } else if (err.name === "UnfoundResourceError") {
      res.status(notFound.status).send({ message: notFound.message });
    } else {
      res.status(serverError.status).send({ message: serverError.message });
    }
  }
};

const likeItem = (req, res) => {
  console.log(req.params.itemId);
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
      const unfoundResourceErr = new Error(notFound.message);
      unfoundResourceErr.name = "UnfoundResourceError";
      throw unfoundResourceErr;
    })
    .then((updatedItem) => {
      res.send(updatedItem);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(badRequest.status).send({ message: badRequest.message });
      } else if (err.name === "UnfoundResourceError") {
        res.status(notFound.status).send({ message: notFound.message });
      } else {
        res.status(serverError.status).send({ message: serverError.message });
      }
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
      const unfoundResourceErr = new Error(notFound.message);
      unfoundResourceErr.name = "UnfoundResourceError";
      throw unfoundResourceErr;
    })
    .then((updatedItem) => {
      res.send(updatedItem);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(badRequest.status).send({ message: badRequest.message });
      } else if (err.name === "UnfoundResourceError") {
        res.status(notFound.status).send({ message: notFound.message });
      } else {
        res.status(serverError.status).send({ message: serverError.message });
      }
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
