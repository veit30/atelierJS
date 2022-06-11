export default `
const DRAW_ARMS = false;
const COUNT = 10;
const RADIUS = 50;
const ROTATION_SPEED = 1;
const LINE_RADIUS = 2;
const START_X = WIDTH / 2;
const START_Y = HEIGHT / 2;
const circles = [];

let lastX, lastY, hasLast;

function setup() {
	createCanvas(WIDTH, HEIGHT);
	// for (let i = 0; i < COUNT; i++) {
	// 	circles.push({
	// 		rotation: round(random(0, 360)),
	// 		rotation_speed: round(random(-ROTATION_SPEED,ROTATION_SPEED)),
	// 		radius: RADIUS,
	// 	});
	// }
	// let rad = 300;
	// let speed = 1;

	let m = ((sqrt(sq(200) + sq(200)) + 200 ) / 2) / 200;
	let target = 200;
	let speed = 1;
	let rad;
	
	for (let i = 0; i < COUNT; i++) {
		rad = target * m;

		circles.push({
			rotation: i % 2 ? 0 : -180,
			rotation_speed: speed,
			radius: rad,
		});
		speed = (speed + 2) * -1;
		target = rad - target;
		console.log(circles[i].radius);
	}

	// circles.push({
	// 	rotation: 0,
	// 	rotation_speed: ROTATION_SPEED* 1,
	// 	radius: 241,
	// });
	// circles.push({
	// 	rotation: 180,
	// 	rotation_speed: ROTATION_SPEED* -3,
	// 	radius: 41,
	// });
	
	background(255);
	stroke(255, 0, 0);
	strokeWeight(LINE_RADIUS * 2)
}

function draw() {
	if (DRAW_ARMS) {
		background(255);
		stroke(255, 0, 0, 100);
		square(200, 200, 400);
	} else {
		background(255, 1);
	}
	let posX = START_X;
	let posY = START_Y;
	for (const c of circles) {
		const dX = sin(radians(c.rotation)) * c.radius;
		const dY = cos(radians(c.rotation)) * c.radius;
		const pX = posX;
		const pY = posY;
		posX += dX
		posY += dY
		c.rotation = (c.rotation + c.rotation_speed) % 360;
		if (DRAW_ARMS) {
			stroke(0);
			line(pX, pY, posX, posY);
		}
	}

	if (!DRAW_ARMS) {
		if (hasLast) {
			line(lastX, lastY, posX, posY);
		}
		lastX = posX;
		lastY = posY;
		hasLast = true;
	}
}
`;
