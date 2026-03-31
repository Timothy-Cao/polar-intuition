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

const familyTips: Record<string, string> = {
  rose: "Rose curves have the form r = a cos(n\u03b8) or r = a sin(n\u03b8). The number of petals depends on whether n is odd or even.",
  cardioid: "Cardioids are special lima\u00e7ons where a = b, creating a heart-shaped curve with a cusp at the origin.",
  limacon: "Lima\u00e7ons have the form r = a \u00b1 b cos(\u03b8). The shape varies from inner loop to dimpled to convex depending on a/b.",
  lemniscate: "Lemniscates satisfy r\u00b2 = a\u00b2 cos(2\u03b8) or sin(2\u03b8), forming a figure-8 shape.",
  spiral: "Spirals continuously increase or decrease in radius as \u03b8 grows.",
  circle: "Circles in polar form can be r = a, r = a cos(\u03b8), or r = a sin(\u03b8).",
  conic: "Conic sections in polar form use r = ed/(1 \u00b1 e cos(\u03b8)), where e is eccentricity.",
};

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

  const tip = correctCurve
    ? familyTips[correctCurve.family] || "Study the shape and symmetry of polar curves to build your intuition."
    : "";

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
