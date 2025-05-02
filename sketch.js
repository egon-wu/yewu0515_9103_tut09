function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  let centerX = width / 2;
  let centerY = height / 2;
  let diameter = windowWidth / 5; // 圆形直径为屏幕宽度的1/5

  fill(100, 150, 255);
  noStroke();
  ellipse(centerX, centerY, diameter, diameter);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}