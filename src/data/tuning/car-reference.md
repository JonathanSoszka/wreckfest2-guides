# Car Reference — Source of Truth

Each Wreckfest 2 car's **real-world inspiration and the handling character that follows from it**,
so per-car tuning starts from what the car actually *is*. Use this together with
[surface-tuning-reference.md](./surface-tuning-reference.md): the car reference tells you the car's
**baseline tendency** (what to tune around); the surface reference tells you **which way to move**
each slider for Mud / Gravel / Asphalt.

Cars are renamed in-game to avoid licensing; inspirations below are community-identified (Wreckfest
Fandom wiki, IGCD.net, Traxion, update coverage) and are **High confidence** unless noted. Weights
are in-game figures where known, otherwise the real car's approximate curb weight. Researched
July 2026.

## Drivetrain roster (resolved)

| Drivetrain | Cars |
|---|---|
| **RWD — front-engine (FR)** | RoadSlayer, Hurricane, Rocket, Bravion, Rammer, Cardinal, Switchback, Nami, Stahlwagen, Bullet, Jackal |
| **FWD (FF)** | Crusader, Gizmo, Phaser, Grandstar, Valken |
| **RWD — rear-engine (RR)** | Buggy, Popper |
| **AWD** | *(none identified in the current roster)* |

## Roster at a glance

| Car (ID) | Inspiration | Drive | Balance | Signature to tune around |
|---|---|---|---|---|
| RoadSlayer (car01) | '73 Pontiac Firebird / Trans Am | FR | front-heavy ~56/44 | entry understeer + exit power oversteer (heaviest muscle) |
| Hurricane (car02) | '69 Chevrolet Camaro | FR | front-heavy ~54/46 | power oversteer on exit, mild entry push, low redline |
| Rocket (car03) | '68 Ford Mustang | FR | ~55/45 | neutral all-rounder, mild power oversteer |
| Bravion (car04) | BMW 3 Series (E46) | FR | ~50/50 | oversteer-prone (power & lift-off) |
| Crusader (car05) | '02 Chevrolet Cavalier | FF | front-heavy ~62/38 | power-on understeer; rotate the rear |
| Gizmo (car06) | '80 VW Golf Mk1 | FF | front-heavy ~61/39 | nimble, lift-off oversteer, weak power-down |
| Rammer (car07) | '86 Chevrolet Caprice | FR | front-heavy ~56/44 | understeer/push, momentum rammer (~1,633 kg) |
| Cardinal (car08) | '10 Ford Crown Victoria | FR | front-biased ~55/45 | heavy understeer tank, high top speed (~1,937 kg) |
| Buggy (car09) | '71 VW Beetle | RR | rear-biased ~40/60 | pendulum / lift-off oversteer, darty (~934 kg) |
| Popper (car10) | Fiat 500 / 600 | RR | rear-biased ~40/60 | tiny, lift-off oversteer, technical-track toy |
| Switchback (car11) | '68 Chevrolet Chevelle-style | FR | front-biased ~55/45 | straight-line brawler, tight-corner understeer |
| Phaser (car12) | '91 Honda Prelude | FF | nose-heavy ~62/38 | understeer-limited, peaky engine, light rear snap |
| Grandstar (car13) | '01 Dodge Caravan (minivan) | FF | very nose-heavy ~58–60% | understeer + roll-prone/tippy, high CG |
| Nami (car14) | '89 Mazda MX-5 Miata (NA) | FR | ~50/50 | rotates fast & bites fast; lift-off *and* power oversteer |
| Stahlwagen (car15) | '01 Mercedes C-Class Estate (W203) | FR | ~53/47 | stable wagon; controllable oversteer |
| Valken (car16)¹ | '97 Saab 900 (NG900) | FF | nose-heavy ~62/38 | understeer-prone "snappy all-rounder," low power |
| Bullet (car21) | '70 Dodge Charger / Satellite | FR | front-heavy ~56/44 | stable but slow to rotate; slides build momentum (~1,795 kg) |
| Jackal (car26) | Fox Body Mustang (3rd-gen) | FR | front-heavy ~57/43 | snap oversteer on lift, live-axle hop, easy wheelspin |

¹ The site calls this car **Valken**, following THQ Nordic's own press asset
(`Wreckfest_2_Upadate_7_Valken.jpg`) and the published car lists. The string extracted from the
game files reads **Xalken** — treat that as an internal or stale literal, and be wary of other
extracted display names for the same reason.

---

## By handling archetype

Tuning strategy clusters by archetype more than by individual car. Each group shares a core setup
story; the per-car notes are the differences of degree.

### 1. Front-heavy RWD V8 muscle / pony coupes
**RoadSlayer, Hurricane, Rocket, Jackal, Bullet, Switchback**

Core story: the heavy iron V8 over the front axle gives **entry understeer**, and the torque
hitting the rear tyres gives **power oversteer on exit**. Tuning goal: wake the front up without
letting the torque own the rear — free the nose (softer front / stiffer rear roll resistance, a
little front camber), and keep the rear planted (moderate diff lock, don't over-soften the rear
into a snap).

- **RoadSlayer (car01)** — *'73 Pontiac Firebird / Trans Am.* The heaviest, most understeery
  bruiser of the group; torque-rich low-rev big V8, longish wheelbase (108"). Most nose to wake up,
  most torque to contain.
- **Hurricane (car02)** — *'69 Camaro.* Torque-rich small-block with a **low redline** — power
  oversteer arrives the instant you're on throttle, and it runs out of revs early, so gearing
  matters and exit grip defines pace, not top end.
- **Rocket (car03)** — *'68 Mustang.* Lighter, more balanced (~55/45), only mild power oversteer.
  The neutral all-rounder — small changes swing it either way, so tune to taste rather than
  fighting a dominant vice.
- **Jackal (car26)** — *Fox Body Mustang.* Lightest, twitchiest, short wheelbase over a **live rear
  axle** → snap oversteer on lift and **axle/wheel hop** over bumps. Add rear grip, soften rear
  damping, ease diff lock, reward smooth inputs.
- **Bullet (car21)** — *'70 Charger.* Long, heavy, long-wheelbase → best high-speed stability, worst
  agility; slides build momentum and take distance to gather. Buy rotation for the slow stuff and
  steer it with the throttle.
- **Switchback (car11)** — *'68 Chevelle-style.* Heavy straight-line brawler, poor in tight corners;
  set up for high-speed/oval, help turn-in, brake early into technical sections.

### 2. Heavy RWD full-size sedans (understeer tanks)
**Rammer, Cardinal**

Core story: very heavy, long-wheelbase, front-biased RWD → **strong understeer and lazy direction
changes**, but huge mass and durability. Tune the front for whatever bite you can get (stiffer rear
ARB, softer front), and otherwise build them as demolition/rammer platforms — straight-line
stability and impact survival over agility. Smooth, early braking beats trail-braking.

- **Rammer (car07)** — *'86 Chevy Caprice*, ~1,633 kg, torque-rich small-block. Momentum weapon.
- **Cardinal (car08)** — *'10 Ford Crown Victoria*, ~1,937 kg (heaviest in the roster), high top
  speed and strength, lowest cornering. The ultimate high-speed tank.

### 3. Balanced / light RWD sports
**Bravion, Nami, Stahlwagen**

Core story: near-50/50 RWD that **rotates willingly** — the risk is oversteer, not understeer. Tune
to *calm the rear* and protect exit traction rather than to add rotation.

- **Bravion (car04)** — *BMW E46*, ~50/50, rev-happy — power/lift-off oversteer-prone. Softer rear
  roll, a little rear toe-in / forward brake bias to stop entry snap; a point-and-shoot exit car.
- **Nami (car14)** — *'89 Miata (NA roadster)*, very light, short wheelbase, ~50/50, **peaky low-
  torque** four. Rotates beautifully and bites just as fast; manage **both** lift-off oversteer
  (Coast lock) and power oversteer (Power lock). Win on momentum and line — don't set it so loose
  it scrubs its meagre exit drive.
- **Stahlwagen (car15)** — *'01 Mercedes C-Class Estate.* The stable one: long wheelbase, wagon mass
  slightly rearward (~53/47) aids RWD traction, torque-rich midrange. Predictable; brake bias and
  diff tuning matter more than on a nose-heavy car.

### 4. Rear-engine RWD (RR) — pendulum cars
**Buggy, Popper**

Core story: engine behind the rear axle → **rear weight bias and lift-off / pendulum oversteer** —
the tail wants to swing wide, especially off-throttle. Tune to tame the tail (soften rear roll
relative to front, add rear grip, forward brake bias) and avoid abrupt mid-corner lifts. Both are
tiny, light, and fragile — nimble momentum cars, not contact winners.

- **Buggy (car09)** — *'71 VW Beetle*, ~934 kg, ~40/60 rear, torque-light flat-four, short
  wheelbase. Darty and quick to rotate; set up for stability, not more rotation. (Rear-engine RR —
  not a mid-engine dune buggy despite the name.)
- **Popper (car10)** — *Fiat 500 / 600*, ~500–600 kg, rear-biased, torque-poor tiny twin. Great on
  tight technical tracks, hopeless on straights; gear short, keep it in the powerband. *(In-game
  drivetrain is the one soft spot — real basis is unambiguously RR; verify the axle model in-game.)*

### 5. FWD (front-drive) — power-on understeer cars
**Crusader, Gizmo, Phaser, Grandstar, Valken**

Core story: the front tyres steer, brake, **and** drive, so the enemy is **understeer — especially
power-on understeer out of corners**. Everything inverts vs. RWD: the light rear is a *tool*. Run a
loose/stiff-biased rear (stiffer rear ARB, softer/relatively looser rear, rear toe-out) to make the
tail rotate on entry (lift-off / trail-brake), get the car turned *before* you get on power, then
unwind and drive out straighter. Protect front traction on exit.

- **Crusader (car05)** — *'02 Chevrolet Cavalier*, front-heavy ~62/38, modest torque. Textbook FWD:
  rotate on entry, protect the loaded front on exit.
- **Gizmo (car06)** — *'80 VW Golf Mk1*, very light, short wheelbase → nimble; pronounced **lift-off
  oversteer** on loose surfaces (a rotation tool that can bite), and weak power-down out of slow
  corners. Carry corner speed.
- **Phaser (car12)** — *'91 Honda Prelude*, nose-heavy, **peaky high-rev** four. Gear short and keep
  revs up (it won't lug like a V8); nimble corner-carver but the light FWD rear can snap over
  kerbs/jumps — add a touch of rear stability on rough tracks.
- **Grandstar (car13)** — *'01 Dodge Caravan minivan*, heavy and **very nose-heavy with a high CG**
  → strong understeer and roll/rollover risk. Stiffen anti-roll and lower ride height where allowed;
  use the mass as a ramming asset; stability over agility.
- **Valken (car16)** — *'97 Saab 900*, nose-heavy, low power but "handles well." A momentum-driven,
  snappy all-rounder; tune for agility/cornering, not straight-line speed; watch launch wheelspin.

---

## How to use this with the tuning guides

1. **Start from the archetype** for the car's baseline balance (understeer-in / oversteer-out for
   muscle; rotate-the-rear for FWD; tame-the-tail for RR; calm-the-rear for balanced RWD).
2. **Apply the surface directions** from [surface-tuning-reference.md](./surface-tuning-reference.md)
   to move each slider Mud → Gravel → Asphalt.
3. **Bias the magnitude by the car's vice** — e.g. a torque-forward car (Hurricane, Bullet) gets a
   little less diff lock everywhere to manage exit oversteer; a nose-heavy FWD (Grandstar) leans
   harder on rear rotation aids; a snap-happy light car (Jackal, Nami) trades some rotation for a
   calmer, more planted rear.

## Notable sources

- **Wreckfest Fandom wiki** — per-car vehicle pages naming each inspiration (primary source for all
  18). <https://wreckfest.fandom.com/wiki/>
- **IGCD.net** — in-game-car database mapping models to real vehicles (RoadSlayer→Firebird,
  Rocket→Mustang, Cardinal, Crusader, Nami, etc.). <https://www.igcd.net/>
- **Traxion** — Wreckfest 2 car-announcement coverage (Jackal = Fox Body, Bullet = '70s Charger).
  <https://traxion.gg/wreckfest-2-adds-two-us-cars-and-new-player-progression-system/>
- **Update coverage** — CarThrottle, OnlineRaceDriver, RacingGames.gg, Overtake.gg, THQ Nordic
  newsroom (content-update car reveals: Phaser, Grandstar, Popper, Switchback, Stahlwagen, Valken).
- Real-world specs: manufacturer/Wikipedia data for weight, distribution, engine character, and
  wheelbase of each identified model.

_Confidence: all inspirations High. Exceptions noted inline — Switchback's exact muscle model is a
composite (Medium), and Popper's in-game drivetrain wants an in-game check (real basis RR is
certain). The Valken name is discussed above._
