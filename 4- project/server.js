const dotenv = require("dotenv");

const mongoose = require("mongoose");

// Handle uncaught exceptions (synchronous errors)
// Must be at top of file to catch all possible exceptions
process.on("uncaughtException", (err) => {
	console.error(err.name, err.message);
	process.exit(1); // Exit process with failure code
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD,
);

mongoose
	.connect(DB)
	.then(() => console.log("DB connection successful!"))
	.catch((err) => console.error("MongoDB Connection Error:", err));

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});

// Handle unhandled promise rejections (asynchronous errors)
process.on("unhandledRejection", (err) => {
	console.error(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
