// This is to validate input before running controller/schema w the data

const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("any.invalid");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("any.invalid");
};

const validateNewClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "any.invalid": 'the "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold"),
  }),
});

const validateNewUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "any.invalid": 'The "avatar" field must be a valid url',
    }),
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": "The 'email' field must be filled in",
      "any.invalid": "The 'email' field must be a valid email",
    }),
    password: Joi.string().required(),
  }),
});

const validateUpdatedUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "any.invalid": 'The "avatar" field must be a valid url',
    }),
  }),
});

const validateAuthenticationData = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "any.invalid": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required(),
  }),
});

// Define the Joi schema for req.user
const userSchema = Joi.object({
  _id: Joi.string().alphanum().length(24).required(), // Validating the MongoDB-like _id
}).unknown(true);

// Custom middleware to validate req.user
function validateUserId(req, res, next) {
  const { error } = userSchema.validate(req.user); // Validate req.user directly

  if (error) {
    return res.status(400).json({ error: error.details[0].message }); // Return validation error
  }
  return next();
}

const validateClothingId = celebrate({
  params: Joi.object().keys({ itemId: Joi.string().alphanum().length(24) }),
});

module.exports = {
  validateNewClothingItem,
  validateNewUserData,
  validateAuthenticationData,
  validateUserId,
  validateClothingId,
  validateUpdatedUserData,
};
