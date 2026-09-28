const mongoose = require("mongoose");
const review = require("./review");
const listingCategories = require("../utils/listingCategories.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  category: {
    type: String,
    enum: listingCategories.map((category) => category.value),
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  locationGeocodedAt: {
    type: Date,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
