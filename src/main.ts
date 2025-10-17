import "./style.css";

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

const cursor = { active: false, x: 0, y: 0 };

canvas.addEventListener("mousedown", (md) => {
  cursor.active = true;
  cursor.x = md.offsetX;
  cursor.y = md.offsetY;
});

canvas.addEventListener("mouseup", () => {
  cursor.active = false;
});

canvas.addEventListener("mousemove", (mm) => {
  if (cursor.active) {
    ctx.beginPath();
    ctx.moveTo(cursor.x, cursor.y);
    ctx.lineTo(mm.offsetX, mm.offsetY);
    ctx.stroke();
    cursor.x = mm.offsetX;
    cursor.y = mm.offsetY;
  }
});

clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
