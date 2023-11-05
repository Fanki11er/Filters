import { FiltersBoard } from "./FiltersBoard";

const canvas: HTMLCanvasElement | null = document.getElementById(
  "canvas"
) as HTMLCanvasElement;

if (canvas) {
  new FiltersBoard(canvas);
}
