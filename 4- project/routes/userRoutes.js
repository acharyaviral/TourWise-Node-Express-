const express = require("express");
const multer = require("multer");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

/**
 * Public Authentication Routes
 */
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

/**
 * User-Specific Routes
 */
router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch(
	"/updateMe",
	userController.uploadUserPhoto,
	userController.resizeUserPhoto,
	userController.updateMe,
);
router.delete("/deleteMe", userController.deleteMe);

// Restrict the following routes to admin only
router.use(authController.restrictTo("admin"));

// Admin-Only User Management Routes
router
	.route("/")
	.get(userController.getAllUsers)
	.post(userController.createUser);

router
	.route("/:id")
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
