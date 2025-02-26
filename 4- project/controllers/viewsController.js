const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res) => {
	//Get Tour data from collection
	const tours = await Tour.find();

	//Render the template

	res.status(200).render("base", {
		title: "All Tours",
		tours,
	});
});

exportd.getTour = (req, res) => {
	res.status(200).render("tour", {
		title: "The Forest Hiker",
	});
};
