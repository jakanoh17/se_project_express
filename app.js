const express = require("express");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const app = express();
const users = require("./routes/users");
const clothingItems = require("./routes/clothingItems");

const { PORT = 3001 } = process.env;
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "66b80912ecacfa5eb732c0ba",
  };
  next();
});

app.use("/users", users);
app.use("/items", clothingItems);

app.listen(PORT, () => {
  console.log(`App listing on port: ${PORT}`);
});
