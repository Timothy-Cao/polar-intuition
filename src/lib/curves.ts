import type { CurveTemplate } from "@/types";

const PI = Math.PI;
const TWO_PI = 2 * PI;
const FOUR_PI = 4 * PI;
const SIX_PI = 6 * PI;
const EIGHT_PI = 8 * PI;

// ---------------------------------------------------------------------------
// ~70 visually unique polar curves — no two look alike.
// No rotations (sin vs cos), no reflections (+/-), no scale variants.
// ---------------------------------------------------------------------------

export const curves: CurveTemplate[] = [
  // ===== BASIC SHAPES =====
  {
    id: "circle",
    name: "Circle",
    expression: "r = 3",
    rFunc: () => 3,
    thetaRange: [0, TWO_PI],
  },
  {
    id: "cardioid",
    name: "Cardioid",
    expression: "r = 1 + cos θ",
    rFunc: (t) => 1 + Math.cos(t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "limacon-dimpled",
    name: "Limaçon (dimpled)",
    expression: "r = 3 + 2cos θ",
    rFunc: (t) => 3 + 2 * Math.cos(t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "limacon-convex",
    name: "Limaçon (convex)",
    expression: "r = 4 + cos θ",
    rFunc: (t) => 4 + Math.cos(t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "limacon-loop",
    name: "Limaçon (inner loop)",
    expression: "r = 1 + 2cos θ",
    rFunc: (t) => 1 + 2 * Math.cos(t),
    thetaRange: [0, TWO_PI],
  },

  // ===== ROSES — each has a different petal count =====
  {
    id: "rose-3",
    name: "3-petal rose",
    expression: "r = sin(3θ)",
    rFunc: (t) => Math.sin(3 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "rose-4",
    name: "4-petal rose",
    expression: "r = sin(2θ)",
    rFunc: (t) => Math.sin(2 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "rose-5",
    name: "5-petal rose",
    expression: "r = sin(5θ)",
    rFunc: (t) => Math.sin(5 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "rose-8",
    name: "8-petal rose",
    expression: "r = sin(4θ)",
    rFunc: (t) => Math.sin(4 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "rose-7",
    name: "7-petal rose",
    expression: "r = cos(7θ)",
    rFunc: (t) => Math.cos(7 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "rose-12",
    name: "12-petal rose",
    expression: "r = sin(6θ)",
    rFunc: (t) => Math.sin(6 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "rose-20",
    name: "20-petal rose",
    expression: "r = sin(10θ)",
    rFunc: (t) => Math.sin(10 * t),
    thetaRange: [0, TWO_PI],
  },

  // ===== ROSES — rational frequency (unique petal patterns) =====
  {
    id: "rose-rat-2-3",
    name: "Rose (2/3 freq)",
    expression: "r = cos(2/3 · θ)",
    rFunc: (t) => Math.cos((2 / 3) * t),
    thetaRange: [0, SIX_PI],
  },
  {
    id: "rose-rat-3-2",
    name: "Rose (3/2 freq)",
    expression: "r = cos(3/2 · θ)",
    rFunc: (t) => Math.cos((3 / 2) * t),
    thetaRange: [0, FOUR_PI],
  },
  {
    id: "rose-rat-5-3",
    name: "Rose (5/3 freq)",
    expression: "r = sin(5/3 · θ)",
    rFunc: (t) => Math.sin((5 / 3) * t),
    thetaRange: [0, SIX_PI],
  },
  {
    id: "rose-rat-4-3",
    name: "Rose (4/3 freq)",
    expression: "r = cos(4/3 · θ)",
    rFunc: (t) => Math.cos((4 / 3) * t),
    thetaRange: [0, SIX_PI],
  },
  {
    id: "rose-rat-3-4",
    name: "Rose (3/4 freq)",
    expression: "r = sin(3/4 · θ)",
    rFunc: (t) => Math.sin((3 / 4) * t),
    thetaRange: [0, EIGHT_PI],
  },
  {
    id: "rose-rat-5-2",
    name: "Rose (5/2 freq)",
    expression: "r = cos(5/2 · θ)",
    rFunc: (t) => Math.cos((5 / 2) * t),
    thetaRange: [0, FOUR_PI],
  },

  // ===== LEMNISCATE =====
  {
    id: "lemniscate",
    name: "Lemniscate",
    expression: "r² = 4cos(2θ)",
    rFunc: { rSquared: true, func: (t) => 4 * Math.cos(2 * t) },
    thetaRange: [0, TWO_PI],
  },

  // ===== SPIRALS =====
  {
    id: "archimedes",
    name: "Archimedean spiral",
    expression: "r = θ",
    rFunc: (t) => t,
    thetaRange: [0, SIX_PI],
  },
  {
    id: "log-spiral",
    name: "Logarithmic spiral",
    expression: "r = e^(0.1θ)",
    rFunc: (t) => Math.exp(0.1 * t),
    thetaRange: [0, SIX_PI],
  },
  {
    id: "fermat-spiral",
    name: "Fermat spiral",
    expression: "r² = 4θ",
    rFunc: { rSquared: true, func: (t) => 4 * t },
    thetaRange: [0, SIX_PI],
  },
  {
    id: "hyperbolic-spiral",
    name: "Hyperbolic spiral",
    expression: "r = 2/θ",
    rFunc: (t) => 2 / t,
    thetaRange: [0.1, SIX_PI],
  },

  // ===== CONICS =====
  {
    id: "conic-ellipse",
    name: "Ellipse (polar)",
    expression: "r = 2/(1 + 0.5cos θ)",
    rFunc: (t) => 2 / (1 + 0.5 * Math.cos(t)),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "conic-parabola",
    name: "Parabola (polar)",
    expression: "r = 2/(1 + cos θ)",
    rFunc: (t) => 2 / (1 + Math.cos(t)),
    thetaRange: [0.01, TWO_PI - 0.01],
  },
  {
    id: "conic-hyperbola",
    name: "Hyperbola (polar)",
    expression: "r = 2/(1 + 1.5cos θ)",
    rFunc: (t) => 2 / (1 + 1.5 * Math.cos(t)),
    thetaRange: [0, TWO_PI],
  },

  // ===== BUTTERFLY =====
  {
    id: "butterfly",
    name: "Butterfly curve",
    expression: "r = e^sin(θ) - 2cos(4θ) + sin⁵((2θ-π)/24)",
    rFunc: (t) =>
      Math.exp(Math.sin(t)) -
      2 * Math.cos(4 * t) +
      Math.pow(Math.sin((2 * t - PI) / 24), 5),
    thetaRange: [0, 12 * PI],
  },

  // ===== LIMAÇON-ROSE HYBRIDS =====
  {
    id: "hybrid-1-2-3",
    name: "Hybrid (1+2sin3θ)",
    expression: "r = 1 + 2sin(3θ)",
    rFunc: (t) => 1 + 2 * Math.sin(3 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "hybrid-1-2-4",
    name: "Hybrid (1+2sin4θ)",
    expression: "r = 1 + 2sin(4θ)",
    rFunc: (t) => 1 + 2 * Math.sin(4 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "hybrid-2-3-2",
    name: "Hybrid (2+3sin2θ)",
    expression: "r = 2 + 3sin(2θ)",
    rFunc: (t) => 2 + 3 * Math.sin(2 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "hybrid-1-1-5",
    name: "Hybrid (1+sin5θ)",
    expression: "r = 1 + sin(5θ)",
    rFunc: (t) => 1 + Math.sin(5 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "hybrid-2-1-4",
    name: "Hybrid (2+cos4θ)",
    expression: "r = 2 + cos(4θ)",
    rFunc: (t) => 2 + Math.cos(4 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "hybrid-3-2-3",
    name: "Hybrid (3+2cos3θ)",
    expression: "r = 3 + 2cos(3θ)",
    rFunc: (t) => 3 + 2 * Math.cos(3 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "hybrid-1-3-6",
    name: "Hybrid (1+3sin6θ)",
    expression: "r = 1 + 3sin(6θ)",
    rFunc: (t) => 1 + 3 * Math.sin(6 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "hybrid-2-2-5",
    name: "Hybrid (2+2cos5θ)",
    expression: "r = 2 + 2cos(5θ)",
    rFunc: (t) => 2 + 2 * Math.cos(5 * t),
    thetaRange: [0, TWO_PI],
  },

  // ===== COMPOUND ADDITIVE =====
  {
    id: "compound-cos2-sin3",
    name: "cos2θ + sin3θ",
    expression: "r = cos(2θ) + sin(3θ)",
    rFunc: (t) => Math.cos(2 * t) + Math.sin(3 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "compound-cos3-sin5",
    name: "cos3θ + sin5θ",
    expression: "r = cos(3θ) + sin(5θ)",
    rFunc: (t) => Math.cos(3 * t) + Math.sin(5 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "compound-cos1-sin2",
    name: "cosθ + sin2θ",
    expression: "r = cos θ + sin(2θ)",
    rFunc: (t) => Math.cos(t) + Math.sin(2 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "compound-2cos1-cos3",
    name: "2cosθ + cos3θ",
    expression: "r = 2cos θ + cos(3θ)",
    rFunc: (t) => 2 * Math.cos(t) + Math.cos(3 * t),
    thetaRange: [0, TWO_PI],
  },

  // ===== PRODUCT CURVES =====
  {
    id: "product-cos1-cos2",
    name: "cosθ · cos2θ",
    expression: "r = cos θ · cos(2θ)",
    rFunc: (t) => Math.cos(t) * Math.cos(2 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "product-sin1-sin3",
    name: "sinθ · sin3θ",
    expression: "r = sin θ · sin(3θ)",
    rFunc: (t) => Math.sin(t) * Math.sin(3 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "product-sin2-cos3",
    name: "sin2θ · cos3θ",
    expression: "r = sin(2θ) · cos(3θ)",
    rFunc: (t) => Math.sin(2 * t) * Math.cos(3 * t),
    thetaRange: [0, TWO_PI],
  },

  // ===== MULTI-FREQUENCY =====
  {
    id: "triple-sin123",
    name: "sinθ + sin2θ + sin3θ",
    expression: "r = sin θ + sin(2θ) + sin(3θ)",
    rFunc: (t) => Math.sin(t) + Math.sin(2 * t) + Math.sin(3 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "multi-cos135",
    name: "cosθ + cos3θ + cos5θ",
    expression: "r = cos θ + cos(3θ) + cos(5θ)",
    rFunc: (t) => Math.cos(t) + Math.cos(3 * t) + Math.cos(5 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "multi-offset",
    name: "1 + cosθ + sin3θ + cos5θ",
    expression: "r = 1 + cos θ + sin(3θ) + cos(5θ)",
    rFunc: (t) => 1 + Math.cos(t) + Math.sin(3 * t) + Math.cos(5 * t),
    thetaRange: [0, TWO_PI],
  },

  // ===== SPECIAL / CLASSIC =====
  {
    id: "cochleoid",
    name: "Cochleoid",
    expression: "r = sin θ/θ",
    rFunc: (t) => Math.sin(t) / t,
    thetaRange: [0.01, SIX_PI],
  },
  {
    id: "half-freq-rose",
    name: "Half-frequency rose",
    expression: "r = sin(θ/2)",
    rFunc: (t) => Math.sin(t / 2),
    thetaRange: [0, FOUR_PI],
  },
  {
    id: "third-freq-rose",
    name: "Third-frequency rose",
    expression: "r = cos(θ/3)",
    rFunc: (t) => Math.cos(t / 3),
    thetaRange: [0, SIX_PI],
  },

  // ===== EXOTIC / DISTINCT SHAPES =====
  {
    id: "heart",
    name: "Heart curve",
    expression: "r = 2 - 2sin θ + sin θ · √|cos θ|/(sin θ + 1.4)",
    rFunc: (t) =>
      2 - 2 * Math.sin(t) +
      (Math.sin(t) * Math.sqrt(Math.abs(Math.cos(t)))) / (Math.sin(t) + 1.4),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "peanut",
    name: "Peanut curve",
    expression: "r² = cos(2θ) + 2",
    rFunc: { rSquared: true, func: (t) => Math.cos(2 * t) + 2 },
    thetaRange: [0, TWO_PI],
  },
  {
    id: "wavy-circle",
    name: "Wavy circle",
    expression: "r = 3 + sin(8θ)",
    rFunc: (t) => 3 + Math.sin(8 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "gear",
    name: "Gear",
    expression: "r = 3 + 0.5cos(16θ)",
    rFunc: (t) => 3 + 0.5 * Math.cos(16 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "nautilus",
    name: "Nautilus",
    expression: "r = e^(0.15θ) · |sin(2θ)|",
    rFunc: (t) => Math.exp(0.15 * t) * Math.abs(Math.sin(2 * t)),
    thetaRange: [0, FOUR_PI],
  },
  {
    id: "starburst",
    name: "Starburst",
    expression: "r = 2 + cos(6θ) · sin(3θ)",
    rFunc: (t) => 2 + Math.cos(6 * t) * Math.sin(3 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "clover",
    name: "Clover",
    expression: "r = sin²(2θ) + cos(4θ)",
    rFunc: (t) => Math.sin(2 * t) ** 2 + Math.cos(4 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "sunflower",
    name: "Sunflower",
    expression: "r = 4 + 2sin(12θ)",
    rFunc: (t) => 4 + 2 * Math.sin(12 * t),
    thetaRange: [0, TWO_PI],
  },

  // ===== NEW: POWER / SQUARED VARIANTS =====
  {
    id: "sin-squared",
    name: "sin²θ",
    expression: "r = sin²(θ)",
    rFunc: (t) => Math.sin(t) ** 2,
    thetaRange: [0, TWO_PI],
  },
  {
    id: "sin-cubed-2",
    name: "sin³(2θ)",
    expression: "r = sin³(2θ)",
    rFunc: (t) => Math.sin(2 * t) ** 3,
    thetaRange: [0, TWO_PI],
  },
  {
    id: "cos-fourth",
    name: "cos⁴θ",
    expression: "r = cos⁴(θ)",
    rFunc: (t) => Math.cos(t) ** 4,
    thetaRange: [0, TWO_PI],
  },

  // ===== NEW: ABSOLUTE VALUE (fills gaps, no negative r) =====
  {
    id: "abs-sin3",
    name: "|sin3θ| (6 bumps)",
    expression: "r = |sin(3θ)|",
    rFunc: (t) => Math.abs(Math.sin(3 * t)),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "abs-cos2",
    name: "|cos2θ| (4 bumps)",
    expression: "r = |cos(2θ)|",
    rFunc: (t) => Math.abs(Math.cos(2 * t)),
    thetaRange: [0, TWO_PI],
  },

  // ===== NEW: RECIPROCAL / RATIONAL =====
  {
    id: "pinched-oval",
    name: "Pinched oval",
    expression: "r = 1/(1 + sin²(θ))",
    rFunc: (t) => 1 / (1 + Math.sin(t) ** 2),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "bounded-spiral",
    name: "Bounded spiral",
    expression: "r = θ/(1 + θ)",
    rFunc: (t) => t / (1 + t),
    thetaRange: [0, SIX_PI],
  },
  {
    id: "three-lobe-conic",
    name: "3-lobed conic",
    expression: "r = 1/(1 + 0.5cos(3θ))",
    rFunc: (t) => 1 / (1 + 0.5 * Math.cos(3 * t)),
    thetaRange: [0, TWO_PI],
  },

  // ===== NEW: EXPONENTIAL DECAY =====
  {
    id: "decaying-flower",
    name: "Decaying flower",
    expression: "r = e^(-θ/4) · (1 + cos(3θ))",
    rFunc: (t) => Math.exp(-t / 4) * (1 + Math.cos(3 * t)),
    thetaRange: [0, FOUR_PI],
  },
  {
    id: "gaussian-blob",
    name: "Gaussian blob",
    expression: "r = e^(-θ²)",
    rFunc: (t) => Math.exp(-(t * t)),
    thetaRange: [-2, 2],
  },

  // ===== NEW: ANGULAR / BUMPY =====
  {
    id: "bumpy-circle",
    name: "Bumpy circle",
    expression: "r = 2 + cos θ + |cos(3θ)|",
    rFunc: (t) => 2 + Math.cos(t) + Math.abs(Math.cos(3 * t)),
    thetaRange: [0, TWO_PI],
  },

  // ===== NEW: CLASSIC NAMED CURVES =====
  {
    id: "folium",
    name: "Folium",
    expression: "r = cos θ · sin²(θ)",
    rFunc: (t) => Math.cos(t) * Math.sin(t) ** 2,
    thetaRange: [0, TWO_PI],
  },
  {
    id: "bifolium",
    name: "Bifolium",
    expression: "r = sin θ · cos²(θ)",
    rFunc: (t) => Math.sin(t) * Math.cos(t) ** 2,
    thetaRange: [0, TWO_PI],
  },
  {
    id: "hippopede",
    name: "Hippopede",
    expression: "r² = 4(1 - sin²(θ)/2)",
    rFunc: { rSquared: true, func: (t) => 4 * (1 - Math.sin(t) ** 2 / 2) },
    thetaRange: [0, TWO_PI],
  },

  // ===== NEW: OFFSET / MODULATED =====
  {
    id: "flattened-circle",
    name: "Flattened circle",
    expression: "r = 3 + cos²(θ)",
    rFunc: (t) => 3 + Math.cos(t) ** 2,
    thetaRange: [0, TWO_PI],
  },
  {
    id: "wobble-spiral",
    name: "Wobble spiral",
    expression: "r = 1 + θ · sin θ/(2π)",
    rFunc: (t) => 1 + (t * Math.sin(t)) / (2 * PI),
    thetaRange: [0, SIX_PI],
  },
  {
    id: "interference",
    name: "Interference pattern",
    expression: "r = 2 + sin(3θ) · cos(5θ)",
    rFunc: (t) => 2 + Math.sin(3 * t) * Math.cos(5 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "square-wave-approx",
    name: "Square wave approx",
    expression: "r = sin θ + sin(3θ)/3 + sin(5θ)/5",
    rFunc: (t) => Math.sin(t) + Math.sin(3 * t) / 3 + Math.sin(5 * t) / 5,
    thetaRange: [0, TWO_PI],
  },
  {
    id: "triple-product-offset",
    name: "Triple product offset",
    expression: "r = 2 + cos θ · cos(2θ) · cos(3θ)",
    rFunc: (t) => 2 + Math.cos(t) * Math.cos(2 * t) * Math.cos(3 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "butterfly-variant",
    name: "Butterfly variant",
    expression: "r = e^cos(θ) - 2cos(4θ)",
    rFunc: (t) => Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t),
    thetaRange: [0, TWO_PI],
  },
  {
    id: "rich-interference",
    name: "Rich interference",
    expression: "r = sin(2θ) + sin(3θ)/2 + cos(5θ)/3",
    rFunc: (t) => Math.sin(2 * t) + Math.sin(3 * t) / 2 + Math.cos(5 * t) / 3,
    thetaRange: [0, TWO_PI],
  },
];

// ---------------------------------------------------------------------------
// Utility: get all curves (flat pool)
// ---------------------------------------------------------------------------

export function getAllCurves(): CurveTemplate[] {
  return curves;
}
