const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { notFound } = require("./utils/errors");

mongoose.set("strictQuery", false);

const app = express();

const users = require("./routes/users");
const clothingItems = require("./routes/clothingItems");
const index = require("./routes/index");

const { PORT = 3001 } = process.env;
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
app.use(cors());

app.use(express.json());

app.use("/", index);
app.use("/users", users);
app.use("/items", clothingItems);

app.use((req, res) => {
  res.status(notFound.status).send({ message: notFound.message });
});

app.listen(PORT, () => {
  console.log(`App listing on port: ${PORT}`);
});
