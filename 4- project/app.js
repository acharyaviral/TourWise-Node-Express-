const path = require("node:path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

/**
 * GLOBAL MIDDLEWARES
 */

// Security: Set HTTP headers
app.use(helmet());

// Serving static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Logging middleware (only in development mode)
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Rate limiting: Restrict requests from the same IP
app.use(
	"/api",
	rateLimit({
		max: 100,
		windowMs: 60 * 60 * 1000,
		message: "Too many requests from this IP, please try again in an hour!",
	}),
);

// Body parser: Limits request body size
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution, allowing certain query parameters
app.use(
	hpp({
		whitelist: [
			"duration",
			"ratingsQuantity",
			"ratingsAverage",
			"maxGroupSize",
			"difficulty",
			"price",
		],
	}),
);

// Middleware to add request timestamp
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// ROUTES
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// Handle undefined routes
app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
