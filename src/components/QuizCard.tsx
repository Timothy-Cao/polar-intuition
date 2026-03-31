"use client";

import { useMemo } from "react";
import katex from "katex";
import PolarCanvas from "@/components/PolarCanvas";
import { formatExpression } from "@/lib/mathFormat";
import type { CurveTemplate, QuizMode } from "@/types";

interface QuizCardProps {
  curve: CurveTemplate;
  mode: QuizMode;
  index: number;
  selected: boolean;
  isCorrect: boolean | null;
  showResult: boolean;
  onClick: () => void;
}

export default function QuizCard({
  curve,
  mode,
  index,
  selected,
  isCorrect,
  showResult,
  onClick,
}: QuizCardProps) {
  const katexHtml = useMemo(() => {
    if (mode !== "graph-to-expression") return "";
    return katex.renderToString(formatExpression(curve.expression), {
      throwOnError: false,
    });
  }, [mode, curve.expression]);

  const borderColor = showResult
    ? selected && isCorrect
      ? "border-[var(--accent-correct)] shadow-[0_0_16px_rgba(34,197,94,0.25)]"
      : selected && !isCorrect
        ? "border-[var(--accent-wrong)] shadow-[0_0_16px_rgba(239,68,68,0.25)]"
        : isCorrect
          ? "border-[var(--accent-correct)] shadow-[0_0_12px_rgba(34,197,94,0.15)]"
          : "border-[var(--border-subtle)]"
    : selected
      ? "border-[var(--accent-highlight)]"
      : "border-[var(--border-subtle)]";

  const label = String.fromCharCode(65 + index);

  return (
    <button
      onClick={onClick}
      disabled={showResult}
      className={`
        relative flex flex-col items-center justify-center
        rounded-2xl border-2 p-3
        bg-[var(--bg-card)] transition-all duration-300 ease-out
        ${borderColor}
        ${!showResult ? "hover:bg-[var(--bg-card-hover)] hover:border-[var(--accent-highlight)] hover:scale-[1.02] cursor-pointer" : "cursor-default"}
        ${showResult && !selected && !isCorrect ? "opacity-40" : "opacity-100"}
      `}
    >
      <span className="absolute top-2 left-3 text-xs font-semibold text-[var(--text-secondary)]">
        {label}
      </span>

      {mode === "expression-to-graph" ? (
        <PolarCanvas
          rFunc={curve.rFunc}
          thetaRange={curve.thetaRange}
          size={140}
        />
      ) : (
        <div
          className="flex items-center justify-center min-h-[120px] px-2 text-[var(--text-primary)] text-lg"
          dangerouslySetInnerHTML={{ __html: katexHtml }}
        />
      )}

      {showResult && selected && isCorrect && (
        <span className="absolute top-2 right-3 text-[var(--accent-correct)] text-sm font-bold">
          Correct
        </span>
      )}
      {showResult && selected && !isCorrect && (
        <span className="absolute top-2 right-3 text-[var(--accent-wrong)] text-sm font-bold">
          Wrong
        </span>
      )}
    </button>
  );
}
