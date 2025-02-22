const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.singup = catchAsync(async (req, res) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	const token = jwt.sing({ id: newUser._id }, "secret", { expiresIn: "90d" });

	res.status(201).json({
		status: "success",
		data: {
			user: newUser,
		},
	});
});
