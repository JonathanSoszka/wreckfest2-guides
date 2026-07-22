# Rally Reference — Source of Truth

Real-world rally and rallycross consensus on **technique, surface-craft, and race strategy** — the
loose-surface toolkit (left-foot braking, the flick, the handbrake, throttle steering), how the road
itself changes what you do, and how races are actually won. This is the reference the site's rally
lessons are checked against.

**Scope & caveat.** This picks up where the other two references stop. It does **not** re-cover the
grip budget, weight-transfer theory, or basic slide correction (see `car-control-reference.md`), nor
the taxonomy of corner shapes (see `corner-types-reference.md`). Everything here is defined for real
cars on real stages; Wreckfest 2 is arcade physics with heavy contact, so treat it as the default
principle set and validate in-game.

Two structural facts shape how much of this transfers:

- **Rallycross, not stage rally, is the closest real discipline to Wreckfest 2** — a short mixed-surface
  circuit, wheel-to-wheel, contact tolerated. Stage rally's strategy layer (pacenotes, service parks,
  road order, tyre loops) mostly does *not* transfer, and is recorded below mainly to mark the boundary.
- **Wreckfest 2 has no AWD** (11 FR RWD, 5 FWD, 2 rear-engine RR). Rally technique written for AWD
  hardware — centre-diff behaviour, AWD launches — is out of scope; the FWD-vs-RWD splits below are
  the ones that matter.

## Techniques

### 1. Left-foot braking
Keeping the left foot on the brake lets you brake *while still on power*, which on loose surfaces is
the main way you turn the car at all. DirtFish's framing is that steering inputs are weak on gravel,
so the pedals do the steering: braking dives the car forward, presses the front tyres into the loose
surface, and rotates the rear — killing mid-corner understeer without lifting. The value is strongly
drivetrain-dependent: it matters most in **FWD**, where it induces mild oversteer to cure the car's
built-in understeer (effectively a manual rear brake-bias shift, since the fronts keep driving while
the rears try to lock), and is *less necessary* in RWD, which can already adjust attitude with power
and opposite lock. The real-car turbo rationale — keeping boost up, avoiding lag — has no analogue in
an arcade game, so only the weight-transfer half of the argument carries over. Common errors: stabbing
the pedal instead of applying ankle pressure, and riding both pedals under a genuine stop.

### 2. The Scandinavian flick (pendulum turn)
A deliberate side-to-side weight transfer that pre-rotates the car before the corner starts: approach
from the wrong side of the road, lift and steer sharply *away* from the corner with some brake to load
the outside tyres and swing the tail out, then release and snap the steering back in so the car pivots
and arrives already pointing at the exit. It exists because on ice, snow, and gravel neither steering
nor braking alone will turn the car — you borrow rotation from momentum instead. Ross Bentley draws
the useful line: on dirt the low grip and low g-loads make the pendulum genuinely useful, but on tarmac
it shocks the front tyres and creates more weight transfer than a straight turn-in, so it costs time.
Whether it is still state of the art is contested — see [Contested](#contested--unverified--read-before-citing).

### 3. Handbrake turn
A rotation tool for corners so tight that there isn't enough entry speed to rotate any other way —
DirtFish calls junction-style square corners "a paradise for fans of the handbrake" precisely because
low entry speed leaves no momentum to work with. Sequence: slow early, off the footbrake, clutch in,
look where you want to go, turn in, pull the lever, release once rotated, then clutch out and feed in
throttle to convert the slide into drive. In **FWD** you don't need the clutch at all, since locking
the rears doesn't touch the driven wheels; in RWD you must stay clutched in through the pull. The cost
is momentum — it locks the rears outright and scrubs speed, which is why it's a last resort rather
than a default.

### 4. Throttle steering, and how much angle is actually fast
Throttle steer means aiming the rear of the car with throttle pressure rather than with the wheel,
and in rally it lives mostly on exit, after braking and weight transfer have already done the
rotating: catch the rotation with a counter-steer matched to the real slide angle, then steer with
your toes on the throttle. The important corrective to the "sideways is fast" folklore comes from
DirtFish directly — holding a big drift angle is **not** the goal; too much angle loses time, and the
target is the sweet spot between sliding and forward momentum, enough slip to rotate and enough grip
to accelerate. Named errors: throttle too early (an unplanned spin), sawing at the wheel, and looking
too close ahead, which turns every input into an over-correction.

### 5. Manufacturing rotation on entry
On low grip, entry rotation is deliberate rather than incidental. Team O'Neil describes lifting,
braking, turning, or all three at once to move load forward, then releasing the brake to re-load the
rear when you want rotation to *stop*. DirtFish teaches it as a drill pair — "lift, turn, wait" and
"lift, turn, brake": lift to start the transfer, turn to start the rotation, then either be patient
and let the rear come round or add brake to tighten the line. Bentley's point about the *rate* of
brake release transfers cleanly: release too early and the front unloads so the car won't rotate;
too late and you overload the fronts into understeer. The recurring instruction is patience — the
common error is rushing the apex and adding steering when the fix was a pedal.

### 6. Vision, hands, and gearing
Vision is taught as a technique, not a platitude: look far ahead and at where you want to go, because
if your vision is close your body reacts to every twitch of the car and smoothness becomes impossible.
Steering grip is genuinely contested — Škoda Motorsport teaches fixed hands at 9-and-3 for the best
sense of front-wheel position, while Team O'Neil defends shuffle steering for loose surfaces because
it keeps both hands usable when the wheel is being kicked around, conceding it isn't right at high
speed. Gearing philosophy on loose is about torque management: rally cars run deliberately shortened
ratios for low-end torque in slow technical sections, the opposite of circuit gearing.

## Reading the surface

### 7. The loose top layer and the swept line
A gravel road is a hard base with a loose layer sitting on top, and the grip is in the base. DirtFish's
image is "marbles on a kitchen floor." As cars run the road they fling the loose material aside, so
grooves and swept patches appear that expose the grippier base — meaning the fast line *migrates over
the course of an event* toward wherever previous cars have cleaned. This is also why grip is not
uniform across the road width, and DirtFish is explicit that there's no guarantee grip on entry
matches grip on exit, or even that it matches from one side of the car to the other. Reading the
surface ahead is therefore a separate skill from choosing a geometric line.

### 8. Ruts
Ruts are the second-order product of that sweeping: soft or sandy roads get carved by repeated passes,
so a second run is a materially different road. The authoritative sources treat ruts primarily as a
*constraint* — they remove your freedom to choose a line and must be "managed" while still committing
— and as a trap at tight, slow corners where the car has to climb out of them (Ogier stopping and
reversing in deep ruts; Greensmith rolling after sinking into a rut at a tight corner). The popular
advice to use ruts as a helpful rail is much weaker than it sounds; see Contested.

### 9. Cuts, banks, and what cutting costs
Cutting is fast and normal on loose, and it is also the main mechanism by which drivers wreck the road
— including for themselves on the next pass. The escalation is well documented: a cut that looks
outrageous from the first car looks normal by the time half the field has been through. The regulatory
limit is that two wheels stay on the road, and organisers enforce it physically rather than
electronically, placing logs and rocks on the insides of bends so the penalty for cutting is contact
and damage. The debris cost runs both ways — on gravel, cutting drags stones into the racing line and
causes punctures; on tarmac, cuts pull mud and stones out onto clean surface and move the braking
points for everyone behind.

### 10. Jumps and crests
The governing constraint is that you have no control authority in the air, so everything is decided
before takeoff: approach speed, pitch attitude, and knowing what's on the far side. DirtFish teaches
not lifting from the throttle during takeoff, which keeps weight rearward and stops nose-heavy cars
diving; a more advanced variant is a quick application and release of the brakes just before takeoff
so the front rebounds upward and shifts more weight rearward. On landing, full throttle is wrong —
a little throttle helps the tyres match ground speed, reducing the shock and helping the car regain
stability as grip returns. Landing attitude is not a cosmetic concern: flat, sharp landings have
produced real injuries in WRC.

### 11. Camber
Team O'Neil's framing is the cleanest: the more the road slopes the direction you're turning, the more
speed you can carry, because the slope acts as banking and presses the tyres into the surface.
Off-camber does the reverse and calls for earlier, smoother braking and a compromised line — one
documented tactic is to deliberately early-apex an off-camber corner to reach the on-camber part of
the road sooner. The *transition* matters more than the steady state: crossing the crown of the road
the car goes light and can hand you unexpected oversteer, and at the limit a crown should be treated
almost like a crest. On loose this compounds, because the loose material is thickest toward the road
edges — so the off-camber outside often pairs the worst camber with the worst surface.

### 12. Surface transitions, mud, and water
Gravel deforms and moves under the tyre where asphalt is static, and the grip threshold is vastly
lower, so a transition is a step change in both grip level *and* in how the car answers inputs.
Contamination is the other transition mechanism — cuts drag mud and stones onto clean tarmac, and the
resulting lines of mud move braking points. Standing water behaves as a hard limit rather than a grip
gradient: WRC water splashes have destroyed cars outright, with a couple of mph deciding the outcome.
For changing grip the advice is behavioural rather than predictive — keep a margin to correct for a
sudden slip, and look for surface tells rather than assuming grip continuity.

### 13. Snow and ice (brief, least relevant here)
Studs invert the usual expectation: on a hard ice base, studded tyres bite well enough for rally cars
to exceed 120 mph on ice you can barely walk on, and events become an exercise in keeping the studs
alive. The one genuinely distinctive technique is leaning on snowbanks, and it is explicitly
two-edged — brushing a bank gently helps turn the car, nudging it too hard drags you offline into a
spin. Latvala's version: you can kiss them, but you cannot hug them.

## Strategy — rallycross (the transferable half)

### 14. The format
A World RX circuit is 800–1400 m and mixes sealed surface with loose. A weekend runs four qualifying
rounds (up to 5 cars abreast, 4 laps), then two semi-finals and a final (6 cars, 2-2-2 grid). The
detail worth stealing conceptually: heats are scored **on elapsed time, not finishing position**, so
being stuck behind a slower car costs you directly — a rule that rewards clean air over track position.

### 15. The joker lap
The joker is an alternate, deliberately longer route through the circuit — typically 2–3 seconds —
which every driver must take exactly once per race, with its entry and exit off the racing line. The
strategy is a timing puzzle rather than a passing one: take it **early** to escape traffic and bank
clean laps, or **late** to hold the lead and use known, measured gaps as an undercut. Both work; a
single title-deciding final at Arvika saw three top drivers make three different calls, one jokering
early for clear air, one saving it to the last corner of the last lap, one taking it on the decisive
lap and winning by 0.042s. It also functions as a defensive escape valve — Timmy Hansen once jokered
early purely to dodge first-corner chaos. No source offers a canonical "correct" timing; it is
consistently described as situational.

### 16. Starts and the first corner
On an 800–1400 m lap the start is disproportionately decisive, because overtaking chances are few.
Launch is a real skill rather than a solved electronics problem — the driver modulates clutch and
throttle as their own traction control while grip changes underneath. First-corner *survival* is a
separate skill from launching well: a Barcelona start-line pile-up took out three top drivers at turn
one despite the two leaders having pre-agreed to leave each other room.

### 17. Racecraft on mixed surfaces
The governing rule is go where the grip is, which inverts a tarmac-circuit intuition: off the racing
line on loose is sometimes *better*, not worse, because that's where the base has been swept clean.
Surface transitions are the decisive passing and losing points — Kristoffersson beat the field through
a gravel-to-asphalt transition at Höljes by tiptoeing it neatly while rivals crossed it sideways. The
standard mixed-surface passing options are around the outside or an undercut into the following
corner, and one recurring trick is a slower entry to reach an asphalt strip on the inside of a dirt
corner, then out-accelerating cars stuck on the loose outside. Running behind also has a real cost
beyond position: trailing drivers run with mud-covered windscreens, the loose-surface analogue of
dirty air.

### 18. Contact norms
Permissive but bounded. The FIA penalty table only enumerates deliberate or reckless contact *after
the finish* as a listed offence; in-race contact is handled case-by-case, and stewards took no action
for the Barcelona turn-one shunt. The defence is that jostling for position is in the discipline's
DNA; the prosecution is that precedent (a driver stripped of a win for squeezing a rival) demands
consistency. There is no bright line — deliberately turning in on someone or squeezing them into a
barrier is where penalties historically land.

## Strategy — stage rally (mostly does *not* transfer)

Recorded to mark the boundary. **Pacenotes and recce** exist because a stage is unseen, one-off, and
20 km long; a game of repeated laps hands the player the notes for free through repetition. Note that
severity numbering is genuinely non-standard — the British club system runs 1 (gentle) to 5 (near-90°),
while the McRae system inverts it — so never present one scale as *the* system. **Road position and
running order** (the first car on gravel sweeps the road clean for everyone behind, an active handicap)
depends entirely on cars running solo at intervals; in a wheel-to-wheel race, first on road is simply
the lead and is unambiguously good. **Tyre loops, service parks, time controls, and the penalty
economy** have no analogue in a lap race. **Risk management** half-transfers: the solo-crash-ends-your-event
logic weakens in a contact-heavy arcade race, but the underlying calculus — push when you're behind,
bank the result when you're ahead — holds.

## How this maps to Wreckfest 2

- Most Wreckfest tracks are loose or mixed, so the surface-craft section carries more weight than the
  technique section: the swept line, the crown, camber, and surface transitions all have direct analogues.
- **No AWD in the game.** Left-foot braking is therefore most valuable in the five FWD cars (where it
  cures built-in understeer) and least in the RWD majority, which can already rotate on power.
- **Gamepad makes left-foot braking free.** Throttle and brake are separate triggers, so overlapping
  them costs nothing mechanically — the pedal-technique barrier that makes this an advanced real-world
  skill doesn't exist here. Worth verifying the game doesn't auto-cancel throttle under brake.
- The flick and the handbrake are worth teaching for tight corners specifically, not as defaults —
  both cost momentum, and the sources are clear that big angles are slow.
- FinnCross and European Rallycross are literally rallycross venues; the joker-lap and
  surface-transition thinking is the closest real-world match the game has.
- Contact norms transfer in spirit but not in degree — Wreckfest is far more permissive than World RX.
  Positioning and damage belong in the racecraft lessons.

## Contested / unverified — read before citing

Flagged deliberately; do not launder these into confident prose.

- **How much do pros actually left-foot brake?** Contested. Team O'Neil and Motor Authority present it
  as the defining rally skill with a measured time advantage; Toyota's technical director Tom Fowler,
  quoted by DirtFish, says the fastest drivers tend *not* to use throttle and brake together. Note also
  that "left foot on the brake for speed of application" and "pedals genuinely overlapped" are different
  things, often conflated.
- **Is the flick fast or wasteful?** Sources actively disagree. Bentley: fast on dirt, counterproductive
  on tarmac. Wikipedia and a Jalopnik-quoted instructor: modern drivers largely use trail braking and
  left-foot braking instead. Team O'Neil still teaches it. Reasonable synthesis: a legitimate
  loose-surface tool for tight corners, neither mandatory nor free.
- **Origin attributions are folklore-grade.** Left-foot braking is credited variously to Röhrl,
  Aaltonen, and Carlsson; the flick to Blomqvist and to Nordic drivers generally. Don't name an inventor.
- **Ruts as a helpful rail is weakly sourced.** Common in consumer off-road content; no professional
  rally source verified it. The pro material treats ruts as a constraint and a trap.
- **Using an inside bank/berm to turn on gravel is undocumented.** Only the *snow*-bank version has
  authoritative support, and even that is marginal. Treat gravel berm-leaning as folklore.
- **"Never lift on takeoff" is a rule of thumb, not physics** — it exists to counteract nose-heavy
  nosedive, and the same source also endorses a brake tap, which is a different pitch input.
- **"Grip is always in the swept line" oversimplifies** — swept lines on rocky stages expose sharp rock,
  so the grippiest line can also be the highest-puncture line.
- **Take a corner one gear higher on loose to limit wheelspin** — plausible and widely repeated, but
  traceable only to forum text, not to any rally school. Clutch kick is likewise a drift technique, not
  a sourced rally one.
- **Wet grass: no source found.** Don't assert specifics.
- **Rules drift.** World RX semi/final lap counts differ by era (5/6 current per the 2025 regs; 6/6 in
  older explainers). The 35–60% sealed-surface figure is 2019-era and unconfirmed for 2025/26. The
  widely-quoted 0.15 s launch-control window is a defunct Global Rallycross rule, not World RX. The
  superrally re-entry penalty is now 10 minutes per stage; the "5 minutes" still circulating is stale.

## Notable sources

Ordered roughly most-authoritative / most-relevant first.

- **DirtFish Rally School** — the single best instructional source here; loose-surface line, brakes,
  throttle steer, jumps.
  [How to use the brakes](https://dirtfish.com/learn/how-to/how-to-use-the-brakes/) ·
  [How to throttle steer](https://dirtfish.com/learn/how-to/how-to-throttle-steer/) ·
  [How to choose your line](https://dirtfish.com/learn/how-to/how-to-choose-your-line/) ·
  [Gravel vs asphalt](https://dirtfish.com/learn/how-to/how-to-drive-on-gravel-vs-asphalt/) ·
  [How to jump a rally car](https://dirtfish.com/learn/how-to/how-to-jump-a-rally-car/) ·
  [How to do a handbrake turn](https://dirtfish.com/learn/how-to-do-a-handbrake-turn/) ·
  [How to take a square corner](https://dirtfish.com/learn/how-to/how-to-take-a-square-corner/)
- **Team O'Neil Rally School** — technique breakdowns and the clearest camber treatment.
  [Left Foot Braking Explained](https://teamoneil.com/blog/left-foot-braking-explained/) ·
  [How to do a Pendulum Turn](https://teamoneil.com/blog/how-to-do-a-pendulum-turn/) ·
  [Weight Transfer](https://teamoneil.com/blog/weight-transfer/) ·
  [Road Camber Explained](https://teamoneil.com/blog/road-camber-explained/) ·
  [Shuffle Steering: Still A Useful Technique?](https://teamoneil.com/blog/shuffle-steering-still-a-useful-technique/)
- **FIA regulations (primary, definitive)** —
  [2025 World RX Sporting Regulations (PDF)](https://api.fia.com/system/files/documents/2025_fia_world_rx_championship_sporting_regulations_29_05_25.pdf)
  (format, joker lap, starts, penalty table) ·
  [2026 WRC Sporting Regulations (PDF)](https://www.fia.com/system/files/documents/wrc_2026_sr_version_13_january_2026.pdf)
  (recce, running order, service, time controls).
- **Ross Bentley / Speed Secrets** — when the flick pays and when it doesn't; brake-release rate as the
  rotation control.
  [Scandinavian flick Q&A](https://speedsecrets.com/q-should-i-turn-left-slightly-before-turning-right-into-a-corner-using-what-some-call-a-scandinavian-flick/) ·
  [How to rotate your car](https://rossbentley.substack.com/p/speed-secrets-how-to-rotate-your)
- **Rallycross strategy and racecraft (DirtFish)** —
  [The title decided by 0.042 seconds](https://dirtfish.com/rallycross/the-title-that-was-decided-by-0-042-seconds/) (three joker strategies in one final) ·
  [Kristoffersson in muddy Höljes](https://dirtfish.com/rallycross/world-rx/kristoffersson-rediscovers-his-mojo-in-muddy-holjes/) (surface transitions, mud) ·
  [Did Barcelona's shunt deserve a penalty?](https://dirtfish.com/rallycross/world-rx/did-world-rxs-barcelona-final-shunt-deserve-a-penalty/) (contact norms) ·
  [Launch Control: the perfect start](https://dirtfish.com/tech/launch-control-achieving-the-perfect-start/) ·
  [How to win when you aren't even driving](https://dirtfish.com/rallycross/nitrocross/how-to-win-in-rallycross-when-you-arent-even-driving/)
- **Surface and conditions (WRC reporting)** —
  [Cutting corners in Kenya](https://dirtfish.com/rally/wrc/will-drivers-be-cutting-corners-in-kenya/) ·
  [Rain transforms Croatia](https://dirtfish.com/rally/wrc/how-rain-will-transform-croatia-into-a-different-rally/) ·
  [Why water-splashes became a problem](https://dirtfish.com/rally/wrc/why-water-splashes-have-become-a-wrc-problem/) ·
  [Man-made Estonia jumps](https://dirtfish.com/rally/wrc/drivers-question-use-of-man-made-estonia-jumps/) ·
  [Evans on road order](https://dirtfish.com/rally/wrc/evans-solution-to-wrcs-road-order-headache/) ·
  [Acropolis 2026 (Autosport)](https://www.autosport.com/wrc/news/wrc-acropolis-rally-greece-thierry-neuville-leads-as-puncture-derails-adrien-fourmauxs-charge/10833450/) ·
  [Pirelli on Sardinia's swept base](https://press.pirelli.com/home-soil-in-sardinia-for-pirelli-scorpion-wrc-tyres/)
- **Snow/ice** — [Motor Sport — Rally Sweden](https://www.motorsportmagazine.com/articles/rally/snow-speeders-the-challenge-of-rally-sweden/) ·
  [Motorsport.com — low snowfall curveball](https://www.motorsport.com/wrc/news/wrc-crews-face-an-extra-curveball-at-rally-sweden-not-enough-snow/10797147/)
- **Definitions (tertiary, for terminology only)** —
  [Left-foot braking](https://en.wikipedia.org/wiki/Left-foot_braking) ·
  [Scandinavian flick](https://en.wikipedia.org/wiki/Scandinavian_flick) ·
  [Handbrake turn](https://en.wikipedia.org/wiki/Handbrake_turn) ·
  [Lift-off oversteer](https://en.wikipedia.org/wiki/Lift-off_oversteer) ·
  [Pacenotes](https://en.wikipedia.org/wiki/Pacenotes)
- **Also consulted:** [Motor Authority on LFB (Wyatt Knox)](https://www.motorauthority.com/news/1109003_whats-better-for-rally-driving-left-foot-or-right-foot-braking) ·
  [Motor Authority on handbrake turns](https://www.motorauthority.com/news/1114890_this-is-the-proper-way-to-pull-off-a-perfect-handbrake-turn) ·
  [Škoda Motorsport on steering grip](https://www.skoda-motorsport.com/en/drive-like-pro-hold-wheel-like-rally-driver/) ·
  [Peugeot Sport — Rallycross Explained](https://www.media.stellantis.com/em-en/peugeot-sport/press/rallycross-explained) ·
  [DirtFish — pacenotes at Ypres](https://dirtfish.com/rally/wrc/why-making-pacenotes-is-so-tricky-in-ypres/)

_Last researched: July 2026. Every URL above was fetched and confirmed during research. Rally
technique is defined for real cars on real surfaces; Wreckfest 2 is arcade with heavy contact —
treat these as default principles and validate in-game._
