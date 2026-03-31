"use client";

import type { QuizState, Tier } from "@/types";

interface ScoreBarProps {
  state: QuizState;
  onTierChange: (tier: Tier) => void;
}

const tierLabels: Record<Tier, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
  4: "Expert",
};

const tierColors: Record<Tier, string> = {
  1: "#6366f1",
  2: "#8b5cf6",
  3: "#f59e0b",
  4: "#ef4444",
};

const tiers: Tier[] = [1, 2, 3, 4];

export default function ScoreBar({ state, onTierChange }: ScoreBarProps) {
  const { score, streak, currentTier } = state;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Score */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)] font-medium">Score</span>
          <span className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">
            {score}
          </span>
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

        {/* Current tier label */}
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-bold px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: tierColors[currentTier] + "20",
              color: tierColors[currentTier],
            }}
          >
            {tierLabels[currentTier]}
          </span>
        </div>
      </div>

      {/* Tier selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-secondary)] font-medium mr-1">Difficulty</span>
        {tiers.map((tier) => (
          <button
            key={tier}
            onClick={() => onTierChange(tier)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-semibold
              transition-all duration-200
              ${
                tier === currentTier
                  ? "shadow-md scale-105"
                  : "opacity-50 hover:opacity-80"
              }
            `}
            style={{
              backgroundColor:
                tier === currentTier
                  ? tierColors[tier] + "30"
                  : tierColors[tier] + "10",
              color: tierColors[tier],
              borderWidth: 1,
              borderColor:
                tier === currentTier
                  ? tierColors[tier] + "60"
                  : "transparent",
            }}
          >
            {tier} - {tierLabels[tier]}
          </button>
        ))}
      </div>

      {/* Progress bar toward next tier */}
      {currentTier < 4 && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--text-secondary)]">
              Next tier progress
            </span>
            <span className="text-xs text-[var(--text-secondary)] tabular-nums">
              {streak}/5 streak
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[var(--border-subtle)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(streak / 5, 1) * 100}%`,
                backgroundColor: tierColors[currentTier],
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
