export type QuizMode = "expression-to-graph" | "graph-to-expression";

export type RFuncStandard = (theta: number) => number;

export type RFuncSquared = {
  rSquared: true;
  func: (theta: number) => number;
};

export type RFunc = RFuncStandard | RFuncSquared;

export interface CurveTemplate {
  id: string;
  name: string;
  expression: string;
  rFunc: RFunc;
  thetaRange: [number, number];
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
  score: number;
  streak: number;
  totalAnswered: number;
  question: QuizQuestion | null;
  selectedIndex: number | null;
  showResult: boolean;
}
