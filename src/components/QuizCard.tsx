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
        rounded-2xl border-2 p-4
        bg-[var(--bg-card)] transition-all duration-300 ease-out
        shadow-lg shadow-black/30
        ${borderColor}
        ${!showResult ? "hover:bg-[var(--bg-card-hover)] hover:border-[var(--accent-highlight)] hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer" : "cursor-default"}
        ${showResult && !selected && !isCorrect ? "opacity-30" : "opacity-100"}
      `}
    >
      <span className="absolute top-2 left-3 text-xs font-semibold text-[var(--text-secondary)]">
        {label}
      </span>

      {mode === "expression-to-graph" ? (
        <PolarCanvas
          rFunc={curve.rFunc}
          thetaRange={curve.thetaRange}
          size={220}
        />
      ) : (
        <div
          className="flex items-center justify-center min-h-[140px] px-4 text-[var(--text-primary)] text-xl"
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
