require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");
const mongoose = require("mongoose");
const helmet = require("helmet");
const limiter = require("./utils/rateLimiter");

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
const app = express();
const { PORT = 49152 } = process.env;

const users = require("./routes/users");
const clothingItems = require("./routes/clothingItems");
const index = require("./routes/index");
const { mapAndSendErrors, notFound } = require("./utils/errors");
const { requestLogger, errorLogger } = require("./middlewares/logger");

app.use(cors());
app.use(express.json());

// SECURITY
app.use(limiter);
app.use(helmet());

// REQUESTS LOGS
app.use(requestLogger);

// CODE REVIEW CRASH TEST
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", index);
app.use("/users", users);
app.use("/items", clothingItems);

app.use((req, res, next) => {
  next(new Error(notFound.message));
});

// ERRORS
app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  mapAndSendErrors(err, res);
});

app.listen(PORT, () => {
  console.log(`App listing on port: ${PORT}`);
});
