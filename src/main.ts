import "./style.css";

type Point = { x: number; y: number };

const title: HTMLHeadElement = document.createElement("h1");
title.id = "Mainheader";
title.textContent = "Draw a Little Bit";
document.body.appendChild(title);

const canvas = document.createElement("canvas") as HTMLCanvasElement;
canvas.id = "sketchpad";
canvas.width = 256;
canvas.height = 256;
document.body.appendChild(canvas);

const undoButton = document.createElement("button");
undoButton.id = "undoBtn";
undoButton.innerHTML = "undo";
document.body.append(undoButton);

const redoButton = document.createElement("button");
redoButton.id = "redoBtn";
redoButton.innerHTML = "redo";
document.body.append(redoButton);

const clearButton = document.createElement("button");
clearButton.id = "clrBtn";
clearButton.innerHTML = "clear";
document.body.appendChild(clearButton);

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const drawingChanged = new Event("drawing-changed");

const cursor = { active: false, x: 0, y: 0 };

const lines: Point[][] = [];
const redoLines: Point[][] = [];
let currentLine: Point[];

canvas.addEventListener("mousedown", (md) => {
  cursor.active = true;
  cursor.x = md.offsetX;
  cursor.y = md.offsetY;

  currentLine = [];
  lines.push(currentLine);
  currentLine.push({ x: cursor.x, y: cursor.y });

  canvas.dispatchEvent(drawingChanged);
});

canvas.addEventListener("mouseup", () => {
  cursor.active = false;
  currentLine = [];

  canvas.dispatchEvent(drawingChanged);
});

canvas.addEventListener("mousemove", (mm) => {
  if (cursor.active) {
    cursor.x = mm.offsetX;
    cursor.y = mm.offsetY;
    currentLine.push({ x: cursor.x, y: cursor.y });

    canvas.dispatchEvent(drawingChanged);
  }
});

canvas.addEventListener("drawing-changed", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const line of lines) {
    if (line.length > 1) {
      ctx.beginPath();
      const { x, y } = line[0];
      ctx.moveTo(x, y);
      for (const { x, y } of line) {
        ctx.lineTo(x, y);
      }
      ctx.stroke();
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
