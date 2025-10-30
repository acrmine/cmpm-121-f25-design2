import "./style.css";

type Point = { x: number; y: number };

interface ToolButton {
  name: string;
  type: string;
  sticker?: string;
  lineWeight?: number;
}

const propogateToolBar = (toolBar: HTMLDivElement, toolButtons: ToolButton[]): HTMLButtonElement[] => {
  const outputButtons: HTMLButtonElement[] = [];
  for (const buttonDetails of toolButtons) {
    outputButtons.push(addToolButton(toolBar, buttonDetails));
  }
  return outputButtons;
};

const addToolButton = (toolBar: HTMLDivElement, toolButton: ToolButton): HTMLButtonElement => {
  const newbutton = document.createElement("button") as HTMLButtonElement;
  newbutton.classList.add("toolButton");
  newbutton.title = toolButton.name;
  newbutton.dataset.mode = toolButton.type;
  newbutton.dataset.newLineWeight = "NA";
  toolBar.append(newbutton);

  if (toolButton.type == "marker") {
    const markerIcon = document.createElement("div") as HTMLDivElement;
    markerIcon.classList.add("mrkrCircle");
    if (toolButton.lineWeight != undefined) {
      markerIcon.style.width = (toolButton.lineWeight * 2).toString() + "px";
      markerIcon.style.height = (toolButton.lineWeight * 2).toString() + "px";
      newbutton.dataset.newLineWeight = toolButton.lineWeight.toString();
    } else {
      console.log('Line weight undefined for button "' + toolButton.name + '"');
    }
    newbutton.appendChild(markerIcon);
  } else if (toolButton.type == "sticker") {
    if (toolButton.sticker != undefined) {
      newbutton.textContent = toolButton.sticker;
    } else {
      console.log('Text undefined for button "' + toolButton.name + '"');
    }
  } else if (toolButton.type == "creator") {
    if (toolButton.sticker != undefined) {
      newbutton.textContent = toolButton.sticker;
    } else {
      console.log('Sticker undefined for button "' + toolButton.name + '"');
    }
  } else {
    console.log('No type defined for button "' + toolButton.name + '"');
  }
  return newbutton;
};

class Drawing {
  points: Point[] = [];
  lineWidth: number | null;
  sticker: string | null;

  constructor(startPoint: Point, lineWidth: number | null = null, sticker: string | null = null) {
    this.lineWidth = lineWidth;
    this.sticker = sticker;
    this.points = [];
    this.points.push(startPoint);
  }

  drag(nextPoint: Point) {
    if (this.lineWidth !== null) {
      this.points.push(nextPoint);
    } else {
      this.points[0] = nextPoint;
    }
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
    if (this.lineWidth !== null) {
      const prevLineWidth: number = ctx.lineWidth;
      ctx.lineWidth = this.lineWidth;
      if (this.points.length > 1) {
        ctxElem.beginPath();
        const { x, y } = this.points[0];
        ctxElem.moveTo(x, y);
        for (const { x, y } of this.points) {
          ctxElem.lineTo(x, y);
        }
        ctxElem.stroke();
      }
      ctx.lineWidth = prevLineWidth;
    } else if (this.sticker !== null) {
      ctxElem.beginPath();
      ctxElem.fillText(this.sticker, this.points[0].x, this.points[0].y);
      ctxElem.stroke();
    }
  }
}

class CursorObj {
  onCanvas: boolean = false;
  cursorUp: boolean = true;
  active: boolean = false;
  currTool: string = "3";
  currSticker: string = "💀";
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setPos(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  display(ctxElem: CanvasRenderingContext2D) {
    if (this.onCanvas && this.cursorUp) {
      ctxElem.beginPath();
      if (!isNaN(Number(this.currTool))) {
        ctxElem.arc(this.x, this.y, Number(this.currTool) / 3, 0, 2 * Math.PI);
        ctxElem.fill();
      } else if (this.currTool == "sticker") {
        ctxElem.fillText(this.currSticker, this.x, this.y);
      }
      ctxElem.stroke();
    }
  }
}

const title: HTMLHeadElement = document.createElement("h1");
title.id = "Mainheader";
title.textContent = "Draw a Little Bit";
document.body.appendChild(title);

const canvasCont = document.createElement("div") as HTMLDivElement;
document.body.append(canvasCont);

const canvas = document.createElement("canvas") as HTMLCanvasElement;
canvas.id = "sketchpad";
canvas.width = 256;
canvas.height = 256;
canvasCont.append(canvas);

const toolBar = document.createElement("div") as HTMLDivElement;
toolBar.id = "toolBar";
canvasCont.append(toolBar);
const toolBarButtons: ToolButton[] = [
  {
    name: "Thin Marker",
    type: "marker",
    lineWeight: 3,
  },
  {
    name: "Thick Marker",
    type: "marker",
    lineWeight: 6,
  },
  {
    name: "Rocket Sticker",
    type: "sticker",
    sticker: "🚀",
  },
  {
    name: "Space Invader Sticker",
    type: "sticker",
    sticker: "👾",
  },
  {
    name: "Satelite Sticker",
    type: "sticker",
    sticker: "🛰️",
  },
  {
    name: "New Sticker",
    type: "creator",
    sticker: "+",
  },
];
propogateToolBar(toolBar, toolBarButtons);
const nodeListToolBar: NodeListOf<HTMLButtonElement> = toolBar.querySelectorAll(".toolButton");
const toolButtons = [...nodeListToolBar] as HTMLButtonElement[];

const clearButton = document.createElement("button");
clearButton.id = "clrBtn";
clearButton.innerHTML = "clear";
canvasCont.appendChild(clearButton);

const exportButton = document.createElement("button");
exportButton.id = "exportBtn";
exportButton.innerHTML = "export";
canvasCont.appendChild(exportButton);

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

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
ctx.lineWidth = 3;
ctx.fillStyle = "black";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = "40px sans-serif";

const drawingChanged = new Event("drawing-changed");
const mouseOnCanvas = new Event("mouse-on-canvas");

const cursor: CursorObj | null = new CursorObj(0, 0);

const lines: Drawing[] = [];
const redoLines: Drawing[] = [];
let currentLine: Drawing | null = null;

// pointer is a unifying interaction event for mouse, pen, and touch
// Pointer Entering / Leaving Canvas
canvas.addEventListener("pointerenter", (pe) => {
  cursor.onCanvas = true;
  cursor.x = pe.offsetX;
  cursor.y = pe.offsetY;
  canvas.dispatchEvent(mouseOnCanvas);
});

canvas.addEventListener("pointerleave", () => {
  cursor.onCanvas = false;
  canvas.dispatchEvent(drawingChanged);
});

// Pointer draggd across canvas
canvas.addEventListener("pointerdown", (pd) => {
  cursor.active = true;
  cursor.cursorUp = false;
  cursor.x = pd.offsetX;
  cursor.y = pd.offsetY;

  if (cursor.currTool == "sticker") {
    currentLine = new Drawing({ x: cursor.x, y: cursor.y }, null, cursor.currSticker);
  } else {
    currentLine = new Drawing({ x: cursor.x, y: cursor.y }, ctx.lineWidth, null);
  }
  lines.push(currentLine);

  canvas.dispatchEvent(drawingChanged);
});

canvas.addEventListener("pointerup", () => {
  cursor.active = false;
  cursor.cursorUp = true;
  currentLine = null;

  canvas.dispatchEvent(drawingChanged);
});

canvas.addEventListener("pointermove", (pm) => {
  cursor.x = pm.offsetX;
  cursor.y = pm.offsetY;
  if (cursor.active) {
    if (currentLine != null) {
      currentLine.drag({ x: cursor.x, y: cursor.y });
    }
    canvas.dispatchEvent(drawingChanged);
  }
  if (cursor.onCanvas) {
    canvas.dispatchEvent(mouseOnCanvas);
  }
});

canvas.addEventListener("mouse-on-canvas", () => {
  canvas.dispatchEvent(drawingChanged);
});

canvas.addEventListener("drawing-changed", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const line of lines) {
    if (line != null) {
      line.display(ctx);
    }
  }
  cursor.display(ctx);
});

const switchSelectedButton = (newSelectedBtn: HTMLButtonElement, buttons: HTMLButtonElement[]) => {
  for (const button of buttons) {
    button.classList.remove("selectedTool");
  }
  newSelectedBtn.classList.add("selectedTool");
};

const markerBtnHandler = (unhandledBtn: HTMLButtonElement) => {
  unhandledBtn.addEventListener("click", () => {
    switchSelectedButton(unhandledBtn, toolButtons);
    ctx.lineWidth = Number(unhandledBtn.dataset.newLineWeight);
    cursor.currTool = ctx.lineWidth.toString();
  });
};

const stickerBtnHandler = (unhandledBtn: HTMLButtonElement) => {
  unhandledBtn.addEventListener("click", () => {
    switchSelectedButton(unhandledBtn, toolButtons);
    cursor.currTool = "sticker";
    cursor.currSticker = unhandledBtn.textContent;
  });
};

const creatorBtnHandler = (unhandledBtn: HTMLButtonElement) => {
  unhandledBtn.addEventListener("click", () => {
    const newText = prompt("Input the text that will go in the sticker", "💀");
    if (newText != null) {
      const newButton = {
        name: newText,
        type: "sticker",
        sticker: newText,
      };
      const createdButton: HTMLButtonElement = addToolButton(toolBar, newButton);
      toolButtons.push(createdButton);
      stickerBtnHandler(createdButton);
    }
  });
};

const createBtnHandlers = (currToolButtons: HTMLButtonElement[]) => {
  for (const currbutton of currToolButtons) {
    if (currbutton.dataset.mode == "marker") {
      markerBtnHandler(currbutton);
    } else if (currbutton.dataset.mode == "creator") {
      creatorBtnHandler(currbutton);
    } else {
      stickerBtnHandler(currbutton);
    }
  }
};
createBtnHandlers(toolButtons);

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

exportButton.addEventListener("click", () => {
  console.log("export button clicked");
});
