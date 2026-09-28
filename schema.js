const Joi = require("joi");
const listingCategories = require("./utils/listingCategories.js");

const listingCategoryValues = listingCategories.map(
  (category) => category.value,
);

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.string()
      .valid(...listingCategoryValues)
      .required(),
    price: Joi.number().required().min(0),

    image: Joi.object({
      filename: Joi.string().allow(""),
      url: Joi.string().allow(""),
    }).allow(null),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
