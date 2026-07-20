# Surface Tuning Reference — Source of Truth

Real-world and sim-racing consensus on **how a car setup should change across surfaces**. This is
the reference the Wreckfest 2 guides' per-surface recommendations are checked against, so our
advice stays grounded rather than guessed.

**Scope & caveat.** Motorsport tuning is defined for **gravel vs. tarmac** (plus snow/ice). We map
that onto Wreckfest's three surfaces — treat **Mud** as the extreme-loose end (looser/softer than
gravel), **Gravel** as the loose middle, and **Asphalt** as tarmac. Wreckfest 2 is arcade physics,
so these are the *default directions to trust*, not laws — validate a change in-game before
trusting it over the reference. Directions below run **loose → grippy** (Mud → Gravel → Asphalt).

## The grip ladder

`Mud (lowest grip, softest, roughest)  <  Gravel  <  Asphalt (highest grip, smooth)`

More grip lets you run a stiffer, lower, more aggressive car and brake/accelerate harder. Less grip
demands compliance, ride height, and traction aids, and rewards technique over aggression.

## Category directions

| Category | Loose (Mud / Gravel) | Grippy (Asphalt) | Why |
|---|---|---|---|
| **Differential — Power (accel lock)** | More locked | More open | Low grip: lock both wheels so power goes down instead of spinning the inside wheel. High grip: open lets the wheels turn at different speeds for turn-in; a very locked power ramp snaps/understeers on grip. |
| **Differential — Coast (decel lock)** | Some lock | Less | On loose, coast lock stabilises the car under braking/lift and stops the rears locking. Too much locked coast on tarmac = understeer while decelerating. |
| **Differential — Preload** | Higher | Lower | Preload keeps the diff from ever fully opening → mid-corner traction and stability on loose. Too much on tarmac induces understeer. |
| **Springs** | Softer | Stiffer | Soft absorbs bumps and keeps tyres loaded on rough/loose ground; stiff maximises response and uses the grip on smooth tarmac. |
| **Ride height** | Higher | Lower | High clears ruts and transfers weight to push the tyre through the loose layer to the hard base; low drops the centre of gravity for tarmac stability. |
| **Anti-roll bars** | Softer | Firmer | Soft bars = compliance and mechanical grip over bumps; firm bars = less roll and sharper response on grip. (Balance rule below.) |
| **Dampers** | Softer / slower | Firmer | Absorb bumps and keep contact on loose; control a stiff, low tarmac car. *(Lower-confidence, general principle.)* |
| **Camber (negative)** | Less negative | More negative | Loose: cornering loads are low, so prioritise a flat contact patch for accel/braking. Tarmac: high sustained cornering load rewards aggressive negative camber. |
| **Toe** | Slight toe-in | Near neutral | A little toe-in adds straight-line/stability on loose; keep it small — toe is drag. |
| **Brakes — pressure** | Lower | Higher | Low grip locks the wheels easily, so back pressure off; high grip lets you brake harder. |
| **Brakes — bias** | Slightly forward (stability) | Slightly more forward | A little front bias keeps the car stable (front lock is detectable and safe); weight transfers further forward under harder tarmac braking. |
| **Gearing / final drive** | Shorter (acceleration) | Longer (top speed) | Loose/technical stages live in the low/mid range; fast tarmac rewards taller gearing for straight-line speed. |
| **Steering (lock, ratio)** | More lock / faster | Less | Loose driving uses bigger counter-steer angles for slides; mostly preference and not strongly lap-time critical. |

### Balance rules (surface-independent)

- **Stiffer end loses grip.** A stiffer spring/bar on one axle reduces that axle's grip. Stiffer
  rear → oversteer; stiffer front → understeer. Use this to trim balance on any surface.
- **Diff by axle:** a tight rear diff adds oversteer, a tight front diff adds understeer, a tight
  centre (AWD) generally adds understeer.
- **Traction on loose comes from technique, not an open diff** — weight transfer, trail/left-foot
  braking, the loose surface itself. Keep the diff locked for drive and steer it with your feet.

## How this maps to the Wreckfest 2 guides

Our surface tabs (Mud / Gravel / Asphalt) should move each slider in the direction above. As of
this reference:

- ✅ **Match:** Springs, Ride height, Anti-roll bars, Brake pressure, Gearing, Camber all already
  run soft/high/less-brake on loose → stiff/low/more on grip.
- ✅ **Differential (fixed):** now runs **more locked on Mud, more open on Asphalt** — Power, Coast,
  and Preload all decrease Mud → Asphalt across all five guides, matching real rally practice (lock
  on loose for traction, open on tarmac for turn-in and to tame exit snap).
- **Brake bias:** minor — keep a slight, fairly constant front bias rather than swinging it far.

## Notable sources

Ordered roughly most-authoritative first.

- **DirtFish Rally School — "How to set up a rally car for gravel and asphalt"** — professional
  rally school; the clearest per-category gravel-vs-tarmac breakdown (suspension, ride height,
  alignment, gearing, tyres). <https://dirtfish.com/learn/how-to/how-to-set-up-a-rally-car-for-gravel-and-asphalt/>
- **Suspension Secrets — "WRC & Rally Set Up"** — motorsport suspension engineering.
  <https://suspensionsecrets.co.uk/wrc-rally/>
- **HP Academy — "Effect of Differential settings on setup"** — engineering-education forum;
  detail on power/coast/preload and gravel-vs-tarmac locking. <https://www.hpacademy.com/forum/suspension-tuning-and-optimization/show/effect-of-differential-settings-on-setup/>
- **RallySport Ontario — "Diffs"** — real rally LSD primer.
  <http://www.oldrallysport.on.ca/articles/diffs.html>
- **RallyGamer — Rally School Car Setup Guide** — springs/ARB/diff direction summary.
  <https://www.rallygamer.com/rallyschool/car-setup-guide>
- **Special Stage Forums — "Alignment settings for tarmac"** — camber/toe gravel-vs-tarmac
  consensus from competitors. <https://www.specialstage.com/threads/alignment-settings-for-tarmac.23339/>
- **opensourcesetups — "Dirt Rally 2.0 Car Baseline Setup"** — surface-specific baselines
  (springs, ride height, final drive, ARB numbers). <https://opensourcesetups.x10.mx/wp/dirt-rally-2-0-car-baseline-setup/>
- **Steam Community — "Dirt Rally Vehicle Tuning: Basic and Advanced Techniques"** — detailed
  per-slider surface tuning. <https://steamcommunity.com/sharedfiles/filedetails/?id=662087628>
- **Steam Community — "Ultimate Setup Guide for Racing Simulation"** — cross-sim tuning reference.
  <https://steamcommunity.com/sharedfiles/filedetails/?id=2028926468>
- **SimRacingCockpit — "Using Brake Bias for Faster Laptimes"** and **BoxThisLap —
  "Understanding Brake Bias"** — brake-bias fundamentals and diagnosis.
  <https://simracingcockpit.gg/using-brake-bias-in-the-sim-for-faster-laptimes/> ·
  <https://boxthislap.org/understanding-brake-bias/>

_Last researched: July 2026. Real rally is defined for gravel/tarmac; Mud is our extrapolated
extreme-loose end (even softer/higher/more traction-biased than gravel — but avoid locking a diff
so hard it digs/plows in deep material)._
