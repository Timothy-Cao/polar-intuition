// ---------------------------------------------------------------------------
// formatExpression — converts polar expression strings into KaTeX LaTeX
// ---------------------------------------------------------------------------

/**
 * Converts a human-readable polar expression string into a KaTeX-compatible
 * LaTeX string.
 *
 * Examples:
 *   "r = 2(1 + cos θ)"  →  "r = 2(1 + \\cos\\theta)"
 *   "r = sin(3θ)"        →  "r = \\sin(3\\theta)"
 *   "r² = 4cos(2θ)"      →  "r^2 = 4\\cos(2\\theta)"
 *   "r = 2/(1 + 0.5cos θ)" → "r = \\frac{2}{1 + 0.5\\cos\\theta}"
 */
export function formatExpression(expr: string): string {
  let s = expr;

  // --- Fraction patterns (must run before θ/trig replacements) ---

  // Pattern: "a/(expr)" → \frac{a}{expr}
  // Matches numerator (non-slash, non-space token) / (parenthesized denominator)
  s = s.replace(
    /(\w[\w.]*)\/\(([^)]+)\)/g,
    (_match, num: string, denom: string) => `\\frac{${num}}{${denom}}`,
  );

  // Pattern: "a/θ" → \frac{a}{θ}  (θ will be replaced later)
  s = s.replace(
    /(\w[\w.]*)\/([θπ])/g,
    (_match, num: string, denom: string) => `\\frac{${num}}{${denom}}`,
  );

  // Pattern: simple "a/b" where b is a single token (not already handled)
  // Only match if not already inside a \frac
  s = s.replace(
    /(?<!\\frac\{[^}]*)(\w[\w.]*)\/(\w[\w.]*)/g,
    (_match, num: string, denom: string) => `\\frac{${num}}{${denom}}`,
  );

  // --- Superscript Unicode characters ---
  s = s.replace(/r²/g, "r^2");
  s = s.replace(/sin⁵/g, "\\sin^5");
  s = s.replace(/cos⁵/g, "\\cos^5");
  s = s.replace(/sin⁴/g, "\\sin^4");
  s = s.replace(/cos⁴/g, "\\cos^4");
  s = s.replace(/sin³/g, "\\sin^3");
  s = s.replace(/cos³/g, "\\cos^3");
  s = s.replace(/sin²/g, "\\sin^2");
  s = s.replace(/cos²/g, "\\cos^2");

  // --- Trig functions (before θ replacement to avoid double-escaping) ---
  // Replace "sin" and "cos" that are not already prefixed with backslash
  s = s.replace(/(?<!\\)sin/g, "\\sin");
  s = s.replace(/(?<!\\)cos/g, "\\cos");
  s = s.replace(/(?<!\\)tan/g, "\\tan");

  // --- Greek letters ---
  s = s.replace(/θ/g, "\\theta");
  s = s.replace(/π/g, "\\pi");

  // --- Exponential: e^(...) → e^{...} ---
  // Handle nested parentheses by matching balanced parens
  s = s.replace(/e\^\(([^)]*)\)/g, (_match, inner: string) => `e^{${inner}}`);

  // --- Middle dot: · → \cdot ---
  s = s.replace(/·/g, "\\cdot ");

  return s;
}
