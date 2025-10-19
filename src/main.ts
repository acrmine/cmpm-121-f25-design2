import "./style.css";

type Point = { x: number; y: number };

class Line {
  points: Point[] = [];

  constructor(startPoint: Point) {
    this.points.push(startPoint);
  }

  drag(nextPoint: Point) {
    this.points.push(nextPoint);
  }

  clear() {
    this.points.splice(0, this.points.length);
  }

  // works like [] but checks bounds
  getPoint(index: number): Point {
    let outPoint: Point = { x: -1, y: -1 };
    if (index >= this.points.length || index < 0) {
      return outPoint;
    }
    outPoint = this.points[index];
    return outPoint;
  }

  display(ctxElem: CanvasRenderingContext2D) {
    if (this.points.length > 1) {
      ctxElem.beginPath();
      const { x, y } = this.points[0];
      ctxElem.moveTo(x, y);
      for (const { x, y } of this.points) {
        ctxElem.lineTo(x, y);
      }
      ctxElem.stroke();
    }
  }
}

const title: HTMLHeadElement = document.createElement("h1");
title.id = "Mainheader";
title.textContent = "Draw a Little Bit";
document.body.appendChild(title);

const canvas = document.createElement("canvas") as HTMLCanvasElement;
canvas.id = "sketchpad";
canvas.width = 256;
canvas.height = 256;
document.body.appendChild(canvas);

const undoRedoCont = document.createElement("div") as HTMLDivElement;
document.body.append(undoRedoCont);

const undoButton = document.createElement("button");
undoButton.id = "undoBtn";
undoButton.innerHTML = "undo";
undoRedoCont.append(undoButton);

const redoButton = document.createElement("button");
redoButton.id = "redoBtn";
redoButton.innerHTML = "redo";
undoRedoCont.append(redoButton);

const clearButton = document.createElement("button");
clearButton.id = "clrBtn";
clearButton.innerHTML = "clear";
document.body.appendChild(clearButton);

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const drawingChanged = new Event("drawing-changed");

const cursor = { active: false, x: 0, y: 0 };

const lines: Line[] = [];
const redoLines: Line[] = [];
let currentLine: Line | null = null;

// unifying interaction event for mouse, pen, and touch
canvas.addEventListener("pointerdown", (md) => {
  cursor.active = true;
  cursor.x = md.offsetX;
  cursor.y = md.offsetY;

  currentLine = new Line({ x: cursor.x, y: cursor.y });
  lines.push(currentLine);

  canvas.dispatchEvent(drawingChanged);
});

canvas.addEventListener("pointerup", () => {
  cursor.active = false;
  currentLine = null;

  canvas.dispatchEvent(drawingChanged);
});

canvas.addEventListener("pointermove", (mm) => {
  if (cursor.active) {
    cursor.x = mm.offsetX;
    cursor.y = mm.offsetY;
    if (currentLine != null) {
      currentLine.drag({ x: cursor.x, y: cursor.y });
    }

    canvas.dispatchEvent(drawingChanged);
  }
});

canvas.addEventListener("drawing-changed", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const line of lines) {
    if (line != null) {
      line.display(ctx);
    }
  }
});

undoButton.addEventListener("click", () => {
  if (lines.length > 0) {
    const prevLine = lines.pop();
    if (prevLine !== undefined) {
      redoLines.push(prevLine);
    }
    canvas.dispatchEvent(drawingChanged);
  }
});

redoButton.addEventListener("click", () => {
  if (redoLines.length > 0) {
    const pastLine = redoLines.pop();
    if (pastLine !== undefined) {
      lines.push(pastLine);
    }
    canvas.dispatchEvent(drawingChanged);
  }
});

clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lines.splice(0, lines.length);
  redoLines.splice(0, redoLines.length);
});
