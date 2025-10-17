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

const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
document.body.appendChild(clearButton);

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const drawingChanged = new Event("drawing-changed");

const cursor = { active: false, x: 0, y: 0 };

const lines: Point[][] = [];
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

clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lines.splice(0, lines.length);
});
