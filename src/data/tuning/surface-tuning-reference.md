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

### How settings interact (cross-setting relationships)

Individual sliders don't act alone; several settings only make sense as a *relationship* between
two ends or two components. Directions below are real vehicle-dynamics and should hold if WF2 models
suspension load transfer at all — treat the **directions as reliable, magnitudes as untested** in an
arcade engine. Cited below (interaction sources).

- **Balance is the front-vs-rear difference, not absolute stiffness.** Understeer/oversteer is set
  by the *ratio* of front-to-rear roll stiffness, and springs + anti-roll bars pool into one number
  per axle. So you get the same balance shift two ways: **stiffen the rear _or_ soften the front**
  both add oversteer. Change one end at a time and think "front vs rear," not "stiffer overall."
- **Springs vs anti-roll bars — bars for balance, springs for bumps.** Both add roll stiffness to an
  axle, but a spring reacts to *every* wheel motion (bumps, dive, squat) while a bar reacts only when
  the two wheels on an axle move *differently* (pure roll). On loose/bumpy ground, carry cornering
  balance on the **bars** and keep **springs softer** so the car soaks ruts. Caveat: a very stiff bar
  ties the two wheels together, so a one-wheel bump upsets the whole axle — bars aren't a free lunch
  on rough surfaces.
- **Ride height pairs with spring rate.** Lower drops the centre of gravity, shrinking *all* weight
  transfer (a bigger grip win than limiting roll) — but it costs suspension travel, so it needs
  stiffer springs to avoid bottoming. On rough WF2 surfaces don't slam it: pick a moderate height
  that keeps travel for the ruts and match spring stiffness to it.
- **Brake balance shifts with weight transfer.** Braking throws weight forward, so a front-biased
  split is normal (50/50 locks the rears first). Anything that moves more load forward — a softer
  rear, a higher/raked car — dives more and effectively wants a touch **more front brake**. Rear
  steps out on the brakes → move balance forward; nose ploughs and fronts lock → move it rearward.
- **Camber and toe are front/rear splits too.** Balance comes from the relationship: more negative
  front camber than rear frees the nose (oversteer); more rear than front plants the tail. Rear
  toe-in stabilises the tail (exit understeer, calms a loose rear); rear toe-out frees it. Set
  balance with the **camber split first**, fine-tune with toe (toe scrubs speed, so keep it small).
- **Diff preload is the floor the ramps build on.** Preload is the always-on baseline lock; power
  (accel/exit) and coast (off-throttle/entry) ramp *beyond* it. They stack: more preload means more
  torque is needed to reach the ramp locks, so the diff is calmer, more locked, and slower to react
  everywhere (more understeer-y); less frees rotation but is twitchier. Set preload first, then the
  two ramps.
- **Gearing: final drive is the master multiplier, gears are the gaps.** Final drive scales every
  gear at once — set it so you just hit redline in top at the end of the longest straight — then
  space the individual gears so the ones you use most sit in the engine's strong rev band with tight
  gaps. It's the *product* (final × gear) that matters.
- **Rake (rear ride height higher than front) is an aero tool, and WF2 has no aero.** In the games
  rake is famous for, it works by tilting the floor and moving downforce balance — none of which
  exists here. Strip the aero away and only a **subtle** mechanical residue remains (a slight forward
  weight/CoG shift, a hair more front bite), which an arcade engine may barely model. **Don't chase
  rake as a balance knob in WF2** — treat front/rear ride height as a small CoG/weight-bias nudge and
  set balance with springs and bars instead.
- **Wedge (cross-weight) is a one-direction/oval tool — keep it ~50% otherwise.** It's a *diagonal*
  adjustment (raising one corner loads it and its diagonal opposite), so off-centre wedge just makes
  the car handle differently left vs right. Only worth moving on a dedicated one-way oval; on WF2's
  mostly bi-directional circuits, leave it neutral.

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

Cross-setting interactions (the "How settings interact" rules):

- **Olsen Motorsport — "Soft Does Not Equal Grip, Pt.3: Anti-Roll Bars"** — race-engineer blog; roll
  stiffness = springs + bars added, the spring/bar trade is really roll-vs-pitch, and a stiff bar
  ties the two wheels (the one-wheel-bump downside). <https://olsenmotorsport.com/blog/soft-does-not-equal-grip-part-3-anti-roll-bars/>
- **Suspension Secrets — "Roll Centre and Roll Moment"** — front/rear roll-stiffness distribution
  sets understeer/oversteer. <https://suspensionsecrets.co.uk/roll-centre-and-roll-moment/>
- **Suspension Setup — "Selecting Springs and Anti-Roll Bars, Pt.1"** — springs act on all motions,
  bars only in roll; the ride-height/spring pairing. <https://www.suspensionsetup.info/blog/selecting-springs-and-anti-roll-bars-part-1>
- **Engineer Fix — "What is Rake…"** — labels the mechanical CoG effect "subtle" and aero "the most
  pronounced"; the basis for the WF2 no-aero rake framing. <https://engineerfix.com/what-is-rake-on-a-car-and-how-does-it-affect-performance/>
- **You Suck At Racing — "Weight Transfer and Brake Bias"** — forward transfer under braking and how
  rear bias locks the rears first. <https://yousuckatracing.wordpress.com/2017/04/30/oversteer-overanalyzed-weight-transfer-brake-bias/>
- **Race & Track Driving — "Track Alignment"** and **Virtual Racing School — "Camber and Toe"** —
  front-vs-rear camber/toe split → balance. <https://racetrackdriving.com/car-setup/track-alignment/> ·
  <https://virtualracingschool.com/academy/iracing-career-guide/setups/camber-toe/>
- **Arnout Hoekstra — "The Real Meaning of Power, Coast and Preload"** — preload as the transition
  layer under the power/coast ramps. <https://arnouthoekstra.substack.com/p/the-real-meaning-of-power-coast-and>
- **Your Data Driven — "Choosing the Best Gear Ratios"** — final drive as universal multiplier vs
  individual ratios as spacing. <https://www.yourdatadriven.com/guide-to-choosing-the-best-gear-ratios-for-racing-cars/>
- **Speedway Motors — "Race Car Weight Distribution and Corner Balance"** — cross-weight is a
  diagonal adjustment, distinct from left/right, a circle-track variable. <https://www.speedwaymotors.com/the-toolbox/race-car-weight-distribution-and-how-to-corner-balance/134049>

_Last researched: July 2026. Real rally is defined for gravel/tarmac; Mud is our extrapolated
extreme-loose end (even softer/higher/more traction-biased than gravel — but avoid locking a diff
so hard it digs/plows in deep material)._
