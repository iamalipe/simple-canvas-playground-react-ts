import { Point } from "../primitives";

export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getNearestPoint = (
  loc: Point,
  points: Point[],
  threshold = Number.MAX_SAFE_INTEGER
) => {
  let minDist = Number.MAX_SAFE_INTEGER;
  let nearest = null;
  for (const point of points) {
    const dist = distance(point, loc);
    if (dist < minDist && dist < threshold) {
      minDist = dist;
      nearest = point;
    }
  }
  return nearest;
};

export const distance = (p1: Point, p2: Point) => {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
};
