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

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    // Set physical pixels for sharpness
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    // Reset transform and scale for DPR
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // plotPolar should work in logical (CSS) pixel coordinates
    plotPolar(ctx, rFunc, thetaRange, {
      strokeColor: "#a5b4fc",
      strokeWidth: 2.5,
      showGrid: true,
      gridColor: "#252540",
      padding: 20,
      samples: 2000,
      logicalWidth: size,
      logicalHeight: size,
      ...options,
    });
  }, [rFunc, thetaRange, options, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="rounded-xl"
    />
  );
}
