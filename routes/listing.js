const express = require("express");
const router = express.Router();
const WrapAsync = require("../utilis/AsyncWrap.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const { storage } = require("../configCloud.js");

const multer = require("multer");
const upload = multer({ storage });

const listingController = require("../controllers/listing.js");

//New Route
router.get("/new", isLoggedin, listingController.renderNewForm);

//All listings
router
  .route("/")
  .get(WrapAsync(listingController.index))
  .post(
    isLoggedin,
    validateListing,
    upload.single("listing[image]"),
    WrapAsync(listingController.createListing),
  );

//search Route

router
  .route("/search")
  .get( WrapAsync(listingController.searchlistings));

//show route
router
  .route("/:id")
  .get(listingController.showLiisting)
  .put(
    isLoggedin,
    isOwner,
    validateListing,
    upload.single("listing[image]"),
    WrapAsync(listingController.editListing),
  )
  .delete(isLoggedin, isOwner, WrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  WrapAsync(listingController.showEditform),
);



module.exports = router;
