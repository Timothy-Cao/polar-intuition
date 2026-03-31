import type { RFunc, RFuncSquared, PlotOptions } from "@/types";

const R_MAX = 50;
const DEFAULT_STROKE_COLOR = "#818cf8";
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_GRID_COLOR = "#1e1e30";
const DEFAULT_PADDING = 20;
const DEFAULT_SAMPLES = 2000;
const BACKGROUND_COLOR = "#12121a";

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

/**
 * Samples all (x, y) points for the given polar function over the theta range.
 * For r² forms, returns two branches (positive and negative sqrt).
 * Each branch is an array of PolarPoint where `valid` indicates whether to draw.
 */
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

  // Standard r(theta)
  const branch: PolarPoint[] = [];
  for (let i = 0; i <= samples; i++) {
    const theta = thetaMin + i * step;
    const r = clampR(rFunc(theta));
    const pt = polarToCartesian(r, theta);
    branch.push(pt);
  }

  return [branch];
}

function findMaxR(branches: PolarPoint[][]): number {
  let maxR = 0;
  for (const branch of branches) {
    for (const pt of branch) {
      if (pt.valid) {
        const dist = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
        if (dist > maxR) maxR = dist;
      }
    }
  }
  return maxR;
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cx: number,
  cy: number,
  scale: number,
  maxR: number,
  gridColor: string
): void {
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;

  // Concentric circles: pick 4-5 evenly spaced radii
  const numCircles = 5;
  const rStep = maxR / numCircles;

  for (let i = 1; i <= numCircles; i++) {
    const r = rStep * i;
    const pixelR = r * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, pixelR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 12 radial lines (every 30 degrees)
  const maxPixelR = maxR * scale;
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + maxPixelR * Math.cos(angle),
      cy - maxPixelR * Math.sin(angle)
    );
    ctx.stroke();
  }
}

function drawBranch(
  ctx: CanvasRenderingContext2D,
  branch: PolarPoint[],
  cx: number,
  cy: number,
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

    const px = cx + pt.x * scale;
    const py = cy - pt.y * scale; // canvas y is inverted

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

  // First pass: sample all points and find max |r| for auto-scaling
  const branches = samplePoints(rFunc, thetaRange, samples);
  const maxR = findMaxR(branches);

  if (maxR === 0) return;

  // Auto-scale: fit the curve within the canvas with padding
  const availableWidth = width - 2 * padding;
  const availableHeight = height - 2 * padding;
  const scale = Math.min(availableWidth, availableHeight) / (2 * maxR);

  const cx = width / 2;
  const cy = height / 2;

  // Draw grid behind the curve
  if (showGrid) {
    drawGrid(ctx, width, height, cx, cy, scale, maxR, gridColor);
  }

  // Second pass: draw the actual curve paths
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const branch of branches) {
    drawBranch(ctx, branch, cx, cy, scale);
  }
}
