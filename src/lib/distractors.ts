import type {
  CurveTemplate,
  DistractorStrategy,
  RFunc,
  RFuncSquared,
} from "@/types";
import { curves } from "./curves";

// ---------------------------------------------------------------------------
// Helpers: evaluate an RFunc at a given theta
// ---------------------------------------------------------------------------

function evalR(rFunc: RFunc, theta: number): number {
  if (typeof rFunc === "function") {
    return rFunc(theta);
  }
  // RFuncSquared — return sqrt of the inner value (or 0 if negative)
  const val = (rFunc as RFuncSquared).func(theta);
  return val >= 0 ? Math.sqrt(val) : 0;
}

// ---------------------------------------------------------------------------
// Helpers: build rFunc from family + params
// ---------------------------------------------------------------------------

function buildCardioidFunc(a: number, useSin: boolean, sign: number): RFunc {
  const trig = useSin ? Math.sin : Math.cos;
  return (theta: number) => a * (1 + sign * trig(theta));
}

function buildLimaconFunc(a: number, b: number, useSin: boolean): RFunc {
  const trig = useSin ? Math.sin : Math.cos;
  return (theta: number) => a + b * trig(theta);
}

function buildRoseFunc(a: number, n: number, useSin: boolean): RFunc {
  const trig = useSin ? Math.sin : Math.cos;
  return (theta: number) => a * trig(n * theta);
}

function buildRoseRationalFunc(p: number, q: number, useSin: boolean): RFunc {
  const trig = useSin ? Math.sin : Math.cos;
  return (theta: number) => trig((p / q) * theta);
}

function buildLemniscateFunc(a: number, useSin: boolean): RFunc {
  const trig = useSin ? Math.sin : Math.cos;
  const a2 = a * a;
  return {
    rSquared: true,
    func: (theta: number) => a2 * trig(2 * theta),
  };
}

function buildCompoundFunc(
  m: number,
  n: number,
  swapTrig: boolean,
): RFunc {
  if (swapTrig) {
    return (theta: number) => Math.sin(m * theta) + Math.cos(n * theta);
  }
  return (theta: number) => Math.cos(m * theta) + Math.sin(n * theta);
}

function buildHybridFunc(
  a: number,
  b: number,
  n: number,
  useSin: boolean,
): RFunc {
  const trig = useSin ? Math.sin : Math.cos;
  return (theta: number) => a + b * trig(n * theta);
}

function buildConicFunc(a: number, e: number, useSin: boolean): RFunc {
  const trig = useSin ? Math.sin : Math.cos;
  return (theta: number) => a / (1 + e * trig(theta));
}

function buildArchimedesFunc(a: number): RFunc {
  return (theta: number) => a * theta;
}

function buildLogSpiralFunc(a: number, b: number): RFunc {
  return (theta: number) => a * Math.exp(b * theta);
}

function buildCochleoidFunc(a: number, useSin: boolean): RFunc {
  const trig = useSin ? Math.sin : Math.cos;
  return (theta: number) => (a * trig(theta)) / theta;
}

// ---------------------------------------------------------------------------
// Detect trig from expression/id
// ---------------------------------------------------------------------------

function usesSin(curve: CurveTemplate): boolean {
  // Check the id or expression for sin vs cos
  const expr = curve.expression.toLowerCase();
  const id = curve.id.toLowerCase();
  if (id.includes("-sin-")) return true;
  if (id.includes("-cos-")) return false;
  // Fall back to expression
  if (expr.includes("sin")) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Clone a CurveTemplate with overrides
// ---------------------------------------------------------------------------

function cloneCurve(
  base: CurveTemplate,
  overrides: Partial<CurveTemplate>,
): CurveTemplate {
  return { ...base, ...overrides };
}

// ---------------------------------------------------------------------------
// Strategy implementations
// ---------------------------------------------------------------------------

function applyTrigSwap(curve: CurveTemplate): CurveTemplate | null {
  const isSin = usesSin(curve);
  const swapped = !isSin;
  const family = curve.family;
  const p = curve.params;

  let rFunc: RFunc;
  let expression: string;

  switch (family) {
    case "cardioid": {
      const sign = (p.sign as number) ?? 1;
      rFunc = buildCardioidFunc(p.a, swapped, sign);
      const trigLabel = swapped ? "sin θ" : "cos θ";
      const signChar = sign === 1 ? "+" : "-";
      expression =
        p.a === 1
          ? `r = 1 ${signChar} ${trigLabel}`
          : `r = ${p.a}(1 ${signChar} ${trigLabel})`;
      break;
    }
    case "limacon-no-loop":
    case "limacon-loop": {
      rFunc = buildLimaconFunc(p.a, p.b, swapped);
      const trigLabel = swapped ? "sin θ" : "cos θ";
      if (p.b < 0) {
        expression = `r = ${p.a} - ${Math.abs(p.b)}${trigLabel}`;
      } else {
        expression = `r = ${p.a} + ${p.b}${trigLabel}`;
      }
      break;
    }
    case "rose-odd":
    case "rose-even": {
      rFunc = buildRoseFunc(p.a, p.n, swapped);
      const trigLabel = swapped ? "sin" : "cos";
      const aPrefix = p.a === 1 ? "" : `${p.a}`;
      expression = `r = ${aPrefix}${trigLabel}(${p.n}θ)`;
      break;
    }
    case "rose-rational": {
      rFunc = buildRoseRationalFunc(p.p, p.q, swapped);
      const trigLabel = swapped ? "sin" : "cos";
      expression = `r = ${trigLabel}(${p.p}/${p.q} · θ)`;
      break;
    }
    case "lemniscate": {
      rFunc = buildLemniscateFunc(p.a, swapped);
      const trigLabel = swapped ? "sin(2θ)" : "cos(2θ)";
      const a2 = p.a * p.a;
      expression = `r² = ${a2}${trigLabel}`;
      break;
    }
    case "compound": {
      rFunc = buildCompoundFunc(p.m, p.n, true);
      expression = `r = sin(${p.m}θ) + cos(${p.n}θ)`;
      break;
    }
    case "limacon-rose-hybrid": {
      rFunc = buildHybridFunc(p.a, p.b, p.n, !isSin);
      const trigLabel = swapped ? "sin" : "cos";
      expression = `r = ${p.a} + ${p.b}${trigLabel}(${p.n}θ)`;
      break;
    }
    case "conic": {
      rFunc = buildConicFunc(p.a, p.e, swapped);
      const trigLabel = swapped ? "sin θ" : "cos θ";
      expression = `r = ${p.a}/(1 + ${p.e}${trigLabel})`;
      break;
    }
    case "cochleoid": {
      rFunc = buildCochleoidFunc(p.a, swapped);
      const trigLabel = swapped ? "sin" : "cos";
      expression = `r = ${p.a}${trigLabel}(θ)/θ`;
      break;
    }
    default:
      return null;
  }

  return cloneCurve(curve, {
    id: `${curve.id}-dist-trig-swap`,
    expression,
    rFunc,
  });
}

function applySignFlip(curve: CurveTemplate): CurveTemplate | null {
  const isSin = usesSin(curve);
  const family = curve.family;
  const p = curve.params;

  let rFunc: RFunc;
  let expression: string;

  switch (family) {
    case "cardioid": {
      const oldSign = (p.sign as number) ?? 1;
      const newSign = -oldSign;
      rFunc = buildCardioidFunc(p.a, isSin, newSign);
      const trigLabel = isSin ? "sin θ" : "cos θ";
      const signChar = newSign === 1 ? "+" : "-";
      expression =
        p.a === 1
          ? `r = 1 ${signChar} ${trigLabel}`
          : `r = ${p.a}(1 ${signChar} ${trigLabel})`;
      break;
    }
    case "limacon-no-loop":
    case "limacon-loop": {
      const newB = -p.b;
      rFunc = buildLimaconFunc(p.a, newB, isSin);
      const trigLabel = isSin ? "sin θ" : "cos θ";
      if (newB < 0) {
        expression = `r = ${p.a} - ${Math.abs(newB)}${trigLabel}`;
      } else {
        expression = `r = ${p.a} + ${newB}${trigLabel}`;
      }
      break;
    }
    case "lemniscate": {
      // Flip sign inside: cos(2θ) → -cos(2θ) doesn't make physical sense for r²,
      // so negate via trig swap instead
      return applyTrigSwap(curve);
    }
    case "conic": {
      // Flip sign: 1 + e·cos → 1 - e·cos
      const newE = -p.e;
      rFunc = buildConicFunc(p.a, newE, isSin);
      const trigLabel = isSin ? "sin θ" : "cos θ";
      expression = `r = ${p.a}/(1 - ${Math.abs(p.e)}${trigLabel})`;
      break;
    }
    case "archimedes": {
      const newA = -p.a;
      rFunc = buildArchimedesFunc(newA);
      expression = `r = ${newA}θ`;
      break;
    }
    default:
      return null;
  }

  return cloneCurve(curve, {
    id: `${curve.id}-dist-sign-flip`,
    expression,
    rFunc,
  });
}

function applyFrequencyShift(curve: CurveTemplate): CurveTemplate | null {
  const isSin = usesSin(curve);
  const family = curve.family;
  const p = curve.params;

  // Pick direction: +1 or -1 (but keep n >= 1)
  const direction = Math.random() < 0.5 ? 1 : -1;

  let rFunc: RFunc;
  let expression: string;

  switch (family) {
    case "rose-odd":
    case "rose-even": {
      const newN = Math.max(1, p.n + direction);
      if (newN === p.n) return null;
      rFunc = buildRoseFunc(p.a, newN, isSin);
      const trigLabel = isSin ? "sin" : "cos";
      const aPrefix = p.a === 1 ? "" : `${p.a}`;
      expression = `r = ${aPrefix}${trigLabel}(${newN}θ)`;
      return cloneCurve(curve, {
        id: `${curve.id}-dist-frequency-shift`,
        expression,
        rFunc,
        thetaRange: [0, 2 * Math.PI],
      });
    }
    case "rose-rational": {
      // Shift p by ±1
      const newP = Math.max(1, p.p + direction);
      if (newP === p.p) return null;
      rFunc = buildRoseRationalFunc(newP, p.q, isSin);
      const trigLabel = isSin ? "sin" : "cos";
      expression = `r = ${trigLabel}(${newP}/${p.q} · θ)`;
      return cloneCurve(curve, {
        id: `${curve.id}-dist-frequency-shift`,
        expression,
        rFunc,
        thetaRange: [0, p.q * 2 * Math.PI],
      });
    }
    case "compound": {
      const shiftM = Math.random() < 0.5;
      const newM = shiftM ? Math.max(1, p.m + direction) : p.m;
      const newN = shiftM ? p.n : Math.max(1, p.n + direction);
      if (newM === p.m && newN === p.n) return null;
      rFunc = buildCompoundFunc(newM, newN, false);
      expression = `r = cos(${newM}θ) + sin(${newN}θ)`;
      return cloneCurve(curve, {
        id: `${curve.id}-dist-frequency-shift`,
        expression,
        rFunc,
      });
    }
    case "limacon-rose-hybrid": {
      const newN = Math.max(1, p.n + direction);
      if (newN === p.n) return null;
      rFunc = buildHybridFunc(p.a, p.b, newN, isSin);
      const trigLabel = isSin ? "sin" : "cos";
      expression = `r = ${p.a} + ${p.b}${trigLabel}(${newN}θ)`;
      return cloneCurve(curve, {
        id: `${curve.id}-dist-frequency-shift`,
        expression,
        rFunc,
      });
    }
    case "butterfly": {
      // Shift the 4 in cos(4θ) to 3 or 5
      const newK = 4 + direction;
      rFunc = (theta: number) =>
        Math.exp(Math.sin(theta)) -
        2 * Math.cos(newK * theta) +
        Math.pow(Math.sin((2 * theta - Math.PI) / 24), 5);
      expression = `r = e^sin(θ) - 2cos(${newK}θ) + sin⁵((2θ-π)/24)`;
      return cloneCurve(curve, {
        id: `${curve.id}-dist-frequency-shift`,
        expression,
        rFunc,
      });
    }
    default:
      return null;
  }
}

function applyParamTweak(curve: CurveTemplate): CurveTemplate | null {
  const isSin = usesSin(curve);
  const family = curve.family;
  const p = curve.params;

  // Pick a tweak factor
  const tweaks = [0.5, 1.5, -1];
  const tweakIdx = Math.floor(Math.random() * tweaks.length);

  let rFunc: RFunc;
  let expression: string;

  switch (family) {
    case "cardioid": {
      // Tweak amplitude a
      const newA = Math.max(1, p.a + (tweakIdx === 2 ? -1 : tweakIdx === 0 ? -1 : 1));
      if (newA === p.a) return null;
      const sign = (p.sign as number) ?? 1;
      rFunc = buildCardioidFunc(newA, isSin, sign);
      const trigLabel = isSin ? "sin θ" : "cos θ";
      const signChar = sign === 1 ? "+" : "-";
      expression =
        newA === 1
          ? `r = 1 ${signChar} ${trigLabel}`
          : `r = ${newA}(1 ${signChar} ${trigLabel})`;
      break;
    }
    case "limacon-no-loop":
    case "limacon-loop": {
      // Tweak b
      const absB = Math.abs(p.b);
      const signB = p.b >= 0 ? 1 : -1;
      const newAbsB = Math.max(1, absB + (Math.random() < 0.5 ? 1 : -1));
      if (newAbsB === absB) return null;
      const newB = signB * newAbsB;
      rFunc = buildLimaconFunc(p.a, newB, isSin);
      const trigLabel = isSin ? "sin θ" : "cos θ";
      if (newB < 0) {
        expression = `r = ${p.a} - ${Math.abs(newB)}${trigLabel}`;
      } else {
        expression = `r = ${p.a} + ${newB}${trigLabel}`;
      }
      break;
    }
    case "rose-odd":
    case "rose-even": {
      // Tweak amplitude a
      const newA = p.a === 1 ? 2 : p.a === 2 ? 3 : 1;
      rFunc = buildRoseFunc(newA, p.n, isSin);
      const trigLabel = isSin ? "sin" : "cos";
      const aPrefix = newA === 1 ? "" : `${newA}`;
      expression = `r = ${aPrefix}${trigLabel}(${p.n}θ)`;
      break;
    }
    case "lemniscate": {
      const newA = p.a === 1 ? 2 : p.a === 2 ? 3 : 1;
      rFunc = buildLemniscateFunc(newA, isSin);
      const trigLabel = isSin ? "sin(2θ)" : "cos(2θ)";
      const a2 = newA * newA;
      expression = `r² = ${a2}${trigLabel}`;
      break;
    }
    case "archimedes": {
      const newA = p.a === 1 ? 2 : p.a === 0.5 ? 1 : 0.5;
      rFunc = buildArchimedesFunc(newA);
      expression = `r = ${newA}θ`;
      break;
    }
    case "log-spiral": {
      // Tweak b
      const newB = p.b * (Math.random() < 0.5 ? 1.5 : 0.5);
      const rounded = Math.round(newB * 100) / 100;
      rFunc = buildLogSpiralFunc(p.a, rounded);
      expression = `r = ${p.a}·e^(${rounded}θ)`;
      break;
    }
    case "fermat": {
      const newA = p.a === 1 ? 2 : 1;
      const a2 = newA * newA;
      rFunc = {
        rSquared: true,
        func: (theta: number) => a2 * theta,
      };
      expression = `r² = ${a2}θ`;
      break;
    }
    case "hyperbolic": {
      const newA = p.a === 1 ? 2 : 1;
      rFunc = (theta: number) => newA / theta;
      expression = `r = ${newA}/θ`;
      break;
    }
    case "conic": {
      // Tweak eccentricity
      const newE = Math.round((p.e + (Math.random() < 0.5 ? 0.3 : -0.3)) * 10) / 10;
      if (newE <= 0 || newE === p.e) return null;
      rFunc = buildConicFunc(p.a, newE, false);
      expression = `r = ${p.a}/(1 + ${newE}cos θ)`;
      break;
    }
    case "compound": {
      // Swap m and n
      rFunc = buildCompoundFunc(p.n, p.m, false);
      expression = `r = cos(${p.n}θ) + sin(${p.m}θ)`;
      break;
    }
    case "limacon-rose-hybrid": {
      // Tweak b
      const newB = p.b === 1 ? 2 : p.b === 2 ? 3 : 1;
      rFunc = buildHybridFunc(p.a, newB, p.n, isSin);
      const trigLabel = isSin ? "sin" : "cos";
      expression = `r = ${p.a} + ${newB}${trigLabel}(${p.n}θ)`;
      break;
    }
    case "butterfly": {
      // Tweak the coefficient of cos(4θ)
      const newCoeff = Math.random() < 0.5 ? 3 : 1;
      rFunc = (theta: number) =>
        Math.exp(Math.sin(theta)) -
        newCoeff * Math.cos(4 * theta) +
        Math.pow(Math.sin((2 * theta - Math.PI) / 24), 5);
      expression = `r = e^sin(θ) - ${newCoeff}cos(4θ) + sin⁵((2θ-π)/24)`;
      break;
    }
    case "cochleoid": {
      const newA = p.a === 1 ? 2 : 1;
      rFunc = buildCochleoidFunc(newA, isSin);
      const trigLabel = isSin ? "sin" : "cos";
      expression = `r = ${newA}${trigLabel}(θ)/θ`;
      break;
    }
    default:
      return null;
  }

  return cloneCurve(curve, {
    id: `${curve.id}-dist-param-tweak`,
    expression,
    rFunc,
  });
}

function applyFamilySwap(curve: CurveTemplate): CurveTemplate | null {
  // Pick a random curve from a different family but similar tier (±1)
  const candidates = curves.filter(
    (c) =>
      c.family !== curve.family &&
      Math.abs(c.tier - curve.tier) <= 1 &&
      c.id !== curve.id,
  );
  if (candidates.length === 0) return null;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  return cloneCurve(pick, {
    id: `${pick.id}-dist-family-swap`,
  });
}

function applyRatioFlip(curve: CurveTemplate): CurveTemplate | null {
  const isSin = usesSin(curve);
  const family = curve.family;
  const p = curve.params;

  let rFunc: RFunc;
  let expression: string;

  switch (family) {
    case "limacon-no-loop":
    case "limacon-loop": {
      // Swap a and b (absolute values)
      const newA = Math.abs(p.b);
      const newB = p.b >= 0 ? p.a : -p.a;
      if (newA === p.a && newB === p.b) return null;
      rFunc = buildLimaconFunc(newA, newB, isSin);
      const trigLabel = isSin ? "sin θ" : "cos θ";
      if (newB < 0) {
        expression = `r = ${newA} - ${Math.abs(newB)}${trigLabel}`;
      } else {
        expression = `r = ${newA} + ${newB}${trigLabel}`;
      }
      break;
    }
    case "rose-rational": {
      // Swap p and q
      if (p.p === p.q) return null;
      rFunc = buildRoseRationalFunc(p.q, p.p, isSin);
      const trigLabel = isSin ? "sin" : "cos";
      expression = `r = ${trigLabel}(${p.q}/${p.p} · θ)`;
      break;
    }
    default:
      return null;
  }

  return cloneCurve(curve, {
    id: `${curve.id}-dist-ratio-flip`,
    expression,
    rFunc,
  });
}

// ---------------------------------------------------------------------------
// Strategy dispatch
// ---------------------------------------------------------------------------

const strategyMap: Record<
  DistractorStrategy,
  (curve: CurveTemplate) => CurveTemplate | null
> = {
  "trig-swap": applyTrigSwap,
  "sign-flip": applySignFlip,
  "frequency-shift": applyFrequencyShift,
  "param-tweak": applyParamTweak,
  "family-swap": applyFamilySwap,
  "ratio-flip": applyRatioFlip,
};

// ---------------------------------------------------------------------------
// Distinguishability check
// ---------------------------------------------------------------------------

export function areCurvesDistinguishable(
  a: CurveTemplate,
  b: CurveTemplate,
): boolean {
  const SAMPLES = 20;
  const THRESHOLD = 0.15;

  // Use the overlapping theta range
  const tMin = Math.max(a.thetaRange[0], b.thetaRange[0]);
  const tMax = Math.min(a.thetaRange[1], b.thetaRange[1]);
  if (tMax <= tMin) return true; // Non-overlapping ranges are distinguishable

  const step = (tMax - tMin) / SAMPLES;
  let totalDiff = 0;

  for (let i = 0; i < SAMPLES; i++) {
    const theta = tMin + step * (i + 0.5);
    const rA = evalR(a.rFunc, theta);
    const rB = evalR(b.rFunc, theta);
    totalDiff += Math.abs(rA - rB);
  }

  const avgDiff = totalDiff / SAMPLES;
  return avgDiff > THRESHOLD;
}

// ---------------------------------------------------------------------------
// Shuffle helper
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
// Main: generateDistractors
// ---------------------------------------------------------------------------

export function generateDistractors(
  correct: CurveTemplate,
  count: number = 3,
): CurveTemplate[] {
  const distractors: CurveTemplate[] = [];
  const usedIds = new Set<string>([correct.id]);

  function tryAdd(candidate: CurveTemplate | null): boolean {
    if (!candidate) return false;
    if (usedIds.has(candidate.id)) return false;
    if (!areCurvesDistinguishable(correct, candidate)) return false;
    // Also check against existing distractors
    for (const d of distractors) {
      if (!areCurvesDistinguishable(d, candidate)) return false;
    }
    usedIds.add(candidate.id);
    distractors.push(candidate);
    return true;
  }

  // 1. Try declared strategies in shuffled order
  const strategies = shuffle(correct.distractorStrategies);
  for (const strategy of strategies) {
    if (distractors.length >= count) break;
    const apply = strategyMap[strategy];
    if (!apply) continue;
    const candidate = apply(correct);
    tryAdd(candidate);
  }

  // 2. If we still need more, try all strategies (some may not be in declared list)
  if (distractors.length < count) {
    const allStrategies = shuffle(
      Object.keys(strategyMap) as DistractorStrategy[],
    );
    for (const strategy of allStrategies) {
      if (distractors.length >= count) break;
      const apply = strategyMap[strategy];
      const candidate = apply(correct);
      tryAdd(candidate);
    }
  }

  // 3. Fall back to family-swap if still not enough
  let attempts = 0;
  while (distractors.length < count && attempts < 30) {
    attempts++;
    const candidate = applyFamilySwap(correct);
    tryAdd(candidate);
  }

  return distractors;
}
