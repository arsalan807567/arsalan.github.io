// Function to apply neon glow, call this before your drawing loop
function setNeonStyle(color, glowColor, blurAmount = 15) {
  stroke(color);
  strokeWeight(2);
  drawingContext.shadowBlur = blurAmount;
  drawingContext.shadowColor = glowColor;
}

let creature;
let targetX, targetY;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "9999");
  canvas.style("pointer-events", "none");
  targetX = mouseX;
  targetY = mouseY;
  creature = new Creature(mouseX, mouseY);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  clear();
  
  // Update target position
  targetX = lerp(targetX, mouseX, 0.1);
  targetY = lerp(targetY, mouseY, 0.1);

  creature.update(targetX, targetY);
  creature.display();
}

class Creature {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.segments = [];
    this.numSegments = 10;
    this.segmentLength = 8;
    for (let i = 0; i < this.numSegments; i++) {
      this.segments.push({ x: x, y: y });
    }
    this.limbs = [];
    this.numLimbs = 4;
    this.limbLength = 15;
  }

  update(targetX, targetY) {
    let head = this.segments[0];
    let dx = targetX - head.x;
    let dy = targetY - head.y;
    let angle = atan2(dy, dx);

    head.x = targetX - cos(angle) * this.segmentLength;
    head.y = targetY - sin(angle) * this.segmentLength;

    for (let i = 1; i < this.numSegments; i++) {
      let prevSegment = this.segments[i - 1];
      let currentSegment = this.segments[i];

      dx = prevSegment.x - currentSegment.x;
      dy = prevSegment.y - currentSegment.y;
      angle = atan2(dy, dx);

      currentSegment.x = prevSegment.x - cos(angle) * this.segmentLength;
      currentSegment.y = prevSegment.y - sin(angle) * this.segmentLength;
    }
  }

  display() {
    let cyanNeon = color(0, 255, 255);
    let cyanGlow = color(0, 200, 200, 200);

    setNeonStyle(cyanNeon, cyanGlow);

    noFill();

    // Draw head
    ellipse(this.segments[0].x, this.segments[0].y - 10, 15, 15);

    // Draw spine and ribs
    for (let i = 0; i < this.numSegments - 1; i++) {
      let p1 = this.segments[i];
      let p2 = this.segments[i + 1];
      line(p1.x, p1.y, p2.x, p2.y);

      // Draw ribs
      if (i > 0 && i < this.numSegments - 2) { // Avoid ribs on head and tail base
        let angle = atan2(p2.y - p1.y, p2.x - p1.x);
        let ribLength = 10;
        let ribOffset = 5;

        push();
        translate(p1.x, p1.y);
        rotate(angle);

        // Ribs on one side
        line(ribOffset, 0, ribOffset + ribLength, -ribLength / 2);
        // Ribs on other side
        line(ribOffset, 0, ribOffset + ribLength, ribLength / 2);
        pop();
      }
    }

    // Draw tail
    let tailBase = this.segments[this.numSegments - 1];
    let tailTipX = tailBase.x + 20;
    let tailTipY = tailBase.y + 20;
    line(tailBase.x, tailBase.y, tailTipX, tailTipY);
    line(tailTipX, tailTipY, tailTipX - 5, tailTipY + 10);

    // Draw limbs
    // Front limbs
    let frontLimbAttach = this.segments[2];
    line(frontLimbAttach.x, frontLimbAttach.y, frontLimbAttach.x - 15, frontLimbAttach.y + 20);
    line(frontLimbAttach.x, frontLimbAttach.y, frontLimbAttach.x + 15, frontLimbAttach.y + 20);

    // Back limbs
    let backLimbAttach = this.segments[this.numSegments - 3];
    line(backLimbAttach.x, backLimbAttach.y, backLimbAttach.x - 15, backLimbAttach.y + 20);
    line(backLimbAttach.x, backLimbAttach.y, backLimbAttach.x + 15, backLimbAttach.y + 20);
  }
}
