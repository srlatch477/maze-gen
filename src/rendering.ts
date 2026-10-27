import { maze } from "./generation.js"
import { ctx, screen } from "./core.js"
import {type Cell, type Coordinate} from "./generation.js";

const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

let FOREGROUND = darkMode ? "white" : "black";
let BACKGROUND = darkMode ? "black" : "white";

let cellSize: number;
let offset: number;

export function configureRendering(width: number, height: number) {
    if (!screen) return;

    screen.width = width;
    screen.height = height;

    cellSize = screen.height / maze.height;
    offset = screen.width / 2 - cellSize * maze.width / 2;
}

export function redrawCell(coordinate: Coordinate, cell: Cell) {
    if (!ctx) return;
    
    ctx.fillStyle = BACKGROUND;

    // Add padding of half of ctx.lineWidth because the lines are not pixel-perfect.
    const x = offset + cellSize * coordinate.x - ctx.lineWidth/2
    const y = cellSize * coordinate.y - ctx.lineWidth/2;

    ctx.fillRect(
        x, 
        y,
        cellSize + ctx.lineWidth/2, 
        cellSize + ctx.lineWidth/2);

    ctx.strokeStyle = FOREGROUND;

    drawCell(x, y, cell);
}

function drawCell(x: number, y: number, cell: Cell | undefined) {
    if (!ctx) return;

    if (cell?.up_wall) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.closePath();
        ctx.stroke();
    }
    if (cell?.down_wall) {
        ctx.beginPath();
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.closePath();
        ctx.stroke();
    }
    if (cell?.left_wall) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.closePath();
        ctx.stroke();
    }
    if (cell?.right_wall) {
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.closePath();
        ctx.stroke();
    }
}

export function drawMaze() {
    if (!ctx || !screen) return;
    // Draw the maze fit on the Y axis and centered on the X axis.

    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, screen.width, screen.height);

    ctx.strokeStyle = FOREGROUND

    for (let i = 0; i < maze.width; i++) {
        for (let j = 0; j < maze.height; j++) {
            const cell = maze.data[j + i * maze.height];
            const cellPos = {x: offset + i * cellSize, y: j * cellSize};

            drawCell(cellPos.x, cellPos.y, cell);
        }
    }
}