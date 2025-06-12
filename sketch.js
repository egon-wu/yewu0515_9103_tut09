// =================================================================
// Global Constants and Variables
// =================================================================
const BASE_WIDTH = 840;
const BASE_HEIGHT = 620;

const asciiChar = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ";
let asciiTexture;

let ripples = []; // Stores ripple effects triggered by time or mouse interaction
let time = 0;     // Global time counter used to animate ripples and background noise

let bg;              // Base oil painting background layer (static)
let textureOverlay;  // Grain texture overlay applied on top of the canvas

// Arrays of vectors defining cow body parts
let body, leg1, leg2, leg3, leg4, horn1, horn2;

// =================================================================
// Core Setup Function (setup)
// =================================================================
function setup() {
  createCanvas(BASE_WIDTH, BASE_HEIGHT);
  updateCanvasScale();

  bg = createGraphics(width, height); 
  createImpastoBG(); 

  textureOverlay = createGraphics(width, height);
  createGrainTexture(textureOverlay);

  body = [
    createVector(146,313), createVector(259,236), createVector(367,220),
    createVector(461,153), createVector(622,126), createVector(642,115),
    createVector(682,121), createVector(708,154), createVector(709,203),
    createVector(714,219), createVector(726,239), createVector(699,262),
    createVector(617,302), createVector(597,341), createVector(585,353),
    createVector(521,389), createVector(521,389), createVector(478,404),
    createVector(383,432), createVector(208,466), createVector(169,471),
    createVector(136,416),
  ];
  leg1 = [ createVector(580,350), createVector(642,384), createVector(672,438), createVector(634,421), createVector(638,414), createVector(515,385), ];
  leg2 = [ createVector(515,384), createVector(518,477), createVector(490,467), createVector(472,400), ];
  leg3 = [ createVector(378,428), createVector(330,434), createVector(235,514), createVector(221,546), createVector(186,553), createVector(132,593), createVector(125,580), createVector(131,542), createVector(144,530), createVector(200,497), createVector(203,462), ];
  leg4 = [ createVector(175,466), createVector(143,495), createVector(143,495), createVector(119,500), createVector(125,501), createVector(108,533), createVector(93,582), createVector(73,583), createVector(59,587), createVector(37,568), createVector(82,500), createVector(81,480), createVector(143,410), ];
  horn1 = [ createVector(668,169), createVector(685,190), createVector(729,183), ];
  horn2 = [ createVector(488,128), createVector(506,143), createVector(622,125), ];

  asciiTexture = createGraphics(BASE_WIDTH, BASE_HEIGHT); 
}


// =================================================================
// Core Draw Loop
// =================================================================
function draw() {
  updateWaterRipple();   // Update and render dynamic ripple distortion
  generateASCIILayer();  // Overlay animated ASCII text layer
  drawCow();             // Render animated cow figure on top

  if (frameCount % int(2 / 0.06) === 0) {
    ripples.push({ x: random(width), y: random(height), startTime: time });
  }

  time += 0.06;
  ripples = ripples.filter(r => time - r.startTime < 2.0);

  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    noStroke(); fill(255, 200);
    ellipse(mouseX, mouseY, 24, 24);
  }
}


// =================================================================
// Drawing Utility Functions
// =================================================================

// Creates a randomized noise texture using small semi-transparent dots
function createGrainTexture(graphics) {
  const grainAmount = 100000;
  graphics.noStroke();
  for (let i = 0; i < grainAmount; i++) {
    const x = random(width);
    const y = random(height);
    const alpha = random(0, 15);
    graphics.fill(random() > 0.5 ? 255 : 0, alpha);
    graphics.rect(x, y, 1, 1);
  }
}

// Draw the cow using textured polygon masks and oscillating leg animations
function drawCow() {
  const animSpeed = 0.05;
  const animAmplitude = 0.2;
  let swingAngle = sin(frameCount * animSpeed) * animAmplitude;

  const pivot1 = createVector(610, 370), pivot2 = createVector(500, 395),
        pivot3 = createVector(350, 440), pivot4 = createVector(160, 420);

  drawMaskedTexture(asciiTexture, body);

  push(); translate(pivot1.x, pivot1.y); rotate(swingAngle); translate(-pivot1.x, -pivot1.y);
  drawMaskedTexture(asciiTexture, leg1); pop();

  push(); translate(pivot3.x, pivot3.y); rotate(swingAngle); translate(-pivot3.x, -pivot3.y);
  drawMaskedTexture(asciiTexture, leg3); pop();

  push(); translate(pivot2.x, pivot2.y); rotate(-swingAngle); translate(-pivot2.x, -pivot2.y);
  drawMaskedTexture(asciiTexture, leg2); pop();

  push(); translate(pivot4.x, pivot4.y); rotate(-swingAngle); translate(-pivot4.x, -pivot4.y);
  drawMaskedTexture(asciiTexture, leg4); pop();

  drawRoughPolygon(horn1, 0, '#FFFFFF', 10);
  drawRoughPolygon(horn2, 0, '#F5F5F5', 10);
}

// Custom rough polygon drawing function to simulate hand-drawn irregular outlines
function drawRoughPolygon(polygonVertices, jitter = 8, fillCol = '#dbb277', stepDiv = 14) {
  if (polygonVertices.length === 0) return;
  let jittered = [];
  for (let i = 0; i < polygonVertices.length; i++) {
    let p1 = polygonVertices[i];
    let p2 = polygonVertices[(i + 1) % polygonVertices.length];
    let steps = int(dist(p1.x, p1.y, p2.x, p2.y) / stepDiv);
    for (let t = 0; t < steps; t++) {
      let x = lerp(p1.x, p2.x, t / steps);
      let y = lerp(p1.y, p2.y, t / steps);
      let angle = atan2(p2.y - p1.y, p2.x - p1.x) + HALF_PI;
      let d = random(-jitter, jitter);
      x += cos(angle) * d;
      y += sin(angle) * d;
      jittered.push(createVector(x, y));
    }
  }
  noStroke(); fill(fillCol);
  beginShape(); for (let v of jittered) vertex(v.x, v.y);
  endShape(CLOSE);
}

// Generates animated ASCII texture layer using noise and random flicker
function generateASCIILayer() {
  const cols = 80;
  const rows = 60;
  const cellW = BASE_WIDTH / cols;
  const cellH = BASE_HEIGHT / rows;

  asciiTexture.clear();
  asciiTexture.textAlign(CENTER, CENTER);
  asciiTexture.textSize(cellW * 0.75);
  asciiTexture.textFont('monospace'); 
  asciiTexture.stroke(255);
  asciiTexture.strokeWeight(1.2);    
  asciiTexture.fill(255);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const n = noise(i * 0.3, j * 0.3, frameCount * 0.02);
      const flicker = random();
      const brightness = (n + flicker * 0.5) / 1.5;
      const index = floor(map(brightness, 0, 1, 0, asciiChar.length));
      const c = asciiChar.charAt(index);
      const x = i * cellW + cellW / 2;
      const y = j * cellH + cellH / 2;
      asciiTexture.text(c, x, y);
    }
  }
}

// Masks a texture into a polygon shape and renders it to the canvas
function drawMaskedTexture(texture, polygonVertices) {
  let mask = createGraphics(BASE_WIDTH, BASE_HEIGHT);
  mask.noStroke(); mask.fill(255);
  mask.beginShape(); for (let v of polygonVertices) mask.vertex(v.x, v.y);
  mask.endShape(CLOSE);

  let masked = createImage(BASE_WIDTH, BASE_HEIGHT);
  masked.copy(texture, 0, 0, BASE_WIDTH, BASE_HEIGHT, 0, 0, BASE_WIDTH, BASE_HEIGHT);
  masked.mask(mask);
  image(masked, 0, 0);
}

// Triggers new ripple on mouse press
function mousePressed() {
  ripples.push({ x: mouseX, y: mouseY, startTime: time });
}

// Procedurally generates oil-paint-style brush strokes as the static background
const noiseScale = 0.003;
const colours = ["#fccace", "#bcbdf5", "#f5ce20", "#f56020", "#003366", "#6699cc"];
function createImpastoBG() {
  const numStrokes = 50000;
  const strokeLength = 12;
  for (let i = 0; i < numStrokes; i++) {
    let x = random(width);
    let y = random(height);
    const dabColor = random(colours);
    bg.stroke(dabColor);
    bg.strokeWeight(random(0.8, 3.5));
    let angleNoise = noise(x * noiseScale * 0.5, y * noiseScale * 0.5, time * 0.1 + random(1000));
    let angle = map(angleNoise, 0, 1, 0, TWO_PI * 4);
    let px = x + cos(angle) * strokeLength;
    let py = y + sin(angle) * strokeLength;
    bg.line(x, y, px, py);
  }
}

// Responsive canvas scaling and centering for different browser window sizes
function updateCanvasScale() {
  const canvasEl = document.querySelector('canvas');
  const scaleFactor = Math.min(windowWidth / BASE_WIDTH, windowHeight / BASE_HEIGHT);
  resizeCanvas(BASE_WIDTH, BASE_HEIGHT);
  canvasEl.style.width = `${BASE_WIDTH * scaleFactor}px`;
  canvasEl.style.height = `${BASE_HEIGHT * scaleFactor}px`;
  canvasEl.style.position = 'absolute';
  canvasEl.style.left = `calc(50% - ${BASE_WIDTH * scaleFactor / 2}px)`;
  canvasEl.style.top = `calc(50% - ${BASE_HEIGHT * scaleFactor / 2}px)`;
}

// Applies Perlin-noise-based displacement plus ripple wave distortions
function updateWaterRipple() {
  const scaleFactor = 0.2;
  const w = floor(width * scaleFactor);
  const h = floor(height * scaleFactor);

  let disp = createImage(w, h);
  disp.loadPixels();
  bg.loadPixels();

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let idx = (x + y * w) * 4;
      let gx = x / scaleFactor;
      let gy = y / scaleFactor;

      let n = noise(gx * 0.01, gy * 0.01, time * 0.2);
      let offsetX = map(n, 0, 1, -15, 15);
      let offsetY = map(n, 0, 1, -15, 15);

      for (let ripple of ripples) {
        let dx = gx - ripple.x;
        let dy = gy - ripple.y;
        let d = sqrt(dx * dx + dy * dy);
        let waveRadius = (time - ripple.startTime) * 250;
        let waveWidth = 50;
        if (abs(d - waveRadius) < waveWidth) {
          let strength = map(abs(d - waveRadius), 0, waveWidth, 15, 0);
          let angle = atan2(dy, dx);
          offsetX += cos(angle) * strength;
          offsetY += sin(angle) * strength;
        }
      }

      let sx = constrain(floor(gx + offsetX), 0, width - 1);
      let sy = constrain(floor(gy + offsetY), 0, height - 1);
      let sidx = (sx + sy * width) * 4;

      disp.pixels[idx]     = bg.pixels[sidx];
      disp.pixels[idx + 1] = bg.pixels[sidx + 1];
      disp.pixels[idx + 2] = bg.pixels[sidx + 2];
      disp.pixels[idx + 3] = 255;
    }
  }

  disp.updatePixels();
  image(disp, 0, 0, width, height);
}

// Trigger re-scaling when window size changes
function windowResized() {
    updateCanvasScale();
}
