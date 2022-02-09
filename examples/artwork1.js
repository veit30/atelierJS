const HEIGHT = 800;
const WIDTH = 800;
let size = 1;

let zoom = 1.0;
let zMin = 0.05;
let zMax = 9.0;

let degree = 0;
let sdegree = 0;
let sx = 0;

let x = 0;
let y = 0;

const len = 1e4;
const arr = Array.from({ length: len * 2 });
let minX = x;
let minY = y;
let maxX = x;
let maxY = y;

function setup() {
	pixelDensity(1);
	createCanvas(WIDTH, HEIGHT);
	background(255);
	strokeWeight(size);

	for (let i = 0; i < len * 2; i += 2) {
		degree += sx;
		sx += 0.001;
		x = x + Math.sin(radians(degree)) * size;
		y = y + Math.cos(radians(degree)) * size;

		if (x < minX) minX = x;
		if (y < minY) minY = y;
		if (x > maxX) maxX = x;
		if (y > maxY) maxY = y;

		arr[i] = x;
		arr[i + 1] = y;
	}
	noLoop();
}

function draw() {
	const offX = (maxX + minX) / 2;
	const offY = (maxY + minY) / 2;

	background(255);
	translate(width / 2 - offX, height / 2 - offY);

	let lower = 100;
	const diff = 150;

	stroke(0, 10);

	for (let j = 0; j < 20; j++) {
		scale(zoom);
		for (let i = 0; i < len * 2; i += 2) {
			let current = i % (diff * 2);
			let q = (i / len) * 2;
			let currentLower = lower - abs(lower * q);
			current = current > diff ? diff * 2 - current : current;

			point(arr[i] + log(j) * 10, arr[i + 1] + log(j) * 10);
		}
	}
}

function mouseWheel(event) {
	zoom *= event.delta > 0 ? 1.05 : 0.95;
	zoom = constrain(zoom, zMin, zMax);
	return false;
}
