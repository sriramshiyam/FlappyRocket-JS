class Triangles {
  constructor(canvas) {
    this.canvas = canvas;
    this.init();
  }

  init() {
    this.list = [];
    this.speed = 600;
    let x1 = canvasWidth + 1000;
    let maxY = canvasHeight / 2;
    let minY = maxY - Math.random() * 300;
    for (let i = 0; i < 5; i++) {
      let y1 = Math.random() * (maxY - minY) + minY;
      this.list.push({
        triangle1: {
          x1: x1,
          y1: y1,
          x2: x1 - 900,
          y2: y1 - 2000,
          x3: x1 + 900,
          y3: y1 - 2000,
        },
        triangle2: {
          x1: x1,
          y1: y1 + 300,
          x2: x1 - 900,
          y2: y1 + 2000,
          x3: x1 + 900,
          y3: y1 + 2000,
        },
        canCheck: i == 0 || i == 1,
        crossed: false,
      });
      x1 += 1000;
    }
  }

  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      let { triangle1, triangle2 } = this.list[i];
      if (i == 0 && triangle1.x3 < 0) {
        this.list.shift();
        let last = this.list[this.list.length - 1];
        let x1 = last.triangle1.x1 + 1000;
        let y1 = random(
          last.triangle1.y1 + (Math.random() < 0.5 ? 1 : -1) * random(200, 300),
          last.triangle1.y1
        );
        this.list.push({
          triangle1: {
            x1: x1,
            y1: y1,
            x2: x1 - 900,
            y2: y1 - 2000,
            x3: x1 + 900,
            y3: y1 - 2000,
          },
          triangle2: {
            x1: x1,
            y1: y1 + 300,
            x2: x1 - 900,
            y2: y1 + 2000,
            x3: x1 + 900,
            y3: y1 + 2000,
          },
          canCheck: false,
          crossed: false,
        });
        this.list[1].canCheck = true;
      } else {
        triangle1.x1 -= this.speed * dt;
        triangle1.x2 -= this.speed * dt;
        triangle1.x3 -= this.speed * dt;
        triangle2.x1 -= this.speed * dt;
        triangle2.x2 -= this.speed * dt;
        triangle2.x3 -= this.speed * dt;
        triangle1.y1 += rocket.offset * dt * 3;
        triangle1.y2 += rocket.offset * dt * 3;
        triangle1.y3 += rocket.offset * dt * 3;
        triangle2.y1 += rocket.offset * dt * 3;
        triangle2.y2 += rocket.offset * dt * 3;
        triangle2.y3 += rocket.offset * dt * 3;
      }
    }
  }

  checkCollision() {
    for (let i = 0; i < this.list.length; i++) {
      let { triangle1, triangle2, canCheck } = this.list[i];
      if (canCheck) {
        for (let j = 0; j < 2; j++) {
          let triangle = j == 0 ? triangle1 : triangle2;

          let [x1, y1] = [triangle.x1, triangle.y1];
          let x2, y2;
          let x3, y3;
          let x4, y4;

          for (let k = 1; k <= 5; k++) {
            let pointList = [
              { x: triangle.x2, y: triangle.y2 },
              { x: triangle.x3, y: triangle.y3 },
            ];

            for (let l = 0; l < pointList.length; l++) {
              [x2, y2] = [pointList[l].x, pointList[l].y];

              if (k == 5) {
                [x3, y3] = [rocket.collider[k].x, rocket.collider[k].y];
                [x4, y4] = [rocket.collider[1].x, rocket.collider[1].y];
              } else {
                [x3, y3] = [rocket.collider[k].x, rocket.collider[k].y];
                [x4, y4] = [rocket.collider[k + 1].x, rocket.collider[k + 1].y];
              }

              // cramer's rule
              let uA =
                ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
                ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

              let uB =
                ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
                ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

              if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
                state = states.over;
                return;
              }
            }
          }
        }
      }
    }
  }

  draw() {
    this.canvas.stroke(255, 255, 255);
    for (let i = 0; i < this.list.length; i++) {
      let { triangle1, triangle2 } = this.list[i];

      this.canvas.beginShape(TESS);
      this.canvas.vertex(triangle1.x1, triangle1.y1);
      this.canvas.vertex(triangle1.x2, triangle1.y2);
      this.canvas.vertex(triangle1.x3, triangle1.y3);
      this.canvas.endShape(CLOSE);

      this.canvas.beginShape(TESS);
      this.canvas.vertex(triangle2.x1, triangle2.y1);
      this.canvas.vertex(triangle2.x2, triangle2.y2);
      this.canvas.vertex(triangle2.x3, triangle2.y3);
      this.canvas.endShape(CLOSE);
    }
  }
}
