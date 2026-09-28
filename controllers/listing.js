const Listing = require("../models/listing");
const geocodeLocation = require("../utils/geocode.js");
const listingCategories = require("../utils/listingCategories.js");

const GEOCODING_RETRY_INTERVAL_MS = 60 * 60 * 1000;

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings, listingCategories });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new", { listingCategories });
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  const hasCoordinates =
    Number.isFinite(listing.latitude) && Number.isFinite(listing.longitude);
  const hasRecentGeocodingAttempt =
    listing.locationGeocodedAt &&
    Date.now() - listing.locationGeocodedAt.getTime() <
      GEOCODING_RETRY_INTERVAL_MS;
  let mapError;

  if (!hasCoordinates && !hasRecentGeocodingAttempt) {
    let coordinates;

    try {
      coordinates = await geocodeLocation(listing.location, listing.country);
    } catch (error) {
      console.error(`Could not geocode listing ${listing._id}:`, error);
      mapError =
        "The location map is temporarily unavailable. Please try again later.";
      listing.locationGeocodedAt = new Date();
      await listing.save();
    }

    if (!mapError) {
      listing.locationGeocodedAt = new Date();
      if (coordinates) {
        listing.latitude = coordinates.latitude;
        listing.longitude = coordinates.longitude;
      }
      await listing.save();

      if (!coordinates) {
        mapError =
          "We couldn't find this location. Check the listing's location and country.";
      }
    }
  } else if (!hasCoordinates) {
    mapError =
      "The location map is temporarily unavailable. Please try again later.";
  }

  res.render("listings/show", { listing, mapError });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created Sucessfully");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing, listingCategories });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  const locationChanged =
    listing.location !== req.body.listing.location ||
    listing.country !== req.body.listing.country;

  listing.set(req.body.listing);

  if (locationChanged) {
    listing.latitude = undefined;
    listing.longitude = undefined;
    listing.locationGeocodedAt = undefined;
  }

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", " Listing updated Sucessfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", " Listing deleted Sucessfully");
  res.redirect("/listings");
};
