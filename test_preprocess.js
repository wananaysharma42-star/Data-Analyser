import { preprocessSingleData } from './src/utils/preprocess.js';
const data = [{a: 1, b: "x"}, {a: 2, b: "y"}];
console.log(JSON.stringify(preprocessSingleData(data), null, 2));
