# Unique Polar Curves Library & Random Quiz Selection

**Date:** 2026-04-01
**Status:** Approved

## Problem

The current 100-curve library contains ~30-40% visual duplicates: rotations (`sin` vs `cos`), reflections (`+` vs `-`), and scale variants (`sin(3θ)` vs `2sin(3θ)`). The quiz distractor system uses complex similarity-based generation that is no longer needed if all curves are visually distinct.

## Goals

1. Curate a library of ~70 visually unique polar curves where no two look alike (no rotations, reflections, or scale variants)
2. Simplify quiz to pure random selection from the full pool
3. Remove the distractor generation system

## Deduplication Rules

- **One trig variant per shape**: Keep `cos` version, drop `sin`/`-cos`/`-sin` rotations
- **One scale per shape**: Keep one amplitude, drop scaled copies
- **One eccentricity per conic type**: One ellipse, one parabola, one hyperbola

## Curve Library (~70 curves)

### Kept from Current Library (~45)

**Basic shapes (5)**
- Circle: `r = 3`
- Cardioid: `r = 1 + cos(θ)`
- Limaçon dimpled: `r = 3 + 2cos(θ)`
- Limaçon convex: `r = 4 + cos(θ)`
- Limaçon with loop: `r = 1 + 2cos(θ)`

**Roses - integer petals (7)**
- `r = sin(2θ)` (4 petals)
- `r = sin(3θ)` (3 petals)
- `r = sin(4θ)` (8 petals)
- `r = sin(5θ)` (5 petals)
- `r = sin(6θ)` (12 petals)
- `r = sin(8θ)` (16 petals)
- `r = sin(10θ)` (20 petals)

**Roses - rational frequency (6)**
- `r = cos(2θ/3)`, `r = cos(3θ/2)`, `r = sin(5θ/3)`
- `r = cos(4θ/3)`, `r = sin(3θ/4)`, `r = cos(5θ/2)`

**Lemniscate (1)**
- `r² = 4cos(2θ)`

**Spirals (4)**
- Archimedean: `r = θ`
- Logarithmic: `r = e^(0.1θ)`
- Fermat: `r² = 4θ`
- Hyperbolic: `r = 2/θ`

**Conics (3)**
- Ellipse: `r = 2/(1 + 0.5cos(θ))`
- Parabola: `r = 2/(1 + cos(θ))`
- Hyperbola: `r = 2/(1 + 1.5cos(θ))`

**Butterfly (1)**
- `r = e^sin(θ) - 2cos(4θ) + sin⁵((2θ-π)/24)`

**Hybrids (8)**
- `r = 1 + 2sin(3θ)`, `r = 1 + 2sin(4θ)`, `r = 2 + 3sin(2θ)`
- `r = 1 + sin(5θ)`, `r = 2 + cos(4θ)`, `r = 3 + 2cos(3θ)`
- `r = 1 + 3sin(6θ)`, `r = 2 + 2cos(5θ)`

**Compound additive (4)**
- `r = cos(2θ) + sin(3θ)`, `r = cos(3θ) + sin(5θ)`
- `r = cos(θ) + sin(2θ)`, `r = 2cos(θ) + cos(3θ)`

**Product (3)**
- `r = cos(θ)·cos(2θ)`, `r = sin(θ)·sin(3θ)`, `r = sin(2θ)·cos(3θ)`

**Multi-frequency (3)**
- `r = sin(θ) + sin(2θ) + sin(3θ)`
- `r = cos(θ) + cos(3θ) + cos(5θ)`
- `r = 1 + cos(θ) + sin(3θ) + cos(5θ)`

**Special (3)**
- Cochleoid: `r = sin(θ)/θ`
- Half-freq rose: `r = sin(θ/2)`
- Third-freq rose: `r = cos(θ/3)`

**Exotic (keep ~8 most distinct)**
- Heart: `r = 2 - 2sin(θ) + sin(θ)√|cos(θ)|/(sin(θ)+1.4)`
- Peanut: `r² = cos(2θ) + 2`
- Wavy circle: `r = 3 + sin(8θ)`
- Gear: `r = 3 + 0.5cos(16θ)`
- Nautilus: `r = e^(0.15θ)·|sin(2θ)|`
- Star-burst: `r = 2 + cos(6θ)·sin(3θ)`
- Clover: `r = sin²(2θ) + cos(4θ)`
- Sunflower: `r = 4 + 2sin(12θ)`

### New Unique Curves (~25)

**Power variants**
- `r = sin²(θ)` — rounded diamond
- `r = sin³(2θ)` — sharper 4-petal
- `r = cos⁴(θ)` — narrow lobe

**Absolute value**
- `r = |sin(3θ)|` — 6 bumps (no negative)
- `r = |cos(2θ)|` — 4 bumps

**Reciprocal/rational**
- `r = 1/(1 + sin²(θ))` — pinched oval
- `r = 1/√(1 + cos²(θ))` — rounded square-ish
- `r = θ/(1 + θ)` — bounded spiral (approaches 1)

**New products**
- `r = sin(θ)·cos(θ)·sin(2θ)` — 8-fold symmetry
- `r = cos²(θ) - sin(2θ)` — asymmetric blob

**Exponential decay**
- `r = e^(-θ/4)·(1 + cos(3θ))` — decaying flower
- `r = e^(-θ²)` — Gaussian blob (θ in [-2, 2])

**Angular/bumpy**
- `r = 2 + cos(θ) + |cos(3θ)|` — bumpy circle
- `r = sin(θ) + |sin(5θ)|/2` — spiky half

**Classic named curves**
- Folium: `r = cos(θ)·sin²(θ)` — single teardrop
- Bifolium: `r = sin(θ)·cos²(θ)` — two-leaf clover
- Hippopede: `r² = 4(1 - sin²(θ)/2)` — oval/figure-8 hybrid

**Offset/modulated**
- `r = 3 + cos²(θ)` — slightly flattened circle
- `r = 1 + θ·sin(θ)/(2π)` — growing wobble spiral (θ ∈ [0, 6π])
- `r = 2 + sin(3θ)·cos(5θ)` — complex interference
- `r = sin(θ) + sin(3θ)/3 + sin(5θ)/5` — square wave approximation
- `r = 2 + cos(θ)·cos(2θ)·cos(3θ)` — triple product offset
- `r = e^cos(θ) - 2cos(4θ)` — butterfly variant
- `r = 1/(1 + 0.5cos(3θ))` — 3-lobed conic
- `r = sin(2θ) + sin(3θ)/2 + cos(5θ)/3` — rich interference

## Quiz Selection

Replace current distractor-based system with pure random:

```
generateQuestion():
  1. Pick 1 random curve from full pool → correct answer
  2. Pick 3 more random curves (no repeats, no recent repeats) → wrong answers
  3. Shuffle all 4
  4. Return question
```

No similarity checking needed — every curve is visually distinct by design.

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `src/lib/curves.ts` | Rewrite | Replace entire library with ~70 unique curves |
| `src/lib/quizEngine.ts` | Simplify | Pure random selection, remove tier logic |
| `src/lib/distractors.ts` | Delete | No longer needed |
| `src/lib/polarRenderer.ts` | Minor update | Handle abs(), bounded ranges for new curve types |
| `src/types/index.ts` | Simplify | Remove tier-related types |
