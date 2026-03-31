"use client";

import type { QuizState } from "@/types";

interface ScoreBarProps {
  state: QuizState;
}

export default function ScoreBar({ state }: ScoreBarProps) {
  const { score, streak, totalAnswered } = state;
  const accuracy =
    totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      {/* Score */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--text-secondary)] font-medium">Score</span>
        <span className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">
          {score}
        </span>
        {totalAnswered > 0 && (
          <span className="text-xs text-[var(--text-secondary)] tabular-nums">
            ({accuracy}%)
          </span>
        )}
      </div>

      {/* Streak */}
      <div className="flex items-center gap-1.5">
        <svg
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 2C10 2 6 7 6 11C6 13.2091 7.79086 15 10 15C12.2091 15 14 13.2091 14 11C14 7 10 2 10 2Z"
            fill={streak > 0 ? "#f59e0b" : "#4a4a5a"}
            stroke={streak > 0 ? "#f97316" : "#5a5a6a"}
            strokeWidth="1.5"
          />
        </svg>
        <span
          className={`text-lg font-bold tabular-nums ${
            streak > 0 ? "text-amber-400" : "text-[var(--text-secondary)]"
          }`}
        >
          {streak}
        </span>
      </div>

      {/* Total answered */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--text-secondary)] font-medium">
          {totalAnswered} answered
        </span>
      </div>
    </div>
  );
}
