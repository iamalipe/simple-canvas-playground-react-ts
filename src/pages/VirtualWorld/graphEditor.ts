import { Graph } from "./math/graph";
import { getNearestPoint } from "./math/utils";
import { Point, Segment } from "./primitives";

class GraphEditor {
  canvas: HTMLCanvasElement;
  graph: Graph;
  ctx: CanvasRenderingContext2D;

  selected: Point | null = null;
  hovered: Point | null = null;
  dragging = false;
  mouse: Point | null = null;

  constructor(canvas: HTMLCanvasElement, graph: Graph) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("ctx : CanvasRenderingContext2D not found");
    this.ctx = ctx;
    this.graph = graph;
    this.#addEventListeners();
  }
  display() {
    this.graph.draw(this.ctx);
    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }
    if (this.selected) {
      const intent = this.hovered ? this.hovered : this.mouse;
      if (!intent) return;
      new Segment(this.selected, intent).draw(this.ctx, { dash: [3, 3] });
      this.selected.draw(this.ctx, { outline: true });
    }
  }

  #addEventListeners() {
    // this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
    this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
    // this.canvas.addEventListener("mouseup", () => this.dragging = false);
  }

  #handleMouseMove(evt: MouseEvent) {
    this.mouse = new Point(evt.offsetX, evt.offsetY);
    this.hovered = getNearestPoint(this.mouse, this.graph.points, 10);
    if (this.dragging == true) {
      if (!this.selected) return;
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }
  }
}

export default GraphEditor;
