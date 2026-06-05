const Listing = require("../Models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const { formatDate } = require("../utilis/date.js");
const ExpressError = require("../utilis/ExpressError.js");
const stopWords = require("../utilis/data.js");

module.exports.index = async (req, res) => {
  const [
    allListings,
    Jaipur,
    Goa,
    Delhi,
    Pune,
    Gurgaon,
    Jodhpur,
    Bengaluru,
    Udaipur,
  ] = await Promise.all([
    Listing.aggregate([{ $sample: { size: 20 } }]),
    Listing.aggregate([
      { $match: { location: "Jaipur" } },
      { $sample: { size: 6 } },
    ]),
    Listing.aggregate([
      { $match: { location: "Goa" } },
      { $sample: { size: 6 } },
    ]),
    Listing.aggregate([
      { $match: { location: "Delhi" } },
      { $sample: { size: 6 } },
    ]),
    Listing.aggregate([
      { $match: { location: "Pune" } },
      { $sample: { size: 6 } },
    ]),
    Listing.aggregate([
      { $match: { location: "Gurgaon" } },
      { $sample: { size: 6 } },
    ]),
    Listing.aggregate([
      { $match: { location: "Jodhpur" } },
      { $sample: { size: 6 } },
    ]),
    Listing.aggregate([
      { $match: { location: "Bengaluru" } },
      { $sample: { size: 6 } },
    ]),
    Listing.aggregate([
      { $match: { location: "Udaipur" } },
      { $sample: { size: 6 } },
    ]),
  ]);

  const featuredLocations = {
    Jaipur,
    Goa,
    Delhi,
    Pune,
    Gurgaon,
    Jodhpur,
    Bengaluru,
    Udaipur,
  };

  res.render("listings/index.ejs", { allListings, featuredLocations });
};

module.exports.renderNewForm = (req, res, next) => {
  res.render("listings/new.ejs");
};

module.exports.showLiisting = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist !");
    return res.redirect("/listings");
  }
  let avg = (
    listing.reviews.reduce((total, r) => total + r.rating, 0) /
    listing.reviews.length
  ).toFixed(1);
  res.render("listings/show.ejs", { listing, avg, formatDate });
};

module.exports.createListing = async (req, res) => {
  let responce = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  
  let Newlisting = new Listing(req.body.listing);
  Newlisting.image = {
    url,
    filename,
  };
  Newlisting.owner = req.user._id;
  
  Newlisting.geometry = responce.body.features[0].geometry;
  let savedListing = await Newlisting.save();
  req.flash("success", "New Listing Created !");
  return res.redirect("/listings");
};

module.exports.showEditform = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist !");
    res.redirect("/listings");
  }
  let originalImg = listing.image.url;
  originalImg = originalImg.replace("/upload", "/upload/w_230");
  res.render("listings/edit.ejs", { listing, originalImg });
 
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }
  req.flash("success", "Listing Updated !");
 
  res.redirect(`/listings/${id}`);
};

module.exports.searchlistings = async (req, res, next) => {
  const search = req.query.s;

  if (!search || search.length == 0) {
    next(new ExpressError(404, "Plese search a valid listing!"));
    return;
  }

  

  const query = search
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => !stopWords.includes(word))
    .join("|");

  

  if (!query) {
    next(new ExpressError(404, "Plese search a valid listing!"));
    return;
  }

  const allListings = await Listing.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
      { country: { $regex: query, $options: "i" } },
    ],
  });

  res.render("listings/search.ejs", { allListings });
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", `Listing  ${deletedListing.title}  Deleted !`);
  res.redirect("/listings");
};
