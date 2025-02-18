const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { start } = require("node:repl");
const url = require("node:url");
const replaceTemplate = require("./starter/modules/replaceTemplate");
const slugify = require("slugify");

/////////////// FILES .....
// Blocking, synchronous code
//
// const inputText = fs.readFileSync("./starter/txt/input.txt", "utf-8");
// console.log(inputText);

// const outputText = `This is what we know about the avocado: ${inputText}.\nCreated on ${Date.now()}`;

// fs.writeFileSync("./starter/txt/output.txt", outputText);
// console.log("File written!");

// const inputText2 = fs.readFileSync("./starter/txt/output.txt", "utf-8");
// console.log(inputText2);

// Non-blocking, asynchronous code
//
// fs.readFile("./starter/txt/start.txt", "utf-8", (err, data1) => {
// 	fs.readFile(`./starter/txt/${data1}.txt`, "utf-8", (err, data2) => {
// 		console.log(data2);
// 		fs.readFile("./starter/txt/append.txt", "utf-8", (err, data3) => {
// 			console.log(data3);

// 			fs.writeFile(
// 				"./starter/txt/final.txt",
// 				`${data2}\n${data3}`,
// 				"utf-8",
// 				(err) => {
// 					console.log("Your file has been written 😁");
// 				},
// 			);
// 		});
// 	});
// });
// console.log("Will read file!");

////////////////// SERVER ....

// Read templates
const tempOverview = fs.readFileSync(
	`${__dirname}/starter/templates/template-overview.html`,
	"utf-8",
);
const tempCard = fs.readFileSync(
	`${__dirname}/starter/templates/template-card.html`,
	"utf-8",
);
const tempProduct = fs.readFileSync(
	`${__dirname}/starter/templates/template-product.html`,
	"utf-8",
);

// Read and parse data
const data = fs.readFileSync(
	`${__dirname}/starter/dev-data/data.json`,
	"utf-8",
);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
	const { pathname, query } = url.parse(req.url, true);

	// Overview Page
	if (pathname === "/" || pathname === "/overview") {
		res.writeHead(200, { "Content-Type": "text/html" });

		const cardsHtml = dataObj
			.map((el) => replaceTemplate(tempCard, el))
			.join("");
		const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

		res.end(output);

		// Product Page (Handles ?id=0)
	} else if (pathname === "/product") {
		const product = dataObj[query.id];

		if (!product) {
			res.writeHead(404, { "Content-Type": "text/html" });
			res.end("<h1>Product not found!</h1>");
		} else {
			res.writeHead(200, { "Content-Type": "text/html" });
			const output = replaceTemplate(tempProduct, product);
			res.end(output);
		}

		// API Route
	} else if (pathname === "/api") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(data);

		// Not Found
	} else {
		res.writeHead(404, {
			"Content-Type": "text/html",
			"my-own-header": "hello-world",
		});
		res.end("<h1>Page not found!</h1>");
	}
});

server.listen(8000, "localhost", () => {
	console.log("Listening to requests on port 8000");
});
