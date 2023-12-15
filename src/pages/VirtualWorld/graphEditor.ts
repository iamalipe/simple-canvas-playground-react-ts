import { Graph } from "./math/graph";

class GraphEditor {
  canvas: HTMLCanvasElement;
  graph: Graph;
  ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, graph: Graph) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("ctx : CanvasRenderingContext2D not found");
    this.ctx = ctx;
    this.graph = graph;
  }
  display() {
    this.graph.draw(this.ctx);
  }
}

export default GraphEditor;
