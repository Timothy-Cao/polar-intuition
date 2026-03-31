"use client";

import type { QuizMode } from "@/types";

interface ModeToggleProps {
  mode: QuizMode;
  onToggle: () => void;
}

export default function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  return (
    <div className="inline-flex rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-1">
      <button
        onClick={mode !== "expression-to-graph" ? onToggle : undefined}
        className={`
          relative px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-300 ease-out
          ${
            mode === "expression-to-graph"
              ? "bg-[var(--accent-highlight)] text-white shadow-lg shadow-indigo-500/20"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }
        `}
      >
        Expression &rarr; Graph
      </button>
      <button
        onClick={mode !== "graph-to-expression" ? onToggle : undefined}
        className={`
          relative px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-300 ease-out
          ${
            mode === "graph-to-expression"
              ? "bg-[var(--accent-highlight)] text-white shadow-lg shadow-indigo-500/20"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }
        `}
      >
        Graph &rarr; Expression
      </button>
    </div>
  );
}
