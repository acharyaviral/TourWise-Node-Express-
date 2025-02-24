const fs = require("node:fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
	console.log("DB connection successful!");
});

//  CMD
//node ./dev-data/data/import-dev-data.js --delete
//node ./dev-data/data/import-dev-data.js --import

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

// Import data
const importData = async () => {
	try {
		await Tour.create(tours); // Removed extra JSON.parse()
		console.log("Data successfully loaded!");
		process.exit(); // Ensure script exits
	} catch (err) {
		console.error(err);
		process.exit(1); // Exit with error
	}
};

// DELETE All data from DB
const deleteData = async () => {
	try {
		await Tour.deleteMany();
		console.log("Data successfully deleted!");
		process.exit(); // Ensure script exits
	} catch (err) {
		console.error(err);
		process.exit(1); // Exit with error
	}
};

if (process.argv[2] === "--import") {
	importData();
} else if (process.argv[2] === "--delete") {
	deleteData();
} else {
	console.log("Invalid command. Use --import or --delete.");
	process.exit(1);
}
