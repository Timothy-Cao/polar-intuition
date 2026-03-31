"use client";

import { useState, useEffect, useCallback } from "react";
import ScoreBar from "@/components/ScoreBar";
import ModeToggle from "@/components/ModeToggle";
import QuizBoard from "@/components/QuizBoard";
import {
  createInitialState,
  submitAnswer,
  nextQuestion,
  toggleMode,
} from "@/lib/quizEngine";
import type { QuizState } from "@/types";

export default function Home() {
  const [state, setState] = useState<QuizState>(createInitialState);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    setState((prev) => nextQuestion(prev));
  }, []);

  const handleSelect = useCallback(
    (index: number) => {
      if (state.showResult) return;
      setState((prev) => submitAnswer(prev, index));
      setShowNext(false);
      setTimeout(() => setShowNext(true), 1000);
    },
    [state.showResult],
  );

  const handleNext = useCallback(() => {
    setShowNext(false);
    setState((prev) => nextQuestion(prev));
  }, []);

  const handleToggle = useCallback(() => {
    setShowNext(false);
    setState((prev) => {
      const toggled = toggleMode(prev);
      return nextQuestion(toggled);
    });
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-8">
      <div className="w-full max-w-xl flex flex-col items-center gap-6">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          Polar Intuition
        </h1>

        {/* Score Bar */}
        <div className="w-full rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] px-5 py-4">
          <ScoreBar state={state} />
        </div>

        {/* Mode Toggle */}
        <ModeToggle mode={state.mode} onToggle={handleToggle} />

        {/* Quiz Board */}
        <QuizBoard state={state} onSelect={handleSelect} />

        {/* Next Button */}
        <div className="h-14 flex items-center justify-center">
          {state.showResult && showNext && (
            <button
              onClick={handleNext}
              className="
                px-8 py-3 rounded-xl font-semibold text-white
                bg-[var(--accent-highlight)] hover:opacity-90
                shadow-lg shadow-indigo-500/25
                transition-all duration-300 ease-out
                animate-in fade-in slide-in-from-bottom-2
              "
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
