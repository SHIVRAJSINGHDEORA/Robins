const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utilis/AsyncWrap.js");
const { isLoggedin, validateReview, isAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//Review Route
router.post(
  "/",
  isLoggedin,
  validateReview,
  WrapAsync(reviewController.createReview)
);

//Delete review route

router.delete(
  "/:reviewId",
  isLoggedin,
  isAuthor,
  WrapAsync(reviewController.destroyReview)
);

module.exports = router;
