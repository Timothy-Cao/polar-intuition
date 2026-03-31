import type {
  CurveTemplate,
  DistractorStrategy,
  RFunc,
  Tier,
} from "@/types";

const PI = Math.PI;
const TWO_PI = 2 * Math.PI;
const SIX_PI = 6 * Math.PI;

// ---------------------------------------------------------------------------
// 1. Cardioids  (tier 1)  ~12 entries
// ---------------------------------------------------------------------------

const cardioidStrategies: DistractorStrategy[] = [
  "trig-swap",
  "sign-flip",
  "param-tweak",
];

function cardioids(): CurveTemplate[] {
  const out: CurveTemplate[] = [];
  const trigFns: Array<{
    name: string;
    fn: (t: number) => number;
    label: string;
  }> = [
    { name: "cos", fn: Math.cos, label: "cos θ" },
    { name: "sin", fn: Math.sin, label: "sin θ" },
  ];
  const signs: Array<{ sym: string; val: 1 | -1 }> = [
    { sym: "plus", val: 1 },
    { sym: "minus", val: -1 },
  ];
  const aValues = [1, 2, 3];

  for (const a of aValues) {
    for (const trig of trigFns) {
      for (const sign of signs) {
        const id = `cardioid-${trig.name}-${sign.sym}-${a}`;
        const signChar = sign.val === 1 ? "+" : "-";
        const expr =
          a === 1
            ? `r = 1 ${signChar} ${trig.label}`
            : `r = ${a}(1 ${signChar} ${trig.label})`;
        out.push({
          id,
          name: `Cardioid (${a}, ${trig.name}, ${signChar})`,
          family: "cardioid",
          expression: expr,
          rFunc: ((aa: number, trigFn: (t: number) => number, s: number) =>
            (theta: number) =>
              aa * (1 + s * trigFn(theta)))(a, trig.fn, sign.val),
          thetaRange: [0, TWO_PI],
          tier: 1,
          distractorStrategies: cardioidStrategies,
          params: { a, sign: sign.val },
        });
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// 2. Limaçon (no loop)  (tier 1-2)  ~10 entries
// ---------------------------------------------------------------------------

const limaconNoLoopStrategies: DistractorStrategy[] = [
  "trig-swap",
  "sign-flip",
  "param-tweak",
  "family-swap",
];

function limaconsNoLoop(): CurveTemplate[] {
  const out: CurveTemplate[] = [];
  const pairs: [number, number][] = [
    [3, 1],
    [3, 2],
    [4, 1],
    [4, 3],
  ];
  const trigFns: Array<{
    name: string;
    fn: (t: number) => number;
    label: string;
  }> = [
    { name: "cos", fn: Math.cos, label: "cos θ" },
    { name: "sin", fn: Math.sin, label: "sin θ" },
  ];

  for (const [a, b] of pairs) {
    for (const trig of trigFns) {
      const id = `limacon-noloop-${trig.name}-${a}-${b}`;
      const tier: Tier = b / a > 0.5 ? 2 : 1;
      out.push({
        id,
        name: `Limaçon no-loop (${a} + ${b}${trig.name})`,
        family: "limacon-no-loop",
        expression: `r = ${a} + ${b}${trig.label}`,
        rFunc: ((aa: number, bb: number, trigFn: (t: number) => number) =>
          (theta: number) =>
            aa + bb * trigFn(theta))(a, b, trig.fn),
        thetaRange: [0, TWO_PI],
        tier,
        distractorStrategies: limaconNoLoopStrategies,
        params: { a, b },
      });
    }
  }

  // Add two sin-minus variants for variety
  out.push({
    id: "limacon-noloop-sin-minus-3-2",
    name: "Limaçon no-loop (3 - 2sin)",
    family: "limacon-no-loop",
    expression: "r = 3 - 2sin θ",
    rFunc: (theta: number) => 3 - 2 * Math.sin(theta),
    thetaRange: [0, TWO_PI],
    tier: 2,
    distractorStrategies: limaconNoLoopStrategies,
    params: { a: 3, b: -2 },
  });
  out.push({
    id: "limacon-noloop-cos-minus-4-1",
    name: "Limaçon no-loop (4 - cos)",
    family: "limacon-no-loop",
    expression: "r = 4 - cos θ",
    rFunc: (theta: number) => 4 - Math.cos(theta),
    thetaRange: [0, TWO_PI],
    tier: 1,
    distractorStrategies: limaconNoLoopStrategies,
    params: { a: 4, b: -1 },
  });

  return out;
}

// ---------------------------------------------------------------------------
// 3. Limaçon (with loop)  (tier 2)  ~8 entries
// ---------------------------------------------------------------------------

const limaconLoopStrategies: DistractorStrategy[] = [
  "trig-swap",
  "sign-flip",
  "param-tweak",
  "family-swap",
];

function limaconsWithLoop(): CurveTemplate[] {
  const out: CurveTemplate[] = [];
  const pairs: [number, number][] = [
    [1, 2],
    [1, 3],
    [2, 3],
  ];
  const trigFns: Array<{
    name: string;
    fn: (t: number) => number;
    label: string;
  }> = [
    { name: "cos", fn: Math.cos, label: "cos θ" },
    { name: "sin", fn: Math.sin, label: "sin θ" },
  ];

  for (const [a, b] of pairs) {
    for (const trig of trigFns) {
      const id = `limacon-loop-${trig.name}-${a}-${b}`;
      out.push({
        id,
        name: `Limaçon with loop (${a} + ${b}${trig.name})`,
        family: "limacon-loop",
        expression: `r = ${a} + ${b}${trig.label}`,
        rFunc: ((aa: number, bb: number, trigFn: (t: number) => number) =>
          (theta: number) =>
            aa + bb * trigFn(theta))(a, b, trig.fn),
        thetaRange: [0, TWO_PI],
        tier: 2,
        distractorStrategies: limaconLoopStrategies,
        params: { a, b },
      });
    }
  }

  // Two minus-sign variants
  out.push({
    id: "limacon-loop-cos-minus-1-2",
    name: "Limaçon with loop (1 - 2cos)",
    family: "limacon-loop",
    expression: "r = 1 - 2cos θ",
    rFunc: (theta: number) => 1 - 2 * Math.cos(theta),
    thetaRange: [0, TWO_PI],
    tier: 2,
    distractorStrategies: limaconLoopStrategies,
    params: { a: 1, b: -2 },
  });
  out.push({
    id: "limacon-loop-sin-minus-1-3",
    name: "Limaçon with loop (1 - 3sin)",
    family: "limacon-loop",
    expression: "r = 1 - 3sin θ",
    rFunc: (theta: number) => 1 - 3 * Math.sin(theta),
    thetaRange: [0, TWO_PI],
    tier: 2,
    distractorStrategies: limaconLoopStrategies,
    params: { a: 1, b: -3 },
  });

  return out;
}

// ---------------------------------------------------------------------------
// 4. Rose curves (odd n)  (tier 1-2)  ~12 entries
// ---------------------------------------------------------------------------

const roseStrategies: DistractorStrategy[] = [
  "trig-swap",
  "frequency-shift",
  "param-tweak",
];

function rosesOdd(): CurveTemplate[] {
  const out: CurveTemplate[] = [];
  const nValues = [1, 3, 5, 7];
  const aValues = [1, 2];
  const trigFns: Array<{
    name: string;
    fn: (t: number) => number;
    label: string;
  }> = [
    { name: "sin", fn: Math.sin, label: "sin" },
    { name: "cos", fn: Math.cos, label: "cos" },
  ];

  for (const n of nValues) {
    for (const a of aValues) {
      // Alternate sin/cos to keep count manageable while covering both
      const trigs = n <= 3 ? trigFns : [trigFns[n % 2]];
      for (const trig of trigs) {
        const tier: Tier = n <= 3 ? 1 : 2;
        const id = `rose-${trig.name}-${n}-${a}`;
        const aPrefix = a === 1 ? "" : `${a}`;
        out.push({
          id,
          name: `Rose ${trig.name}(${n}θ) a=${a}`,
          family: "rose-odd",
          expression: `r = ${aPrefix}${trig.label}(${n}θ)`,
          rFunc: ((aa: number, nn: number, trigFn: (t: number) => number) =>
            (theta: number) =>
              aa * trigFn(nn * theta))(a, n, trig.fn),
          thetaRange: [0, TWO_PI],
          tier,
          distractorStrategies: roseStrategies,
          params: { a, n },
        });
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// 5. Rose curves (even n)  (tier 2)  ~10 entries
// ---------------------------------------------------------------------------

function rosesEven(): CurveTemplate[] {
  const out: CurveTemplate[] = [];
  const nValues = [2, 4, 6, 8];
  const aValues = [1, 2];
  const trigFns: Array<{
    name: string;
    fn: (t: number) => number;
    label: string;
  }> = [
    { name: "sin", fn: Math.sin, label: "sin" },
    { name: "cos", fn: Math.cos, label: "cos" },
  ];

  for (const n of nValues) {
    for (const a of aValues) {
      const trigs = n <= 4 ? trigFns : [trigFns[n % 2]];
      for (const trig of trigs) {
        const id = `rose-${trig.name}-${n}-${a}`;
        const aPrefix = a === 1 ? "" : `${a}`;
        out.push({
          id,
          name: `Rose ${trig.name}(${n}θ) a=${a}`,
          family: "rose-even",
          expression: `r = ${aPrefix}${trig.label}(${n}θ)`,
          rFunc: ((aa: number, nn: number, trigFn: (t: number) => number) =>
            (theta: number) =>
              aa * trigFn(nn * theta))(a, n, trig.fn),
          thetaRange: [0, TWO_PI],
          tier: 2,
          distractorStrategies: roseStrategies,
          params: { a, n },
        });
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// 6. Rose (rational)  (tier 3)  ~6 entries
// ---------------------------------------------------------------------------

const roseRationalStrategies: DistractorStrategy[] = [
  "frequency-shift",
  "ratio-flip",
  "trig-swap",
];

function rosesRational(): CurveTemplate[] {
  const out: CurveTemplate[] = [];
  const ratios: [number, number][] = [
    [2, 3],
    [3, 2],
    [1, 3],
    [3, 4],
    [5, 3],
    [4, 3],
  ];

  for (const [p, q] of ratios) {
    const range = q * TWO_PI;
    const id = `rose-rational-${p}-${q}`;
    out.push({
      id,
      name: `Rose cos(${p}/${q} θ)`,
      family: "rose-rational",
      expression: `r = cos(${p}/${q} · θ)`,
      rFunc: ((pp: number, qq: number) => (theta: number) =>
        Math.cos((pp / qq) * theta))(p, q),
      thetaRange: [0, range],
      tier: 3,
      distractorStrategies: roseRationalStrategies,
      params: { p, q },
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// 7. Lemniscate  (tier 2)  ~4 entries
// ---------------------------------------------------------------------------

const lemniscateStrategies: DistractorStrategy[] = [
  "trig-swap",
  "sign-flip",
  "param-tweak",
];

function lemniscates(): CurveTemplate[] {
  const out: CurveTemplate[] = [];
  const aValues = [1, 2];
  const trigFns: Array<{
    name: string;
    fn: (t: number) => number;
    label: string;
  }> = [
    { name: "cos", fn: Math.cos, label: "cos(2θ)" },
    { name: "sin", fn: Math.sin, label: "sin(2θ)" },
  ];

  for (const a of aValues) {
    for (const trig of trigFns) {
      const a2 = a * a;
      const id = `lemniscate-${trig.name}-${a}`;
      out.push({
        id,
        name: `Lemniscate r²=${a2}${trig.label}`,
        family: "lemniscate",
        expression: `r² = ${a2}${trig.label}`,
        rFunc: {
          rSquared: true,
          func: ((aa2: number, trigFn: (t: number) => number) =>
            (theta: number) =>
              aa2 * trigFn(2 * theta))(a2, trig.fn),
        } as RFunc,
        thetaRange: [0, TWO_PI],
        tier: 2,
        distractorStrategies: lemniscateStrategies,
        params: { a },
      });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// 8. Archimedes spiral  (tier 2)  ~3 entries
// ---------------------------------------------------------------------------

const spiralStrategies: DistractorStrategy[] = [
  "sign-flip",
  "param-tweak",
  "family-swap",
];

function archimedean(): CurveTemplate[] {
  const aValues = [0.5, 1, -0.5];
  return aValues.map((a) => ({
    id: `archimedes-${String(a).replace("-", "neg").replace(".", "p")}`,
    name: `Archimedes spiral a=${a}`,
    family: "archimedes",
    expression: `r = ${a}θ`,
    rFunc: ((aa: number) => (theta: number) => aa * theta)(a),
    thetaRange: [0, SIX_PI] as [number, number],
    tier: 2 as Tier,
    distractorStrategies: spiralStrategies,
    params: { a },
  }));
}

// ---------------------------------------------------------------------------
// 9. Log spiral  (tier 3)  ~3 entries
// ---------------------------------------------------------------------------

const logSpiralStrategies: DistractorStrategy[] = [
  "param-tweak",
  "family-swap",
];

function logSpirals(): CurveTemplate[] {
  const configs: [number, number][] = [
    [0.5, 0.1],
    [1, 0.15],
    [0.3, 0.2],
  ];
  return configs.map(([a, b]) => ({
    id: `log-spiral-${a}-${b}`.replace(/\./g, "p"),
    name: `Log spiral a=${a}, b=${b}`,
    family: "log-spiral",
    expression: `r = ${a}·e^(${b}θ)`,
    rFunc: ((aa: number, bb: number) => (theta: number) =>
      aa * Math.exp(bb * theta))(a, b),
    thetaRange: [0, SIX_PI] as [number, number],
    tier: 3 as Tier,
    distractorStrategies: logSpiralStrategies,
    params: { a, b },
  }));
}

// ---------------------------------------------------------------------------
// 10. Fermat's spiral  (tier 3)  ~2 entries
// ---------------------------------------------------------------------------

function fermatSpirals(): CurveTemplate[] {
  const aValues = [1, 2];
  return aValues.map((a) => ({
    id: `fermat-${a}`,
    name: `Fermat's spiral a=${a}`,
    family: "fermat",
    expression: `r² = ${a * a}θ`,
    rFunc: {
      rSquared: true,
      func: ((aa: number) => (theta: number) => aa * aa * theta)(a),
    } as RFunc,
    thetaRange: [0, SIX_PI] as [number, number],
    tier: 3 as Tier,
    distractorStrategies: ["param-tweak", "family-swap"] as DistractorStrategy[],
    params: { a },
  }));
}

// ---------------------------------------------------------------------------
// 11. Hyperbolic spiral  (tier 3)  ~2 entries
// ---------------------------------------------------------------------------

function hyperbolicSpirals(): CurveTemplate[] {
  const aValues = [1, 2];
  return aValues.map((a) => ({
    id: `hyperbolic-${a}`,
    name: `Hyperbolic spiral a=${a}`,
    family: "hyperbolic",
    expression: `r = ${a}/θ`,
    rFunc: ((aa: number) => (theta: number) => aa / theta)(a),
    thetaRange: [0.1, SIX_PI] as [number, number],
    tier: 3 as Tier,
    distractorStrategies: ["param-tweak", "family-swap"] as DistractorStrategy[],
    params: { a },
  }));
}

// ---------------------------------------------------------------------------
// 12. Conic sections  (tier 3)  ~4 entries
// ---------------------------------------------------------------------------

const conicStrategies: DistractorStrategy[] = [
  "param-tweak",
  "family-swap",
  "sign-flip",
];

function conics(): CurveTemplate[] {
  const configs: Array<{ a: number; e: number; label: string }> = [
    { a: 2, e: 0.5, label: "ellipse" },
    { a: 2, e: 1, label: "parabola" },
    { a: 2, e: 1.5, label: "hyperbola" },
    { a: 3, e: 0.5, label: "ellipse" },
    { a: 1, e: 0.8, label: "ellipse" },
  ];
  return configs.map(({ a, e, label }) => ({
    id: `conic-${label}-${a}-${String(e).replace(".", "p")}`,
    name: `Conic ${label} (a=${a}, e=${e})`,
    family: "conic",
    expression: `r = ${a}/(1 + ${e}cos θ)`,
    rFunc: ((aa: number, ee: number) => (theta: number) =>
      aa / (1 + ee * Math.cos(theta)))(a, e),
    thetaRange: [0, TWO_PI] as [number, number],
    tier: 3 as Tier,
    distractorStrategies: conicStrategies,
    params: { a, e },
  }));
}

// ---------------------------------------------------------------------------
// 13. Compound curves  (tier 3-4)  ~4 entries
// ---------------------------------------------------------------------------

const compoundStrategies: DistractorStrategy[] = [
  "frequency-shift",
  "trig-swap",
  "param-tweak",
];

function compounds(): CurveTemplate[] {
  const configs: [number, number][] = [
    [2, 3],
    [3, 5],
    [1, 2],
    [4, 3],
  ];
  return configs.map(([m, n]) => ({
    id: `compound-${m}-${n}`,
    name: `Compound cos(${m}θ)+sin(${n}θ)`,
    family: "compound",
    expression: `r = cos(${m}θ) + sin(${n}θ)`,
    rFunc: ((mm: number, nn: number) => (theta: number) =>
      Math.cos(mm * theta) + Math.sin(nn * theta))(m, n),
    thetaRange: [0, TWO_PI] as [number, number],
    tier: (m + n > 6 ? 4 : 3) as Tier,
    distractorStrategies: compoundStrategies,
    params: { m, n },
  }));
}

// ---------------------------------------------------------------------------
// 14. Limaçon-rose hybrids  (tier 4)  ~4 entries
// ---------------------------------------------------------------------------

const hybridStrategies: DistractorStrategy[] = [
  "frequency-shift",
  "param-tweak",
  "trig-swap",
  "family-swap",
];

function limaconRoseHybrids(): CurveTemplate[] {
  const configs: [number, number, number][] = [
    [1, 2, 3],
    [2, 1, 4],
    [1, 1, 5],
    [2, 3, 2],
  ];
  return configs.map(([a, b, n]) => ({
    id: `hybrid-${a}-${b}-${n}`,
    name: `Hybrid ${a}+${b}sin(${n}θ)`,
    family: "limacon-rose-hybrid",
    expression: `r = ${a} + ${b}sin(${n}θ)`,
    rFunc: ((aa: number, bb: number, nn: number) => (theta: number) =>
      aa + bb * Math.sin(nn * theta))(a, b, n),
    thetaRange: [0, TWO_PI] as [number, number],
    tier: 4 as Tier,
    distractorStrategies: hybridStrategies,
    params: { a, b, n },
  }));
}

// ---------------------------------------------------------------------------
// 15. Butterfly curve  (tier 4)  1 entry
// ---------------------------------------------------------------------------

function butterfly(): CurveTemplate[] {
  return [
    {
      id: "butterfly-classic",
      name: "Butterfly curve",
      family: "butterfly",
      expression: "r = e^sin(θ) - 2cos(4θ) + sin⁵((2θ-π)/24)",
      rFunc: (theta: number) =>
        Math.exp(Math.sin(theta)) -
        2 * Math.cos(4 * theta) +
        Math.pow(Math.sin((2 * theta - PI) / 24), 5),
      thetaRange: [0, 12 * PI],
      tier: 4,
      distractorStrategies: ["frequency-shift", "param-tweak"],
      params: {},
    },
  ];
}

// ---------------------------------------------------------------------------
// 16. Cochleoid  (tier 4)  ~2 entries
// ---------------------------------------------------------------------------

function cochleoids(): CurveTemplate[] {
  const aValues = [1, 2];
  return aValues.map((a) => ({
    id: `cochleoid-${a}`,
    name: `Cochleoid a=${a}`,
    family: "cochleoid",
    expression: `r = ${a}sin(θ)/θ`,
    rFunc: ((aa: number) => (theta: number) =>
      (aa * Math.sin(theta)) / theta)(a),
    thetaRange: [0.01, SIX_PI] as [number, number],
    tier: 4 as Tier,
    distractorStrategies: ["param-tweak", "family-swap"] as DistractorStrategy[],
    params: { a },
  }));
}

// ---------------------------------------------------------------------------
// Assemble all curves
// ---------------------------------------------------------------------------

export const curves: CurveTemplate[] = [
  ...cardioids(),
  ...limaconsNoLoop(),
  ...limaconsWithLoop(),
  ...rosesOdd(),
  ...rosesEven(),
  ...rosesRational(),
  ...lemniscates(),
  ...archimedean(),
  ...logSpirals(),
  ...fermatSpirals(),
  ...hyperbolicSpirals(),
  ...conics(),
  ...compounds(),
  ...limaconRoseHybrids(),
  ...butterfly(),
  ...cochleoids(),
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

export function getCurvesByTier(tier: Tier): CurveTemplate[] {
  return curves.filter((c) => c.tier === tier);
}

export function getCurvesByFamily(family: string): CurveTemplate[] {
  return curves.filter((c) => c.family === family);
}
