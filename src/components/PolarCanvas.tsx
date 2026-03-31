"use client";

import { useRef, useEffect } from "react";
import { plotPolar } from "@/lib/polarRenderer";
import type { RFunc, PlotOptions } from "@/types";

interface PolarCanvasProps {
  rFunc: RFunc;
  thetaRange: [number, number];
  options?: PlotOptions;
  size?: number;
}

export default function PolarCanvas({
  rFunc,
  thetaRange,
  options,
  size = 250,
}: PolarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, size, size);

    plotPolar(ctx, rFunc, thetaRange, {
      strokeColor: "var(--curve-stroke)",
      strokeWidth: 2,
      showGrid: true,
      gridColor: "var(--grid-line)",
      padding: 20,
      samples: 1000,
      ...options,
    });
  }, [rFunc, thetaRange, options, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="rounded-xl bg-[var(--bg-primary)]"
    />
  );
}
