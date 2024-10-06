const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { mapAndSendErrors } = require("./utils/errors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose.set("strictQuery", false);

const app = express();

const users = require("./routes/users");
const clothingItems = require("./routes/clothingItems");
const index = require("./routes/index");

const { PORT = 49152 } = process.env;
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(cors());
app.use(express.json());

// REQUESTS
app.use(requestLogger);

app.use("/", index);
app.use("/users", users);
app.use("/items", clothingItems);

// ERRORS
app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  mapAndSendErrors(err, res);
});
// app.use((req, res) => {
//   res.status(notFound.status).send({ message: notFound.message });
// });

app.listen(PORT, () => {
  console.log(`App listing on port: ${PORT}`);
});
