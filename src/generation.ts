import { redrawCell, drawMaze } from "./rendering.js";

export let maze: Maze;
let stack: (Coordinate | undefined)[];
let visitedCount: number;
let visitedTarget: number;
let generationInterval: number;

export type Coordinate = {
    readonly x: number,
    readonly y: number
}

export type Cell = {
    left_wall: boolean,
    right_wall: boolean,
    up_wall: boolean,
    down_wall: boolean,
    visited: boolean
}

type Maze = {
    data: Cell[],
    width: number,
    height: number
}

type Direction = "left" | "right" | "up" | "down"

type Neighbor = {
    coordinate: Coordinate,
    direction: Direction
}

const directions: Record<Direction, Coordinate> = {
    "down":     {x: 0, y: 1},
    "up":       {x: 0, y: -1},
    "right":    {x: 1, y: 0},
    "left":     {x: -1, y: 0}
}

function getNeighbors(coordinate: Coordinate | undefined, maze: Maze): Neighbor[] {
    if (!coordinate) return [];
    
    let neighbors: Neighbor[] = [];

    for (const [direction, offset] of Object.entries(directions)) {
        const neighborPos: Coordinate = {x: coordinate.x + offset.x, y: coordinate.y + offset.y};

        // Neighbor can't be out of bounds

        if (direction == "down" && coordinate.y > maze.height-2) continue;
        if (direction == "up" && coordinate.y < 1) continue;
        if (direction == "right" && coordinate.x > maze.width-2) continue;
        if (direction == "left" && coordinate.x < 1) continue;
        
        // Neighbor can't be already visited

        if (maze.data[neighborPos.y + neighborPos.x * maze.height]?.visited) continue;

        neighbors.push({coordinate: neighborPos, direction: direction as Direction});
    }

    return neighbors;
}

function visit(coordinate: Coordinate | undefined, stack: (Coordinate | undefined)[], maze: Maze, instant: boolean, direction?: Direction) {
    if (!coordinate) return;

    // Mark as visited
    const currentCell = maze.data[coordinate.y + coordinate.x * maze.height];

    if (currentCell) {
        currentCell.visited = true;

        visitedCount++;
    }

    if (direction) {
        const previousCellPos = stack[stack.length-1];
  
        if (previousCellPos) {
            const previousCell = maze.data[previousCellPos.y + previousCellPos.x * maze.height];

            // Carve a path.
            // We need to also remove the opposite wall of the current cell because it will look like there is still a wall, because it comes from the current cell.
            if (previousCell && currentCell) {
                switch (direction) {
                    case "down":
                        previousCell.down_wall = false;
                        currentCell.up_wall = false;
                        break;
                    case "up":
                        previousCell.up_wall = false;
                        currentCell.down_wall = false;
                        break;
                    case "left":
                        previousCell.left_wall = false;
                        currentCell.right_wall = false;
                        break;
                    case "right":
                        previousCell.right_wall = false;
                        currentCell.left_wall = false;
                        break;
                }

                // Redraw only modified cells for somewhat optimized rendering
                if (!instant) {
                    redrawCell(previousCellPos, previousCell);
                    redrawCell(coordinate, currentCell);
                }
            }
        }
    }

    stack.push(coordinate);
}

export function prepare(width: number, height: number) {
    stack = [];
    maze = {
        data: [],
        width: width,
        height: height
    };

    // Initialize stuff

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            maze.data.push({
                left_wall: true,               // At first, the walls are filled in, they are going to be carved during generation.
                right_wall: true,
                up_wall: true,
                down_wall: true,
                visited: false
            });
        }
    }
}

export function generateMaze(instant: boolean, delay?: number) {
    // Start at 0,0
    
    visit({x: 0, y: 0}, stack, maze, instant, undefined);

    visitedCount = 0;                           // How many cells are already visited
    visitedTarget = maze.width * maze.height;   // How many cells should be visited

    if (instant) {
        // Repeat until it returns true, aka finished.
        while (!iteration(stack, true)) {};
        
        drawMaze();
    } else {
        generationInterval = setInterval(() => iteration(stack, false), 25);
    }
}

function iteration(stack: (Coordinate | undefined)[], instant: boolean): boolean | undefined {
    if (visitedCount >= visitedTarget-1) {
        if (instant) {
            return true;
        } else {
            clearInterval(generationInterval);
        }
    }

    let neighbors = getNeighbors(stack[stack.length-1], maze);

    if (neighbors.length > 0) {
        // Neighbors exist, pick random.
        const current = neighbors[Math.floor(Math.random() * neighbors.length)]
        
        visit(current?.coordinate, stack, maze, instant, current?.direction);
    } else {
        // If no neighbors, backtrack until theres at least 1 of them.

        while (neighbors.length < 1) {
            stack.pop();
            neighbors = getNeighbors(stack[stack.length-1], maze);
        }
    }
}