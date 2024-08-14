const badRequest = { status: 400, message: "Invalid data passed in request" };
const notFound = {
  status: 404,
  message:
    "Resource does not exist OR request was sent to non-existent address",
};
const serverError = {
  status: 500,
  message: "An error has occured on the server",
};

module.exports = {
  badRequest,
  notFound,
  serverError,
};
