const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Handle uncaught exceptions (synchronous errors)
process.on("uncaughtException", (err) => {
	console.error(err.name, err.message);
	process.exit(1); // Exit process with failure code
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

// Use the local MongoDB connection
const localDB = "mongodb://127.0.0.1:27017/natours";

mongoose
	.connect(localDB)
	.then(() => console.log("Local DB connection successful!"))
	.catch((err) => console.error("MongoDB Connection Error:", err));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});

// Handle unhandled promise rejections (asynchronous errors)
process.on("unhandledRejection", (err) => {
	console.error(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
