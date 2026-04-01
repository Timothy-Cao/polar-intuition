"use client";

import { useMemo } from "react";
import katex from "katex";
import PolarCanvas from "@/components/PolarCanvas";
import QuizCard from "@/components/QuizCard";
import { formatExpression } from "@/lib/mathFormat";
import type { QuizState } from "@/types";

interface QuizBoardProps {
  state: QuizState;
  onSelect: (index: number) => void;
}

const tips = [
  "Look at the number of petals, loops, or lobes to narrow down the formula.",
  "Symmetry is key: even functions produce symmetric graphs, odd functions don't.",
  "Products of trig functions create more complex petal patterns.",
  "The sign and magnitude of coefficients control dimples, loops, and amplitude.",
  "Spirals grow outward — Archimedean linearly, logarithmic exponentially.",
  "Adding a constant offset shifts the curve away from the origin.",
  "Higher frequency terms (like sin(6θ)) create more oscillations around the curve.",
  "Absolute value |f(θ)| reflects negative portions, doubling visible features.",
  "Squared trig functions produce smoother, rounder shapes than their originals.",
];

export default function QuizBoard({ state, onSelect }: QuizBoardProps) {
  const { question, showResult, selectedIndex, mode } = state;

  const correctCurve = question
    ? question.options[question.correctIndex]
    : null;

  const promptKatex = useMemo(() => {
    if (!correctCurve || mode !== "expression-to-graph") return "";
    return katex.renderToString(formatExpression(correctCurve.expression), {
      throwOnError: false,
      displayMode: true,
    });
  }, [correctCurve, mode]);

  if (!question) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--text-secondary)] text-lg animate-pulse">
          Loading question...
        </div>
      </div>
    );
  }

  const wasWrong =
    showResult && selectedIndex !== null && selectedIndex !== question.correctIndex;

  const tip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Prompt */}
      <div className="flex flex-col items-center gap-4 text-center">
        {mode === "expression-to-graph" ? (
          <>
            <h2 className="text-lg font-medium text-[var(--text-secondary)]">
              Which graph matches this expression?
            </h2>
            <div
              className="text-2xl text-[var(--text-primary)]"
              dangerouslySetInnerHTML={{ __html: promptKatex }}
            />
          </>
        ) : (
          <>
            <h2 className="text-lg font-medium text-[var(--text-secondary)]">
              Which expression matches this curve?
            </h2>
            <div className="mt-1">
              <PolarCanvas
                rFunc={correctCurve!.rFunc}
                thetaRange={correctCurve!.thetaRange}
                size={350}
              />
            </div>
          </>
        )}
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 w-full max-w-2xl">
        {question.options.map((curve, i) => (
          <QuizCard
            key={curve.id + "-" + i}
            curve={curve}
            mode={mode}
            index={i}
            selected={selectedIndex === i}
            isCorrect={
              showResult
                ? i === question.correctIndex
                  ? true
                  : i === selectedIndex
                    ? false
                    : null
                : null
            }
            showResult={showResult}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>

      {/* Wrong answer tip */}
      {wasWrong && (
        <div className="w-full max-w-2xl rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] px-5 py-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="text-[var(--accent-highlight)] font-semibold">Tip:</span>{" "}
            {tip}
          </p>
        </div>
      )}
    </div>
  );
}
