// console.log(arguments);
// console.log(require("module").wrapper);

// module.exports
const C = require("./test-module-1");
const calc1 = new C();
console.log(calc1.add(2, 5));

// exports
// const calc2 = require("./test-module-2");
const { add, multiply } = require("./test-module-2");
console.log(multiply(2, 5));

// caching
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();



//ES
// Import class from test-module-1
// import C from "./test-module-1.js";
// const calc1 = new C();
// console.log(calc1.add(2, 5));

// // Import named exports from test-module-2
// import { add, multiply } from "./test-module-2.js";
// console.log(multiply(2, 5));

// // Import and execute test-module-3
// import testModule3 from "./test-module-3.js";
// testModule3();
// testModule3();
// testModule3();
