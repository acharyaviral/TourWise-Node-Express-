const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// Schema definition
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please tell us your name!"],
		maxlength: [40, "Name must have less or equal than 40 characters"],
	},
	email: {
		type: String,
		required: [true, "Please provide an email"],
		unique: true,
		trim: true,
		validate: [validator.isEmail, "Please provide a valid email"],
	},
	photo: String,
	password: {
		type: String,
		required: [true, "Please provide a password"],
		minlength: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, "Please confirm your password"],
		validate: {
			validator: function (el) {
				// Ensure passwordConfirm matches password
				return el === this.password;
			},
			message: "Passwords do not match!",
		},
	},
});

userSchema.pre("save", async function (next) {
	// Only run this function if password was actually modified
	if (!this.isModified("password")) return next();

	//Hash
	this.password = await bcrypt.hash(this.password, 12);

	this.passwordConfirm = undefined;
	next();
});

// biome-ignore lint/complexity/useArrowFunction: <explanation>
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword,
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;
