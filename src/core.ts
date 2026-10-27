export const screen = document.getElementById("screen") as HTMLCanvasElement | null;
export let ctx: CanvasRenderingContext2D | null;

if (screen) {
    ctx = screen.getContext("2d");
}