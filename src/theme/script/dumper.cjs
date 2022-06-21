const { DEFAULT_SCHEMA, load, dump } = require('js-yaml');
const fs = require('fs');

let rawdata = fs.readFileSync('theme.json');
let themeData = JSON.parse(rawdata);

let f = dump(themeData);

console.log(f);
