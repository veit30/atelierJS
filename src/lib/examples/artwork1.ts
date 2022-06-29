export default `
const amount = 3;
const maxvel = 8;
const points = Array.from({length: amount});

function setup() {
  createCanvas(WIDTH, HEIGHT);
  
  // random point 
  for(let i = 0; i < points.length; i++) {
    points[i] = {
      x: round(random(1,WIDTH)), 
      y:round(random(1,HEIGHT)),
      velX: random(-maxvel,maxvel),
      velY: random(-maxvel,maxvel)
    }
  }
  background(220);
  // noLoop();
}

function draw() {
  background(220, 10);
  stroke(33);
  let point0 = Object.assign({},points[0]);
  for(let i = 0; i < points.length; i++) {
    
    strokeWeight(2);
    if(i+1 >= points.length) {
      line(points[i].x, points[i].y, point0.x, point0.y)
    } else {
      line(points[i].x, points[i].y, points[i+1].x, points[i+1].y)
    }
    
    points[i].x = round(points[i].x + points[i].velX);
    points[i].y = round(points[i].y + points[i].velY);
    
    if(points[i].x >= WIDTH || points[i].x <= 0) {
      points[i].velX *= -1;
    }
    
    if(points[i].y >= HEIGHT || points[i].y <= 0) {
      points[i].velY *= -1;
    }
  }
}`;
