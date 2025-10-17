import "./style.css";

const TITLE: HTMLHeadElement = document.createElement("h1");
TITLE.id = "Mainheader";
TITLE.textContent = "Draw a Little Bit";
document.body.appendChild(TITLE);

const canvas = document.createElement("canvas") as HTMLCanvasElement;
canvas.id = "sketchpad";
canvas.width = 256;
canvas.height = 256;
canvas.style.cursor = "not-allowed";
document.body.appendChild(canvas);
