function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = 100;

  fill(100, 150, 255);
  noStroke();
  ellipse(centerX, centerY, radius, radius);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
