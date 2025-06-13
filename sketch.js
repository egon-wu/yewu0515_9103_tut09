// =================================================================
// 全局变量和常量
// =================================================================
const BASE_WIDTH = 840;
const BASE_HEIGHT = 620;

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
}

// =================================================================
// 核心绘制循环 (draw)
// =================================================================
function draw() {
  // 1. 将预先生成好的背景图层画出来
  image(bg, 0, 0, width, height);
  
  // 2. 绘制会动的牛
  drawCow();
  
  // 3. 🆕 在所有内容都画完之后，用混合模式叠加纹理层
  push();
  blendMode(OVERLAY); // 尝试 OVERLAY, SOFT_LIGHT, 或者 MULTIPLY
  image(textureOverlay, 0, 0);
  blendMode(BLEND); // 重置混合模式，避免影响下一帧
  pop();
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
  const animAmplitude = 0.06;
  let swingAngle = sin(frameCount * animSpeed) * animAmplitude;
  const pivot1 = createVector(610, 370), pivot2 = createVector(500, 395), pivot3 = createVector(350, 440), pivot4 = createVector(160, 420);

  drawRoughPolygon(body, 1, '#1a1a1a', 14);
  push(); translate(pivot1.x, pivot1.y); rotate(swingAngle); translate(-pivot1.x, -pivot1.y); drawRoughPolygon(leg1, 1, '#1a1a1a', 14); pop();
  push(); translate(pivot3.x, pivot3.y); rotate(swingAngle); translate(-pivot3.x, -pivot3.y); drawRoughPolygon(leg3, 1, '#1a1a1a', 14); pop();
  push(); translate(pivot2.x, pivot2.y); rotate(-swingAngle); translate(-pivot2.x, -pivot2.y); drawRoughPolygon(leg2, 1, '#1a1a1a', 14); pop();
  push(); translate(pivot4.x, pivot4.y); rotate(-swingAngle); translate(-pivot4.x, -pivot4.y); drawRoughPolygon(leg4, 1, '#1a1a1a', 14); pop();
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


// 程序化油画背景生成函数
const noiseScale = 0.003;
const colours = [ "#fccace", "#bcbdf5", "#f5ce20", "#f56020", "#003366", "#6699cc"];
function createImpastoBG() {
  const numStrokes = 80000;
  const strokeLength = 12;
  for (let i = 0; i < numStrokes; i++) {
    let x = random(width);
    let y = random(height);
    const n = noise(x * noiseScale, y * noiseScale);
    const numBands = 16;
    const band = int(n * numBands);
    const colourIndex = band % colours.length;
    const dabColor = colours[colourIndex];
    bg.stroke(dabColor);
    bg.strokeWeight(random(1, 2.5));
    let angleNoise = noise(x * noiseScale * 0.5, y * noiseScale * 0.5, 10);
    let angle = map(angleNoise, 0, 1, 0, TWO_PI * 2);
    let px = x + cos(angle) * strokeLength;
    let py = y + sin(angle) * strokeLength;
    bg.line(x, y, px, py);
  }
}


// 浏览器窗口响应式调整
function updateCanvasScale() { 
    const scaleFactor = Math.min(windowWidth / BASE_WIDTH, windowHeight / BASE_HEIGHT) * 0.95; 
    const canvasEl = document.querySelector('canvas');
    canvasEl.style.transform = `scale(${scaleFactor})`;
    canvasEl.style.position = 'absolute';
    canvasEl.style.left = `calc(50% - ${BASE_WIDTH * scaleFactor / 2}px)`;
    canvasEl.style.top = `calc(50% - ${BASE_HEIGHT * scaleFactor / 2}px)`;
}

function windowResized() {
    updateCanvasScale();
}