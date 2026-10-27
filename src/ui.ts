import { generateMaze, prepare } from "./generation.js";
import { configureRendering, drawMaze } from "./rendering.js";

const mazeWidthInput: HTMLInputElement = document.getElementById("mazeWidth") as HTMLInputElement;
const mazeHeightInput: HTMLInputElement = document.getElementById("mazeHeight") as HTMLInputElement;
const generateButton: HTMLButtonElement = document.getElementById("generateButton") as HTMLButtonElement;
const canvasWidthInput: HTMLInputElement = document.getElementById("canvasWidth") as HTMLInputElement;
const canvasHeightInput: HTMLInputElement = document.getElementById("canvasHeight") as HTMLInputElement;
const instantCheckBox: HTMLInputElement = document.getElementById("instantCheckBox") as HTMLInputElement;
const delayDiv: HTMLDivElement = document.getElementById("delayDiv") as HTMLDivElement;
const delayInput: HTMLInputElement = document.getElementById("delayInput") as HTMLInputElement;

mazeWidthInput.value = "32";
mazeHeightInput.value = "32";
canvasWidthInput.value = "800";
canvasHeightInput.value = "600";
instantCheckBox.checked = true;
delayDiv.style.display = "none";

generateButton.addEventListener("click", () => {
    prepare(parseInt(mazeWidthInput.value), parseInt(mazeHeightInput.value));
    configureRendering(parseInt(canvasWidthInput.value), parseInt(canvasHeightInput.value));
    generateMaze(instantCheckBox.checked, parseInt(delayInput.value));
    drawMaze();
});

instantCheckBox.addEventListener("change", () => {
    delayDiv.style.display = instantCheckBox.checked ? "none" : "inline";
});