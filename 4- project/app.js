const fs = require("node:fs");

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// app.get("/", (req, res) => {
// 	res.status(200).json({ message: "Hello World!" });
// });

// app.post("/", (req, res) => {
// 	res.status(200).json({ message: "Hello World!" });
// });

const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/data/tours.json`),
);

app.get("/api/v1/tours", (req, res) => {
	res.status(200).json({
		status: "success",
		results: tours.length,
		data: { tours },
	});
});

app.post("/api/v1/tours", (req, res) => {
	// console.log(req.body);

	const newId = tours[tours.length - 1].id + 1;
	const newTour = Object.assign({ id: newId }, req.body);
	tours.push(newTour);

	fs.writeFile(
		`${__dirname}/dev-data/data/tours.json`,
		JSON.stringify(tours),
		(err) => {
			res.status(201).json({
				status: "success",
				data: {
					tour: newTour,
				},
			});
			console.log("The file was saved!");
		},
	);
});

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
