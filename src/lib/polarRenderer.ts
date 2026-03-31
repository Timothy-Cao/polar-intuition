import type { RFunc, RFuncSquared, PlotOptions } from "@/types";

const R_MAX = 50;
const DEFAULT_STROKE_COLOR = "#a5b4fc";
const DEFAULT_STROKE_WIDTH = 2.5;
const DEFAULT_GRID_COLOR = "#252540";
const DEFAULT_PADDING = 30;
const DEFAULT_SAMPLES = 2000;
const BACKGROUND_COLOR = "#0c0c18";

function isRSquared(rFunc: RFunc): rFunc is RFuncSquared {
  return typeof rFunc === "object" && "rSquared" in rFunc && rFunc.rSquared;
}

function clampR(r: number): number {
  return Math.max(-R_MAX, Math.min(R_MAX, r));
}

interface PolarPoint {
  x: number;
  y: number;
  valid: boolean;
}

function polarToCartesian(r: number, theta: number): PolarPoint {
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta),
    valid: isFinite(r) && isFinite(theta),
  };
}

function samplePoints(
  rFunc: RFunc,
  thetaRange: [number, number],
  samples: number
): PolarPoint[][] {
  const [thetaMin, thetaMax] = thetaRange;
  const step = (thetaMax - thetaMin) / samples;

  if (isRSquared(rFunc)) {
    const posBranch: PolarPoint[] = [];
    const negBranch: PolarPoint[] = [];

    for (let i = 0; i <= samples; i++) {
      const theta = thetaMin + i * step;
      const val = rFunc.func(theta);

      if (val < 0 || !isFinite(val)) {
        posBranch.push({ x: 0, y: 0, valid: false });
        negBranch.push({ x: 0, y: 0, valid: false });
      } else {
        const rPos = clampR(Math.sqrt(val));
        const rNeg = clampR(-Math.sqrt(val));
        posBranch.push(polarToCartesian(rPos, theta));
        negBranch.push(polarToCartesian(rNeg, theta));
      }
    }

    return [posBranch, negBranch];
  }

  const branch: PolarPoint[] = [];
  for (let i = 0; i <= samples; i++) {
    const theta = thetaMin + i * step;
    const r = clampR(rFunc(theta));
    const pt = polarToCartesian(r, theta);
    branch.push(pt);
  }

  return [branch];
}

interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function findBoundingBox(branches: PolarPoint[][]): BoundingBox {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const branch of branches) {
    for (const pt of branch) {
      if (pt.valid) {
        if (pt.x < minX) minX = pt.x;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.y < minY) minY = pt.y;
        if (pt.y > maxY) maxY = pt.y;
      }
    }
  }

  // Always include the origin so the grid makes sense
  if (minX > 0) minX = 0;
  if (maxX < 0) maxX = 0;
  if (minY > 0) minY = 0;
  if (maxY < 0) maxY = 0;

  return { minX, maxX, minY, maxY };
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  originPx: number,
  originPy: number,
  scale: number,
  bbox: BoundingBox,
  gridColor: string
): void {
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;

  // Find the max distance from origin to any corner of the bounding box
  const maxR = Math.max(
    Math.sqrt(bbox.minX * bbox.minX + bbox.minY * bbox.minY),
    Math.sqrt(bbox.maxX * bbox.maxX + bbox.minY * bbox.minY),
    Math.sqrt(bbox.minX * bbox.minX + bbox.maxY * bbox.maxY),
    Math.sqrt(bbox.maxX * bbox.maxX + bbox.maxY * bbox.maxY),
  );

  if (maxR === 0) return;

  // Concentric circles
  const numCircles = 5;
  const rStep = maxR / numCircles;

  for (let i = 1; i <= numCircles; i++) {
    const pixelR = rStep * i * scale;
    ctx.beginPath();
    ctx.arc(originPx, originPy, pixelR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 12 radial lines
  const maxPixelR = maxR * scale * 1.2;
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    ctx.beginPath();
    ctx.moveTo(originPx, originPy);
    ctx.lineTo(
      originPx + maxPixelR * Math.cos(angle),
      originPy - maxPixelR * Math.sin(angle)
    );
    ctx.stroke();
  }
}

function drawBranch(
  ctx: CanvasRenderingContext2D,
  branch: PolarPoint[],
  originPx: number,
  originPy: number,
  scale: number
): void {
  let inSegment = false;

  for (const pt of branch) {
    if (!pt.valid) {
      if (inSegment) {
        ctx.stroke();
        inSegment = false;
      }
      continue;
    }

    const px = originPx + pt.x * scale;
    const py = originPy - pt.y * scale;

    if (!inSegment) {
      ctx.beginPath();
      ctx.moveTo(px, py);
      inSegment = true;
    } else {
      ctx.lineTo(px, py);
    }
  }

  if (inSegment) {
    ctx.stroke();
  }
}

export function plotPolar(
  ctx: CanvasRenderingContext2D,
  rFunc: RFunc,
  thetaRange: [number, number],
  options?: PlotOptions
): void {
  const {
    strokeColor = DEFAULT_STROKE_COLOR,
    strokeWidth = DEFAULT_STROKE_WIDTH,
    showGrid = true,
    gridColor = DEFAULT_GRID_COLOR,
    padding = DEFAULT_PADDING,
    samples = DEFAULT_SAMPLES,
  } = options ?? {};

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Clear canvas with dark background
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, width, height);

  // Sample all points
  const branches = samplePoints(rFunc, thetaRange, samples);
  const bbox = findBoundingBox(branches);

  const dataWidth = bbox.maxX - bbox.minX;
  const dataHeight = bbox.maxY - bbox.minY;

  if (dataWidth === 0 && dataHeight === 0) return;

  // Scale to fit the bounding box within the canvas (with padding)
  const availableWidth = width - 2 * padding;
  const availableHeight = height - 2 * padding;
  const scale = Math.min(
    availableWidth / (dataWidth || 1),
    availableHeight / (dataHeight || 1)
  );

  // Center of the bounding box in data coordinates
  const dataCenterX = (bbox.minX + bbox.maxX) / 2;
  const dataCenterY = (bbox.minY + bbox.maxY) / 2;

  // The origin (0,0) in pixel coordinates — offset from canvas center
  // Canvas center maps to data center, so origin is shifted accordingly
  const canvasCenterX = width / 2;
  const canvasCenterY = height / 2;
  const originPx = canvasCenterX - dataCenterX * scale;
  const originPy = canvasCenterY + dataCenterY * scale; // y inverted

  // Draw grid centered on the polar origin
  if (showGrid) {
    drawGrid(ctx, originPx, originPy, scale, bbox, gridColor);
  }

  // Draw the curve
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const branch of branches) {
    drawBranch(ctx, branch, originPx, originPy, scale);
  }
}
