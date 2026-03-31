export type QuizMode = "expression-to-graph" | "graph-to-expression";

export type Tier = 1 | 2 | 3 | 4;

export type DistractorStrategy =
  | "trig-swap"
  | "sign-flip"
  | "frequency-shift"
  | "param-tweak"
  | "family-swap"
  | "ratio-flip";

export type RFuncStandard = (theta: number) => number;

export type RFuncSquared = {
  rSquared: true;
  func: (theta: number) => number;
};

export type RFunc = RFuncStandard | RFuncSquared;

export interface CurveTemplate {
  id: string;
  name: string;
  family: string;
  expression: string;
  rFunc: RFunc;
  thetaRange: [number, number];
  tier: Tier;
  distractorStrategies: DistractorStrategy[];
  params: Record<string, number>;
}

export interface PlotOptions {
  strokeColor?: string;
  strokeWidth?: number;
  showGrid?: boolean;
  gridColor?: string;
  padding?: number;
  samples?: number;
  logicalWidth?: number;
  logicalHeight?: number;
}

export interface QuizQuestion {
  mode: QuizMode;
  correctIndex: number;
  options: CurveTemplate[];
}

export interface QuizState {
  mode: QuizMode;
  currentTier: Tier;
  score: number;
  streak: number;
  totalAnswered: number;
  correctPerTier: Record<Tier, number>;
  question: QuizQuestion | null;
  selectedIndex: number | null;
  showResult: boolean;
}
