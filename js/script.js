let canvas;
let canvasWidth;
let canvasHeight;
let canvasOffsetX;
let canvasOffsetY;
let canvasScale;

let rocket;
let triangles;
let font;

let states = { intro: 0, game: 1, over: 2 };
let state = states.intro;

function preload() {
  font = loadFont("res/font/edu.ttf");
}

function setup() {
  canvasWidth = 1920;
  canvasHeight = 1080;
  createCanvas(400, 400, P2D);
  pixelDensity(2);
  canvas = createGraphics(canvasWidth, canvasHeight, P2D);
  canvas.pixelDensity(2);
  canvas.textAlign(LEFT, TOP);
  canvas.textFont(font);
  canvas.textSize(100);
  rocket = new Rocket(canvas);
  triangles = new Triangles(canvas);
}

function draw() {
  deltaTime /= 1000;

  clear();
  background(0, 0, 0);

  canvas.clear();
  canvas.background(43, 43, 43);

  if (state == states.intro) {
    canvas.fill(255);
    canvas.text("START", 100, 100);
    if (keyIsDown(13) || touches.length > 0) {
      state = states.game;
    }
  } else if (state == states.game) {
    triangles.update(deltaTime);
    rocket.update(deltaTime);
    triangles.checkCollision();

    rocket.drawSmokes();
    rocket.drawFires();
    triangles.draw();
    rocket.draw();
  } else if (state == states.over) {
    canvas.fill(255);
    canvas.text("GAME OVER", 100, 100);
    if (keyIsDown(13) || touches.length > 1) {
      rocket.init();
      triangles.init();
      state = states.game;
    }
  }

  image(
    canvas,
    canvasOffsetX,
    canvasOffsetY,
    canvasWidth * canvasScale,
    canvasHeight * canvasScale
  );
}

function resize() {
  let p5canvas = document.getElementById("defaultCanvas0");

  if (
    p5canvas != null &&
    (p5canvas.style.width != String(window.innerWidth) + "px" ||
      p5canvas.style.height != String(window.innerHeight) + "px")
  ) {
    p5canvas.style.width = String(window.innerWidth) + "px";
    p5canvas.style.height = String(window.innerHeight) + "px";
    resizeCanvas(window.innerWidth, window.innerHeight);
    resizeCustomCanvas();
  }
}

function resizeCustomCanvas() {
  canvasScale = Math.min(
    window.innerWidth / canvasWidth,
    window.innerHeight / canvasHeight
  );
  canvasOffsetX = (window.innerWidth - canvasWidth * canvasScale) / 2;
  canvasOffsetY = (window.innerHeight - canvasHeight * canvasScale) / 2;
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

setInterval(resize, 0);
