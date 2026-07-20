/**
 * Shared shape for a guide's tuning data. Each guide defines one setup; the baseline tab and
 * the per-surface delta bars both derive from it, so the numbers live in one place.
 *
 * Two modes, same type:
 *  - Real-data car guides (e.g. RoadSlayer): `unit` + numeric `rangeMin`/`rangeMax`, and
 *    `base`/surface values in real game units. Bars position by the true range.
 *  - Generic drivetrain guides: no unit, `base` is a 0–100 position along the slider's travel
 *    (rangeMin/rangeMax default to 0/100).
 */
export type Surface = 'mud' | 'gravel' | 'asphalt';

export interface TuningParam {
  /** Slider name, e.g. "Front", "Balance", "Power". */
  label: string;
  /** Left-end descriptor, e.g. "Soft". */
  min?: string;
  /** Right-end descriptor, e.g. "Stiff". */
  max?: string;
  /** Real unit, e.g. "N/mm", "°", "%", "cm", "Nm". Empty/undefined for ratios and generics. */
  unit?: string;
  /** Numeric slider minimum (default 0). */
  rangeMin?: number;
  /** Numeric slider maximum (default 100). */
  rangeMax?: number;
  /** Stock/default value in real units (or 0–100 position for generic guides). */
  base: number;
  /** Per-surface recommended values (real units). Params with none render at baseline (±0). */
  surfaces?: Partial<Record<Surface, number>>;
  /** Optional note shown on the baseline row. */
  note?: string;
  /** Map numeric values to display labels (e.g. two-state toggles: {0:'Off',1:'On'}). */
  valueLabels?: Record<number, string>;
}

export interface TuningGroup {
  /** Category header shown above the group's rows (omit for an unlabelled group). */
  category?: string;
  params: TuningParam[];
}

export interface TuningSetup {
  caption?: string;
  /** Flat list (generic guides). */
  params?: TuningParam[];
  /** Grouped by category (real-data car guides). */
  groups?: TuningGroup[];
}

const rmin = (p: TuningParam) => p.rangeMin ?? 0;
const rmax = (p: TuningParam) => p.rangeMax ?? 100;

/** Position (0–100) of a value along the slider's travel. */
export function positionOf(p: TuningParam, value: number): number {
  const lo = rmin(p);
  const hi = rmax(p);
  if (hi === lo) return 0;
  return Math.max(0, Math.min(100, ((value - lo) / (hi - lo)) * 100));
}

function decimalsFor(unit?: string): number {
  if (unit === undefined) return 0; // generic 0–100 position (no unit set)
  switch (unit) {
    case '%':
    case 'Nm':
      return 0;
    case 'N/mm':
    case 'cm':
      return 1;
    default:
      return 2; // degrees and ratios (unit '°' or '')
  }
}

/** Format a value for display, e.g. `61.0 N/mm`, `-3.00°`, `12.0`, or a value label. */
export function formatValue(p: TuningParam, value: number): string {
  if (p.valueLabels && p.valueLabels[value] !== undefined) return p.valueLabels[value];
  const n = value.toFixed(decimalsFor(p.unit));
  if (!p.unit) return n;
  return p.unit === '°' ? `${n}${p.unit}` : `${n} ${p.unit}`;
}

/** Format a delta from baseline, e.g. `+14 N/mm`, `−0.50°`, `±0`, or the new value label. */
export function formatDelta(p: TuningParam, delta: number, newValue: number): string {
  if (delta === 0) return '±0';
  if (p.valueLabels) return p.valueLabels[newValue] ?? String(newValue);
  const sign = delta > 0 ? '+' : '−';
  const n = Math.abs(delta).toFixed(decimalsFor(p.unit));
  if (!p.unit) return `${sign}${n}`;
  return p.unit === '°' ? `${sign}${n}${p.unit}` : `${sign}${n} ${p.unit}`;
}

/** Round a value to its slider's display precision. */
export function roundFor(value: number, unit?: string): number {
  const f = Math.pow(10, decimalsFor(unit));
  return Math.round(value * f) / f;
}

/**
 * The all-round "hybrid" value: a weighted mean of the surface recommendations that leans toward
 * gravel (the most common surface), rounded to the slider's unit — or the base value when the
 * slider has no surface variation. This is the anchor the surface tabs show their deltas against.
 */
const HYBRID_WEIGHTS = { mud: 1, gravel: 2, asphalt: 1 } as const;

export function hybridValue(p: TuningParam): number {
  const s = p.surfaces;
  if (!s) return p.base;
  let sum = 0;
  let weight = 0;
  for (const surface of ['mud', 'gravel', 'asphalt'] as const) {
    const v = s[surface];
    if (v !== undefined) {
      sum += v * HYBRID_WEIGHTS[surface];
      weight += HYBRID_WEIGHTS[surface];
    }
  }
  if (weight === 0) return p.base;
  return roundFor(sum / weight, p.unit);
}

/** Normalise a setup into groups (a flat params list becomes one unlabelled group). */
export function toGroups(setup: { params?: TuningParam[]; groups?: TuningGroup[] }): TuningGroup[] {
  if (setup.groups) return setup.groups;
  if (setup.params) return [{ params: setup.params }];
  return [];
}
