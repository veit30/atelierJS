// const testFolder = './tests/';
const fs = require('fs');
const path = require('path');

let contents = '';

const writeContenToFile = function (file, content) {
	fs.writeFile(file, content, function (err) {
		if (err) return console.log(err);
		console.log(`bundled p5 types to > ${file}`);
	});
};

const readFileAndGetUsefulContent = function (file) {
	fs.readFile(file, { encoding: 'utf-8' }, function (err, data) {
		if (err) console.log(err);

		let usefulContents = data.slice(data.indexOf('{') + 1, data.lastIndexOf('}'));
		// console.log(usefulContents);

		// contents += `${usefulContents}\n`;

		fs.appendFile('bundle.d.ts', `${usefulContents}`, function (err) {
			if (err) throw err;
			console.log('Saved!');
		});
	});
};

const walk = function (dir, done) {
	var results = [];
	fs.readdir(dir, function (err, list) {
		if (err) return done(err);

		let i = 0;

		(function next() {
			let file = list[i++];
			if (!file) return done(null, results);
			file = path.resolve(dir, file);
			fs.stat(file, function (err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function (err, res) {
						results = results.concat(res);
						next();
					});
				} else {
					results.push(file);
					next();
				}
			});
		})();
	});
};

walk(path.resolve('p5/src/'), function (err, results) {
	if (err) throw err;

	for (let file of results) {
		readFileAndGetUsefulContent(file);
	}
});
