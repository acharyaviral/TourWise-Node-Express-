import fs from "node:fs";
import { get } from "node:http";
import superagent from "superagent";

const readFilePro = (file) => {
	return new Promise((resolve, reject) => {
		fs.readFile(file, "utf-8", (err, data) => {
			if (err) reject("I could not find that file 😢");
			resolve(data);
		});
	});
};

const writeFilePro = (file, data) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(file, data, (err) => {
			if (err) reject("Could not write file 😢");
			resolve("success");
		});
	});
};

const getDogPic = async () => {
	try {
		const breed = await readFilePro(`${__dirname}/dog.txt`);

		const res = await superagent.get(
			`https://dog.ceo/api/breed/${breed}/images/random`,
		);
		console.log(res.body.message);

		await writeFilePro("dog-img.txt", body.message);
		console.log("Randome dog file saved");
	} catch (err) {
		console.log(err);
		throw err;
	}
	return "2";
};
console.log("1st");
getDogPic().then((x) => {
	console.log(x);
	console.log("3");
});




// readFilePro(`${__dirname}/dog.txt`)
// 	.then((data) => {
// 		console.log(`Breed: ${data}`);
// 		return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
// 	})
// 	.then((res) => {
// 		console.log(res.body.message);
// 		return writeFilePro("dog-img.txt", res.body.message);
// 	})
// 	.then(() => console.log("Random dog image saved to file!"))
// 	.catch((err) => console.error(err));
