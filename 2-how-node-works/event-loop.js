const fs = require("node:fs");
const crypto = require("node:crypto");

const start = Date.now();

setTimeout(() => console.log("Timer 1 finished"), 0);
setImmediate(() => console.log("Immediate 1 finished"));

fs.readFile("test-file.txt", () => {
	console.log("Finished");

	setTimeout(() => console.log("Timer 1 finished"), 0);
	setTimeout(() => console.log("Timer 1 finished"), 3000);
	setImmediate(() => console.log("Immediate 1 finished"));

	process.nextTick(() => console.log("Process.nextTick"));

	crypto.pbkdf2("password", "salt", 100000, 1024, "sha512");
	console.log(Date.now() - start, "Password encrypted");
});

console.log("Hello from the top level code");
