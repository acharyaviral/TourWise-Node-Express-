const AppError = require("../utils/appError");

// Handle Mongoose CastError (invalid ID format)
const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	// Extract the duplicate value from error message using regex
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	// Map through all validation errors and join their messages
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join(". ")}`;
	return new AppError(message, 400);
};

// Error response handler for development environment
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

// Error response handler for production environment
const sendErrorProd = (err, res) => {
	// If error is operational (expected), send details to client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	}
	// If error is programming error or unknown, send generic message
	else {
		console.error("ERROR", err);

		// Send generic error message
		res.status(500).json({
			status: "error",
			message: "Something went wrong!",
		});
	}
};

// Global error handling middleware
module.exports = (err, req, res, next) => {
	// Set default status code and status
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	// Handle errors differently based on environment
	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };

		// Transform common database errors into operational errors
		if (error.name === " CastError") error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);
		if (error.name === "ValidationError")
			error = handleValidationErrorDB(error);

		sendErrorProd(error, res);
	}
};
