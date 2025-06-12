// =================================================================
// 全局变量和常量
// =================================================================
const BASE_WIDTH = 840;
const BASE_HEIGHT = 620;

const asciiChar = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ";
let asciiTexture;

let ripples = []; // 存储水波纹信息
let time = 0;     // 用于驱动动画（参考中的 time）

let bg; // 用于存储静态油画背景的图层
let textureOverlay; // 🆕 新增：用于存储画布纹理的图层

// 牛的身体部位顶点数组
let body, leg1, leg2, leg3, leg4, horn1, horn2;


// =================================================================
// 核心设置函数 (setup)
// =================================================================
function setup() {
  createCanvas(BASE_WIDTH, BASE_HEIGHT);
  updateCanvasScale();

  // 1. 创建静态的油画背景
  bg = createGraphics(width, height); 
  createImpastoBG(); 

  // 2. 🆕 创建一次性的、程序化的画布纹理
  textureOverlay = createGraphics(width, height);
  createGrainTexture(textureOverlay);

  // 在 setup 中一次性初始化牛的顶点数据
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

  asciiTexture = createGraphics(BASE_WIDTH, BASE_HEIGHT); // ✅ 创建空的ASCII画布
}

// =================================================================
// 核心绘制循环 (draw)
// =================================================================
function draw() {
  updateWaterRipple();  // 背景动态扰动
  generateASCIILayer(); // ✅ 每一帧都更新字符图层
  drawCow();            // 牛照常绘制

  // ⏱️ 每隔2秒添加一个随机水波涟漪
  if (frameCount % int(2 / 0.06) === 0) {  // 约每2秒（以time += 0.06为基准）
    ripples.push({
      x: random(width),
      y: random(height),
      startTime: time
    });
  }

  time += 0.06;
  ripples = ripples.filter(r => time - r.startTime < 2.0);

  // 🖱️ 白色鼠标圆点（如果鼠标在画布中）
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    noStroke();
    fill(255, 200); // 白色，带透明度
    ellipse(mouseX, mouseY, 24, 24); // 稍大一点的圆形
  }
  
}

// =================================================================
// 绘图辅助函数
// =================================================================

// 🆕 新增：创建程序化噪点纹理的函数
function createGrainTexture(graphics) {
  const grainAmount = 100000; // 噪点的数量
  graphics.noStroke();
  for (let i = 0; i < grainAmount; i++) {
    const x = random(width);
    const y = random(height);
    // 画一个非常小的、半透明的白色或黑色噪点
    const alpha = random(0, 15);
    if (random() > 0.5) {
      graphics.fill(255, alpha); // 白色噪点
    } else {
      graphics.fill(0, alpha);   // 黑色噪点
    }
    graphics.rect(x, y, 1, 1);
  }
}

// 🐄 牛的绘制逻辑 (使用您喜欢的 drawRoughPolygon)
function drawCow() {
  const animSpeed = 0.05;
  const animAmplitude = 0.2;//move quciker
  let swingAngle = sin(frameCount * animSpeed) * animAmplitude;
  const pivot1 = createVector(610, 370), pivot2 = createVector(500, 395), pivot3 = createVector(350, 440), pivot4 = createVector(160, 420);

  drawMaskedTexture(asciiTexture, body);

  push();
  translate(pivot1.x, pivot1.y); rotate(swingAngle); translate(-pivot1.x, -pivot1.y);
  drawMaskedTexture(asciiTexture, leg1);
  pop();

  push();
  translate(pivot3.x, pivot3.y); rotate(swingAngle); translate(-pivot3.x, -pivot3.y);
  drawMaskedTexture(asciiTexture, leg3);
  pop();

  push();
  translate(pivot2.x, pivot2.y); rotate(-swingAngle); translate(-pivot2.x, -pivot2.y);
  drawMaskedTexture(asciiTexture, leg2);
  pop();

  push();
  translate(pivot4.x, pivot4.y); rotate(-swingAngle); translate(-pivot4.x, -pivot4.y);
  drawMaskedTexture(asciiTexture, leg4);
  pop();

  drawRoughPolygon(horn1, 0, '#FFFFFF', 10);
  drawRoughPolygon(horn2, 0, '#F5F5F5', 10);
}



// 您喜欢的“粗糙轮廓”函数
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
  noStroke();
  fill(fillCol);
  beginShape();
  for (let v of jittered) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);
}

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

function drawMaskedTexture(texture, polygonVertices) {
  let mask = createGraphics(BASE_WIDTH, BASE_HEIGHT);
  mask.noStroke();
  mask.fill(255);
  mask.beginShape();
  for (let v of polygonVertices) {
    mask.vertex(v.x, v.y);
  }
  mask.endShape(CLOSE);

  let masked = createImage(BASE_WIDTH, BASE_HEIGHT);
  masked.copy(texture, 0, 0, BASE_WIDTH, BASE_HEIGHT, 0, 0, BASE_WIDTH, BASE_HEIGHT);
  masked.mask(mask);
  image(masked, 0, 0);
}


function mousePressed() {
  ripples.push({
    x: mouseX,
    y: mouseY,
    startTime: time
  });
}

// 程序化油画背景生成函数
const noiseScale = 0.003;
const colours = [ "#fccace", "#bcbdf5", "#f5ce20", "#f56020", "#003366", "#6699cc"];
function createImpastoBG() {
  const numStrokes = 50000;        // 油画笔触数量
  const strokeLength = 12;         // 每笔长度
  for (let i = 0; i < numStrokes; i++) {
    let x = random(width);
    let y = random(height);

    // 🎨 颜色：完全随机从色板中抽取
    const dabColor = random(colours);
    bg.stroke(dabColor);
    
    // 🖌️ 粗细更浮动
    bg.strokeWeight(random(0.8, 3.5));

    // 🌀 更复杂的角度扰动（引入时间和随机因子）
    let angleNoise = noise(x * noiseScale * 0.5, y * noiseScale * 0.5, time * 0.1 + random(1000));
    let angle = map(angleNoise, 0, 1, 0, TWO_PI * 4);  // 扰动范围扩大到 4 圈

    let px = x + cos(angle) * strokeLength;
    let py = y + sin(angle) * strokeLength;

    bg.line(x, y, px, py);
  }
}


// 浏览器窗口响应式调整
function updateCanvasScale() {
  const canvasEl = document.querySelector('canvas');
  const scaleFactor = Math.min(windowWidth / BASE_WIDTH, windowHeight / BASE_HEIGHT);

  // 设置 canvas 元素大小
  resizeCanvas(BASE_WIDTH, BASE_HEIGHT); // 可选：强制固定 base 尺寸
  canvasEl.style.width = `${BASE_WIDTH * scaleFactor}px`;
  canvasEl.style.height = `${BASE_HEIGHT * scaleFactor}px`;

  // 居中定位
  canvasEl.style.position = 'absolute';
  canvasEl.style.left = `calc(50% - ${BASE_WIDTH * scaleFactor / 2}px)`;
  canvasEl.style.top = `calc(50% - ${BASE_HEIGHT * scaleFactor / 2}px)`;
}

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

      // 水波扰动
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
  image(disp, 0, 0, width, height); // ✅ 放大渲染
}



function windowResized() {
    updateCanvasScale();
}