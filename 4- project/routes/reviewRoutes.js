const reviewController = require("../controllers/reviewController");
const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(reviewController.getAllReviews)
	.post(
		authController.protect,
		authController.restrictTo("user"),
		reviewController.createreview,
	);

module.exports;
