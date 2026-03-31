import type {
  QuizMode,
  Tier,
  CurveTemplate,
  QuizQuestion,
  QuizState,
} from "@/types";
import { getCurvesByTier } from "./curves";
import { generateDistractors } from "./distractors";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ---------------------------------------------------------------------------
// createInitialState
// ---------------------------------------------------------------------------

export function createInitialState(
  mode: QuizMode = "expression-to-graph",
): QuizState {
  return {
    mode,
    currentTier: 1,
    score: 0,
    streak: 0,
    totalAnswered: 0,
    correctPerTier: { 1: 0, 2: 0, 3: 0, 4: 0 },
    question: null,
    selectedIndex: null,
    showResult: false,
  };
}

// ---------------------------------------------------------------------------
// generateQuestion
// ---------------------------------------------------------------------------

export function generateQuestion(state: QuizState): QuizQuestion {
  const pool = getCurvesByTier(state.currentTier);
  const correct = pool[Math.floor(Math.random() * pool.length)];
  const distractors = generateDistractors(correct, 3);

  const allOptions = [correct, ...distractors];
  const shuffled = shuffle(allOptions);
  const correctIndex = shuffled.indexOf(correct);

  return {
    mode: state.mode,
    correctIndex,
    options: shuffled,
  };
}

// ---------------------------------------------------------------------------
// submitAnswer
// ---------------------------------------------------------------------------

export function submitAnswer(
  state: QuizState,
  selectedIndex: number,
): QuizState {
  const isCorrect = state.question !== null &&
    selectedIndex === state.question.correctIndex;

  const newStreak = isCorrect ? state.streak + 1 : 0;
  const newScore = isCorrect ? state.score + 1 : state.score;
  const newTotalAnswered = state.totalAnswered + 1;

  const newCorrectPerTier = { ...state.correctPerTier };
  if (isCorrect) {
    newCorrectPerTier[state.currentTier] =
      (newCorrectPerTier[state.currentTier] || 0) + 1;
  }

  // Advance tier if streak >= 5 and not already at max tier
  let newTier = state.currentTier;
  let adjustedStreak = newStreak;
  if (newStreak >= 5 && state.currentTier < 4) {
    newTier = (state.currentTier + 1) as Tier;
    adjustedStreak = 0;
  }

  return {
    ...state,
    score: newScore,
    streak: adjustedStreak,
    totalAnswered: newTotalAnswered,
    correctPerTier: newCorrectPerTier,
    currentTier: newTier,
    selectedIndex,
    showResult: true,
  };
}

// ---------------------------------------------------------------------------
// nextQuestion
// ---------------------------------------------------------------------------

export function nextQuestion(state: QuizState): QuizState {
  const newState: QuizState = {
    ...state,
    selectedIndex: null,
    showResult: false,
  };
  newState.question = generateQuestion(newState);
  return newState;
}

// ---------------------------------------------------------------------------
// toggleMode
// ---------------------------------------------------------------------------

export function toggleMode(state: QuizState): QuizState {
  const newMode: QuizMode =
    state.mode === "expression-to-graph"
      ? "graph-to-expression"
      : "expression-to-graph";

  const newState: QuizState = {
    ...state,
    mode: newMode,
    selectedIndex: null,
    showResult: false,
  };
  newState.question = generateQuestion(newState);
  return newState;
}
