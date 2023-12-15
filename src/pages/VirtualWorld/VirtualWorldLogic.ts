import { Graph } from "./math/graph";
import { randomInt } from "./math/utils";
import { Point, Segment } from "./primitives";

class VirtualWorldLogic {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  graph: Graph;
  pointSize = 20;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("ctx : CanvasRenderingContext2D not found");
    this.ctx = ctx;

    const p1 = new Point(100, 150, this.pointSize);
    const p2 = new Point(600, 250, this.pointSize);
    const p3 = new Point(200, 250, this.pointSize);
    const p4 = new Point(300, 550, this.pointSize);

    const s1 = new Segment(p1, p2);
    const s2 = new Segment(p1, p3);
    const s3 = new Segment(p1, p4);
    const s4 = new Segment(p2, p2);
    const s5 = new Segment(p4, p3);

    this.graph = new Graph([p1, p2, p3, p4], [s1, s2, s3, s4, s5]);
  }

  initialize() {
    this.graph.draw(this.ctx);
  }
  start() {
    console.log("hello VirtualWorldLogic");
  }

  addRandomPoint() {
    const x =
      Math.floor(Math.random() * (this.canvas.width / this.pointSize)) *
      this.pointSize;
    const y =
      Math.floor(Math.random() * (this.canvas.height / this.pointSize)) *
      this.pointSize;

    this.graph.addPoint(new Point(x, y, this.pointSize));
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.graph.draw(this.ctx);
  }

  addRandomSegment() {
    const newSeg = new Segment(
      this.graph.points[randomInt(0, this.graph.points.length - 1)],
      this.graph.points[randomInt(0, this.graph.points.length - 1)]
    );
    const res = this.graph.tryAddSegment(newSeg);
    console.log("addRandomSegment", res);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.graph.draw(this.ctx);
  }
}

export default VirtualWorldLogic;
