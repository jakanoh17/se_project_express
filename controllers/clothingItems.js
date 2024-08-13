const ClothingItem = require("../models/clothingitem");
const { errorMsg400, errorMsg404, errorMsg500 } = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .orFail(() => {
      const unfoundResourceErr = new Error(errorMsg404);
      unfoundResourceErr.name = "UnfoundResourceError";
      throw unfoundResourceErr;
    })
    .then((foundItems) => {
      res.status(200).send(foundItems);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      if (err.name === "UnfoundResourceError") {
        res.status(404).send(err.message);
      } else {
        res.status(500).send(errorMsg500);
      }
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  if (!name || !weather || !imageUrl) {
    res.status(400).send({ message: errorMsg400 });
    return;
  }

  ClothingItem.create({ name, weather, imageUrl })
    .then((newItem) => {
      console.log(req.user._id);
      res.status(201).send({ data: newItem });
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: errorMsg500 });
      }
    });
};

const deleteItem = async (req, res) => {
  if (!req.params.itemId) {
    res.status(400).send({ message: errorMsg400 });
    return;
  }

  try {
    await ClothingItem.findByIdAndRemove(req.params.itemId).orFail(() => {
      const unfoundResourceErr = new Error(errorMsg404);
      unfoundResourceErr.name = "UnfoundResourceError";
      throw unfoundResourceErr;
    });
    res.status(200).send({ message: "Resource has been deleted" });
  } catch (err) {
    console.error(`Error: ${err}`);
    if (err.name === "CastError") {
      res.status(400).send({ message: errorMsg400 });
    } else if (err.name === "UnfoundResourceError") {
      res.status(404).send({ message: err.message });
    } else {
      res.status(500).send({ message: errorMsg500 });
    }
  }
};

const likeItem = (req, res) => {
  console.log(req.params.itemId);
  if (!req.user._id) {
    res.status(400).send({ message: errorMsg400 });
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
      const unfoundResourceErr = new Error(errorMsg404);
      unfoundResourceErr.name = "UnfoundResourceError";
      throw unfoundResourceErr;
    })
    .then((updatedItem) => {
      res.status(200).send(updatedItem);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(400).send({ message: err.message });
      } else if (err.name === "UnfoundResourceError") {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: errorMsg500 });
      }
    });
};

const unlikeItem = (req, res) => {
  if (!req.user._id) {
    res.status(400).send({ message: errorMsg400 });
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
      const unfoundResourceErr = new Error(errorMsg404);
      unfoundResourceErr.name = "UnfoundResourceError";
      throw unfoundResourceErr;
    })
    .then((updatedItem) => {
      res.status(200).send(updatedItem);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(400).send({ message: err.message });
      } else if (err.name === "UnfoundResourceError") {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: errorMsg500 });
      }
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
