import type { TuningGroup, TuningParam, Surface } from '../../components/tuning';

/**
 * The Wreckfest 2 tuning menu — categories, sliders, units, endpoint descriptors, ranges AND the
 * stock/default tune. All of this is the SAME for every car (confirmed in-game): the slider
 * ranges are universal, and so is the default tune. So the whole tuning dataset lives here once.
 *
 * A car's guide therefore captures NO tuning data — it only supplies our per-surface
 * recommendations and notes (keyed by slider `key`); the Baseline (stock tune) is inherited from
 * `default` here. See `buildGroups`. Captured from the in-game default / all-min / all-max passes
 * (see roadslayer.real.json).
 */
export interface TuningSpec {
  key: string;
  category: string;
  label: string;
  min?: string;
  max?: string;
  unit?: string;
  rangeMin: number;
  rangeMax: number;
  /** Universal stock/default value (same for every car). */
  default: number;
  valueLabels?: Record<number, string>;
}

export const TUNING_SCHEMA: { category: string; specs: TuningSpec[] }[] = [
  {
    category: 'Braking Force',
    specs: [
      { key: 'brake.balance', category: 'Braking Force', label: 'Balance', min: 'Rear', max: 'Front', unit: '%', rangeMin: 0, rangeMax: 100, default: 55 },
      { key: 'brake.pressure', category: 'Braking Force', label: 'Pressure', min: 'Low', max: 'High', unit: '%', rangeMin: 50, rangeMax: 150, default: 100 },
    ],
  },
  {
    category: 'Front Balancer',
    specs: [
      { key: 'frontBalancer', category: 'Front Balancer', label: 'Enabled', min: 'Off', max: 'On', rangeMin: 0, rangeMax: 1, default: 1, valueLabels: { 0: 'Off', 1: 'On' } },
    ],
  },
  {
    category: 'Differential — Rear',
    specs: [
      { key: 'diff.power', category: 'Differential — Rear', label: 'Power', min: 'Open', max: 'Locked', unit: '%', rangeMin: 0, rangeMax: 100, default: 70 },
      { key: 'diff.coast', category: 'Differential — Rear', label: 'Coast', min: 'Open', max: 'Locked', unit: '%', rangeMin: 0, rangeMax: 100, default: 60 },
      { key: 'diff.preload', category: 'Differential — Rear', label: 'Preload', min: 'Open', max: 'Locked', unit: 'Nm', rangeMin: 5, rangeMax: 150, default: 15 },
    ],
  },
  {
    category: 'Final Drive',
    specs: [
      { key: 'finalDrive', category: 'Final Drive', label: 'Final', min: 'Top speed', max: 'Acceleration', unit: '', rangeMin: 2.2, rangeMax: 6.1, default: 3.6 },
    ],
  },
  {
    category: 'Forward Gears',
    specs: [
      { key: 'gear.1', category: 'Forward Gears', label: '1st', min: 'Top speed', max: 'Acceleration', unit: '', rangeMin: 0.48, rangeMax: 6.0, default: 2.9 },
      { key: 'gear.2', category: 'Forward Gears', label: '2nd', min: 'Top speed', max: 'Acceleration', unit: '', rangeMin: 0.48, rangeMax: 6.0, default: 2.0 },
      { key: 'gear.3', category: 'Forward Gears', label: '3rd', min: 'Top speed', max: 'Acceleration', unit: '', rangeMin: 0.48, rangeMax: 6.0, default: 1.4 },
      { key: 'gear.4', category: 'Forward Gears', label: '4th', min: 'Top speed', max: 'Acceleration', unit: '', rangeMin: 0.48, rangeMax: 6.0, default: 1.1 },
      { key: 'gear.5', category: 'Forward Gears', label: '5th', min: 'Top speed', max: 'Acceleration', unit: '', rangeMin: 0.48, rangeMax: 6.0, default: 0.9 },
      { key: 'gear.6', category: 'Forward Gears', label: '6th', min: 'Top speed', max: 'Acceleration', unit: '', rangeMin: 0.48, rangeMax: 6.0, default: 0.75 },
    ],
  },
  {
    category: 'Springs',
    specs: [
      { key: 'springs.front', category: 'Springs', label: 'Front', min: 'Soft', max: 'Stiff', unit: 'N/mm', rangeMin: 11.2, rangeMax: 102.4, default: 61.0 },
      { key: 'springs.rear', category: 'Springs', label: 'Rear', min: 'Soft', max: 'Stiff', unit: 'N/mm', rangeMin: 11.2, rangeMax: 102.4, default: 31.0 },
    ],
  },
  {
    category: 'Ride Height',
    specs: [
      { key: 'rideHeight.front', category: 'Ride Height', label: 'Front', min: 'Low', max: 'High', unit: 'cm', rangeMin: 17.6, rangeMax: 28.6, default: 25.0 },
      { key: 'rideHeight.rear', category: 'Ride Height', label: 'Rear', min: 'Low', max: 'High', unit: 'cm', rangeMin: 17.6, rangeMax: 28.6, default: 27.5 },
    ],
  },
  {
    category: 'Anti-roll Bars',
    specs: [
      { key: 'arb.front', category: 'Anti-roll Bars', label: 'Front', min: 'Soft', max: 'Stiff', unit: 'N/mm', rangeMin: 0, rangeMax: 100, default: 60.0 },
      { key: 'arb.rear', category: 'Anti-roll Bars', label: 'Rear', min: 'Soft', max: 'Stiff', unit: 'N/mm', rangeMin: 0, rangeMax: 100, default: 60.0 },
    ],
  },
  {
    category: 'Camber',
    specs: [
      { key: 'camber.front', category: 'Camber', label: 'Front', min: 'Neg', max: 'Pos', unit: '°', rangeMin: -5.0, rangeMax: 2.0, default: -3.0 },
      { key: 'camber.rear', category: 'Camber', label: 'Rear', min: 'Neg', max: 'Pos', unit: '°', rangeMin: -5.0, rangeMax: 2.0, default: -2.0 },
    ],
  },
  {
    category: 'Toe',
    specs: [
      { key: 'toe.front', category: 'Toe', label: 'Front', min: 'Out', max: 'In', unit: '°', rangeMin: -2.0, rangeMax: 2.0, default: 0.03 },
      { key: 'toe.rear', category: 'Toe', label: 'Rear', min: 'Out', max: 'In', unit: '°', rangeMin: -2.0, rangeMax: 2.0, default: 0.2 },
    ],
  },
  {
    category: 'Ackermann',
    specs: [
      { key: 'ackermann', category: 'Ackermann', label: 'Ackermann', min: 'None', max: 'Full', unit: '%', rangeMin: 0, rangeMax: 100, default: 74 },
    ],
  },
  {
    category: 'Wedge',
    specs: [
      { key: 'wedge', category: 'Wedge', label: 'Oversteer Bias', min: 'Left', max: 'Right', unit: '%', rangeMin: -5, rangeMax: 5, default: 0 },
    ],
  },
  {
    category: 'Steering',
    specs: [
      { key: 'steering.lockToLock', category: 'Steering', label: 'Lock to Lock', min: 'Low', max: 'High', unit: '°', rangeMin: 675, rangeMax: 825, default: 750 },
      { key: 'steering.ratio', category: 'Steering', label: 'Steering Ratio', min: 'Low', max: 'High', unit: '', rangeMin: 10.8, rangeMax: 13.2, default: 12.0 },
    ],
  },
];

/**
 * A car's per-slider overrides: optional per-surface recommendations and a note. `base` is
 * inherited from the schema's universal stock default and only needs setting if a car ever
 * departs from stock as its baseline (rare).
 */
export interface CarValue {
  base?: number;
  surfaces?: Partial<Record<Surface, number>>;
  note?: string;
}

/**
 * Build the grouped params the widget renders: every slider from the shared schema, with `base`
 * taken from the universal stock default (overridable per car), plus any per-car surface
 * recommendations and notes keyed by slider `key`.
 */
export function buildGroups(values: Record<string, CarValue> = {}): TuningGroup[] {
  return TUNING_SCHEMA.map((group) => {
    const params: TuningParam[] = group.specs.map((s) => {
      const cv = values[s.key] ?? {};
      return {
        label: s.label,
        min: s.min,
        max: s.max,
        unit: s.unit,
        rangeMin: s.rangeMin,
        rangeMax: s.rangeMax,
        valueLabels: s.valueLabels,
        base: cv.base ?? s.default,
        surfaces: cv.surfaces,
        note: cv.note,
      };
    });
    return { category: group.category, params };
  });
}
