class Rocket {
  constructor(canvas) {
    this.canvas = canvas;
    this.texture = loadImage("res/image/rocket.png");
    this.squareTexture = loadImage("res/image/square.png");
    this.init();
  }

  init() {
    this.rotation = 90;
    this.yVelocity = 0;
    this.position = { x: canvasWidth / 3, y: canvasHeight / 2 - 50 };
    this.smokes = [];
    this.smokeTimer = 0.15;
    this.fires = [];
    this.fireTimer = 0.01;
    this.offset = 0;
    this.collided = false;
    this.speed = 200;
    this.calculateCollider();
  }

  createVec(vec, index, radian) {
    this.collider[index] = {
      x: vec.x * Math.cos(radian) - vec.y * Math.sin(radian) + this.position.x,
      y: vec.x * Math.sin(radian) + vec.y * Math.cos(radian) + this.position.y,
    };
  }

  calculateCollider() {
    this.collider = {};

    let height = this.texture.height;
    let width = this.texture.width;
    let x = width / 2 - 10;
    let y = height * 0.9;

    let radian = (this.rotation * Math.PI) / 180;

    let vec = { x: -x, y: -y + 30 };
    this.createVec(vec, 1, radian);

    vec.x = 0;
    vec.y = -y;
    this.createVec(vec, 2, radian);

    vec.x = x;
    vec.y = -y + 30;
    this.createVec(vec, 3, radian);

    vec.x = x;
    vec.y = height - y;
    this.createVec(vec, 4, radian);

    vec.x = -x;
    vec.y = height - y;
    this.createVec(vec, 5, radian);
  }

  update(dt) {
    let vector1 = { x: 0, y: 1 };
    let vector2 = {
      x: Math.cos((this.rotation * Math.PI) / 180),
      y: Math.sin((this.rotation * Math.PI) / 180),
    };

    let dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;

    this.yVelocity = keyIsDown(32) || touches.length > 0 ? -1 : 1;

    this.rotation += this.yVelocity * this.speed * dotProduct * dt;
    triangles.speed = 500 * dotProduct;

    let crossProduct = vector1.x * vector2.y - vector2.x * vector1.y;
    this.offset = -500 * crossProduct;

    this.updateSmokes(dt);
    this.updateFires(dt);
    this.calculateCollider();
  }

  updateSmokes(dt) {
    for (let i = this.smokes.length - 1; i >= 0; i--) {
      let smoke = this.smokes[i];
      smoke.x += smoke.speed.x * dt;
      smoke.y += smoke.speed.y * dt + this.offset * dt * 3;

      if (smoke.x < -50) {
        this.smokes.splice(i, 1);
      }
    }

    this.smokeTimer -= dt;

    if (this.smokeTimer < 0) {
      this.smokeTimer = 0.15;
      let smoke = {
        x: this.position.x,
        y: this.position.y,
        rotation: random(0, 360),
        size: random(7, 23),
        speed: {},
      };

      if (Math.random() < 0.5) {
        smoke.speed.x = -random(400, 450);
      } else {
        smoke.speed.x = -random(500, 550);
      }

      if (Math.random() < 0.5) {
        smoke.speed.y = random(20, 25);
      } else {
        smoke.speed.y = random(30, 35);
      }

      smoke.speed.y *= Math.random() < 0.5 ? -1 : 1;

      this.smokes.push(smoke);
    }
  }

  updateFires(dt) {
    for (let i = this.fires.length - 1; i >= 0; i--) {
      let fire = this.fires[i];
      fire.x += fire.speed.x * dt;
      fire.y += fire.speed.y * dt + this.offset * dt * 4;
      fire.size -= 50 * dt;
      if (fire.size < 0) {
        this.fires.splice(i, 1);
      }
    }

    if (keyIsDown(32) || touches.length > 0) {
      this.fireTimer -= dt;
    } else {
      this.fireTimer = 0.1;
    }

    if (this.fireTimer < 0) {
      this.fireTimer = 0.01;
      let fire = {
        x: this.position.x,
        y: this.position.y,
        rotation: random(0, 360),
        size: random(7, 25),
        speed: {},
      };

      if (Math.random() < 0.5) {
        fire.speed.x = -random(600, 650);
      } else {
        fire.speed.x = -random(700, 750);
      }

      if (Math.random() < 0.5) {
        fire.speed.y = random(80, 85);
      } else {
        fire.speed.y = random(70, 75);
      }

      fire.speed.y *= Math.random() < 0.5 ? -1 : 1;

      this.fires.push(fire);
    }
  }

  draw() {
    this.canvas.translate(this.position.x, this.position.y);
    this.canvas.rotate((this.rotation * Math.PI) / 180);
    this.canvas.image(
      this.texture,
      -this.texture.width / 2,
      -this.texture.height * 0.9
    );
    this.canvas.resetMatrix();
    // this.drawCollider();
  }

  drawSmokes() {
    this.canvas.tint(170, 170, 170);
    for (let i = 0; i < this.smokes.length; i++) {
      const smoke = this.smokes[i];
      this.canvas.translate(smoke.x, smoke.y);
      this.canvas.rotate((smoke.rotation * Math.PI) / 180);
      this.canvas.image(
        this.squareTexture,
        -smoke.size / 2,
        -smoke.size / 2,
        smoke.size,
        smoke.size
      );
      this.canvas.resetMatrix();
    }
    this.canvas.tint(255, 255, 255);
  }

  drawFires() {
    this.canvas.tint(255, 0, 0);
    for (let i = 0; i < this.fires.length; i++) {
      const fire = this.fires[i];
      this.canvas.translate(fire.x, fire.y);
      this.canvas.rotate((fire.rotation * Math.PI) / 180);
      this.canvas.image(
        this.squareTexture,
        -fire.size / 2,
        -fire.size / 2,
        fire.size,
        fire.size
      );
      this.canvas.resetMatrix();
    }
    this.canvas.tint(255, 255, 255);
  }

  drawCollider() {
    this.canvas.translate(this.position.x, this.position.y);
    this.canvas.beginShape(TESS);
    for (let i = 1; i <= 5; i++) {
      let { x, y } = this.collider[i];
      this.canvas.vertex(x - this.position.x, y - this.position.y);
    }
    this.canvas.endShape(CLOSE);
    this.canvas.resetMatrix();
  }
}
