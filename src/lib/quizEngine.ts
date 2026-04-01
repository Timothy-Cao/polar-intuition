import type {
  QuizMode,
  CurveTemplate,
  QuizQuestion,
  QuizState,
} from "@/types";
import { getAllCurves } from "./curves";

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

function pickRandom<T>(arr: T[], count: number, exclude?: Set<T>): T[] {
  const pool = exclude ? arr.filter((x) => !exclude.has(x)) : [...arr];
  const shuffled = shuffle(pool);
  return shuffled.slice(0, count);
}

// ---------------------------------------------------------------------------
// createInitialState
// ---------------------------------------------------------------------------

export function createInitialState(
  mode: QuizMode = "expression-to-graph",
): QuizState {
  return {
    mode,
    score: 0,
    streak: 0,
    totalAnswered: 0,
    question: null,
    selectedIndex: null,
    showResult: false,
  };
}

// ---------------------------------------------------------------------------
// generateQuestion — pure random from the full pool
// ---------------------------------------------------------------------------

export function generateQuestion(state: QuizState): QuizQuestion {
  const pool = getAllCurves();
  const correct = pool[Math.floor(Math.random() * pool.length)];

  // Pick 3 random distractors (different from correct)
  const distractors = pickRandom<CurveTemplate>(pool, 3, new Set([correct]));

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

  return {
    ...state,
    score: newScore,
    streak: newStreak,
    totalAnswered: newTotalAnswered,
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
