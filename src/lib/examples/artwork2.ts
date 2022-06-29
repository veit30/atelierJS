export default `
const COUNT = 10;
const RADIUS = 20;
const ROTATION_SPEED = 0.1;
const LINE_RADIUS = 2;
const START_X = WIDTH / 2;
const START_Y = HEIGHT / 2;
const circles = [];

let lastX, lastY, hasLast;

function setup() {
	createCanvas(WIDTH, HEIGHT);
	for (let i = 0; i < COUNT; i++) {
		circles.push({
			rotation: 0,
			rotation_speed: ROTATION_SPEED * round(random(-5, 5)),
			radius: RADIUS * round(random(0.5, 1)),
		});
	}
	background(255);
	fill(255, 0, 0);
	stroke(255, 0, 0);
	strokeWeight(LINE_RADIUS * 2)
}

function draw() {
	background(255, 1);
	let posX = START_X;
	let posY = START_Y;
	for (const c of circles) {
		const dX = sin(radians(c.rotation)) * c.radius;
		const dY = cos(radians(c.rotation)) * c.radius;
		posX += dX
		posY += dY
		c.rotation = (c.rotation + c.rotation_speed) % 360;
	}

	if (hasLast) {
		line(lastX, lastY, posX, posY);
	}
	lastX = posX;
	lastY = posY;
	hasLast = true;
}
`;
