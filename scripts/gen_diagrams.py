#!/usr/bin/env python3
"""
Track-diagram generator for the racing lessons.

Racing-line graphics are derived from a shared track model so the line always
follows the road (see src/data/lessons/car-control-reference.md and the research
notes). A track is a centerline built turtle-style from straights and arcs; the
road is the centerline stroked at the road width; a racing line is the centerline
offset laterally by a bounded profile n(s) in the Frenet frame:

    point = centerline(s) + n(s) * left_normal(s),   |n(s)| <= half_width - margin

so the line physically cannot leave the track. Line "types" are just different
n(s) profiles (geometric / late-apex / hug-inside), given per diagram as control
points (fraction_along_path, offset).

The jump diagram is the one exception to the model above: a jump is a side
elevation, not a plan view, so it is drawn from a ground profile plus a ballistic
arc. The point it makes is that the arc is the same either way — only the car's
pitch attitude changes — so both panels share one trajectory.

Run:  python scripts/gen_diagrams.py <out_dir>
Writes racing-line.svg, corner-types.svg, pendulum.svg, swept-line.svg and
jump.svg (pure stdlib; no dependencies).
"""
import math
import os
import random
import sys

FONT = "system-ui, 'Segoe UI', Roboto, sans-serif"


# ---------------------------------------------------------------- track model
def build_centerline(start, heading_deg, segs, step=2.5):
    """Turtle centerline. segs: ('s', length) straight, ('a', radius, turn_deg) arc
    (turn_deg > 0 curves one way, < 0 the other). Returns points [(x, y), ...]."""
    x, y = start
    h = math.radians(heading_deg)
    pts = [(x, y)]
    for seg in segs:
        if seg[0] == 's':
            d = seg[1]
            n = max(2, int(d / step))
            for _ in range(n):
                x += (d / n) * math.cos(h)
                y += (d / n) * math.sin(h)
                pts.append((x, y))
        else:
            R, ang = seg[1], math.radians(seg[2])
            sgn = 1.0 if ang >= 0 else -1.0
            cx = x + R * math.cos(h + math.pi / 2 * sgn)
            cy = y + R * math.sin(h + math.pi / 2 * sgn)
            a0 = math.atan2(y - cy, x - cx)
            n = max(2, int(abs(R * ang) / step))
            for i in range(1, n + 1):
                a = a0 + ang * i / n
                x = cx + R * math.cos(a)
                y = cy + R * math.sin(a)
                pts.append((x, y))
            h += ang
    return pts


def left_normals(pts):
    """Unit left-hand normal at each point (central finite difference tangent)."""
    out = []
    n = len(pts)
    for i in range(n):
        ax, ay = pts[max(0, i - 1)]
        bx, by = pts[min(n - 1, i + 1)]
        tx, ty = bx - ax, by - ay
        L = math.hypot(tx, ty) or 1.0
        out.append((ty / L, -tx / L))
    return out


# ------------------------------------------------------------- offset profile
def _smooth(t):  # raised cosine 0..1
    t = max(0.0, min(1.0, t))
    return (1 - math.cos(math.pi * t)) / 2


def offset_values(n_pts, ctrl):
    """Interpolate control points [(frac, n), ...] *linearly* over the path, so
    the entry and exit run straight (constant lateral rate = no curvature). The
    apex/turn-in corners are rounded afterwards by `_smooth_vals`. Linear (not
    cosine) interpolation is what keeps the line bending one way — no inflection
    at the apex."""
    ctrl = sorted(ctrl)
    vals = []
    for i in range(n_pts):
        f = i / (n_pts - 1)
        if f <= ctrl[0][0]:
            vals.append(ctrl[0][1])
            continue
        if f >= ctrl[-1][0]:
            vals.append(ctrl[-1][1])
            continue
        for (f0, n0), (f1, n1) in zip(ctrl, ctrl[1:]):
            if f0 <= f <= f1:
                vals.append(n0 + (n1 - n0) * (f - f0) / (f1 - f0))
                break
    return vals


def _smooth_vals(vals, passes=3):
    """Moving-average smooth the offset profile so the racing line has continuous
    curvature (no direction break at the apex). Window scales with path length."""
    n = len(vals)
    k = max(2, n // 18)
    v = list(vals)
    for _ in range(passes):
        nv = []
        for i in range(n):
            lo, hi = max(0, i - k), min(n, i + k + 1)
            nv.append(sum(v[lo:hi]) / (hi - lo))
        v = nv
    return v


def offset_line(pts, normals, ctrl, apex_after=0.0):
    """Offset the centerline by the (smoothed) profile. Returns the line and its apex.

    `apex_after` restricts the apex search to the last part of the path. A line that
    starts as far inside as it apexes — the flick, which approaches from the inside —
    would otherwise report its entry point as the apex."""
    vals = _smooth_vals(offset_values(len(pts), ctrl))
    line = [(x + vals[i] * normals[i][0], y + vals[i] * normals[i][1])
            for i, (x, y) in enumerate(pts)]
    lo = int(len(vals) * apex_after)
    apex_i = min(range(lo, len(vals)), key=lambda i: vals[i])  # most-inside point
    return line, line[apex_i]


# --------------------------------------------------------------- svg emitters
def smooth_path(pts):
    """A smooth cubic-Bezier SVG path through the points (Catmull-Rom -> Bezier).
    Renders as a true curve in every browser — no faceting from a many-point polyline."""
    k = max(1, len(pts) // 14)
    cp = pts[::k]
    if cp[-1] != pts[-1]:
        cp.append(pts[-1])
    n = len(cp)
    if n < 3:
        return "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in cp)
    d = f"M{cp[0][0]:.1f},{cp[0][1]:.1f}"
    for i in range(n - 1):
        p0, p1, p2, p3 = cp[max(0, i - 1)], cp[i], cp[i + 1], cp[min(n - 1, i + 2)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f" C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}"
    return d


def road(pts, w):
    d = smooth_path(pts)
    return (f'<path d="{d}" fill="none" stroke="#2e323d" stroke-width="{w + 6}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>\n'
            f'<path d="{d}" fill="none" stroke="#23262f" stroke-width="{w}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>')


def line(pts, color, lw=4):
    return (f'<path d="{smooth_path(pts)}" fill="none" stroke="{color}" stroke-width="{lw}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>')


def dot(p, color, r=5):
    return f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="{r}" fill="{color}"/>'


def text(x, y, s, fill="#e6e7ea", size=13):
    return f'<text x="{x}" y="{y}" fill="{fill}" font-family="{FONT}" font-size="{size}">{s}</text>'


def svg(w, h, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n'
            f'<rect x="1" y="1" width="{w - 2}" height="{h - 2}" rx="10" fill="#1c1e26" stroke="#2e323d"/>\n'
            + body + '\n</svg>\n')


BLUE, ORANGE = "#3d6fa8", "#e0672a"


# ------------------------------------------------------------------ diagrams
def racing_line_svg():
    pts = build_centerline((230, 300), -90, [('s', 180), ('a', 70, 90), ('s', 140)])
    nrm = left_normals(pts)
    m = 22
    geo, ag = offset_line(pts, nrm, [(0, m), (0.34, m), (0.53, -m), (0.74, m), (1, m)])
    late, al = offset_line(pts, nrm, [(0, m), (0.46, m), (0.62, -m), (0.80, m), (1, m)])
    body = "\n".join([
        road(pts, 60),
        line(geo, BLUE), line(late, ORANGE),
        dot(ag, BLUE), dot(al, ORANGE),
        f'<rect x="30" y="250" width="26" height="4" fill="{BLUE}"/>', text(64, 258, "Geometric — one smooth arc"),
        f'<rect x="30" y="276" width="26" height="4" fill="{ORANGE}"/>', text(64, 284, "Late apex — square it off"),
        text(196, 300, "Entry", "#a3a7b3"), text(392, 60, "Exit", "#a3a7b3"),
    ])
    return svg(460, 320, body)


def _fit(pts, cx, cy, max_w, max_h, pad):
    """Uniformly scale + centre a centerline into a panel box (road width fixed)."""
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    bw = (max(xs) - min(xs)) or 1.0; bh = (max(ys) - min(ys)) or 1.0
    bcx = (max(xs) + min(xs)) / 2; bcy = (max(ys) + min(ys)) / 2
    s = min((max_w - pad) / bw, (max_h - pad) / bh)
    return [(cx + (x - bcx) * s, cy + (y - bcy) * s) for x, y in pts]


def _mini(heading, segs, ctrl, label, cx, label_x, cy=110, road_w=18, m=5):
    local = build_centerline((0, 0), heading, segs)
    pts = _fit(local, cx, cy, 92, 150, pad=road_w + 10)
    nrm = left_normals(pts)
    ln, apex = offset_line(pts, nrm, ctrl)
    return "\n".join([road(pts, road_w), line(ln, ORANGE, 3), dot(apex, ORANGE, 3.5),
                      text(label_x, 214, label)])


def corner_types_svg():
    m = 5
    body = "\n".join([
        text(40, 26, "Orange = the racing line, dot = apex", "#a3a7b3", 12),
        # hairpin: tight 180
        _mini(-90, [('s', 34), ('a', 16, 180), ('s', 34)],
              [(0, m), (0.34, m), (0.55, -m), (0.78, m), (1, m)], "Hairpin", 74, 50),
        # sweeper: a long, gentle, high-speed curve
        _mini(-90, [('s', 42), ('a', 66, 44), ('s', 42)],
              [(0, m), (0.5, -m), (1, m)], "Sweeper", 188, 164),
        # chicane: quick left-right
        _mini(-90, [('s', 12), ('a', 20, 54), ('a', 20, -54), ('s', 12)],
              [(0.08, m), (0.35, -m), (0.65, m), (0.92, -m)], "Chicane", 300, 276),
        # decreasing radius: gentle then tight, same way
        _mini(-90, [('s', 14), ('a', 40, 32), ('a', 14, 62), ('s', 6)],
              [(0, m), (0.42, m), (0.72, -m), (0.92, m), (1, m)], "Decreasing", 404, 370),
    ])
    return svg(460, 234, body)


def pendulum_svg():
    """The Scandinavian flick: approach from the inside, feint away from the corner,
    then snap back in so the car arrives already rotated. Compared against a normal
    late-apex turn-in on the same corner."""
    pts = build_centerline((235, 300), -90, [('s', 170), ('a', 62, 90), ('s', 130)])
    nrm = left_normals(pts)
    m = 21
    normal, an = offset_line(pts, nrm, [(0, m), (0.44, m), (0.61, -m), (0.80, m), (1, m)])
    # Hold the inside approach for a stretch before the feint — a single control
    # point gets averaged away by _smooth_vals and the swing stops reading.
    flick, af = offset_line(pts, nrm, [(0, -m * 0.85), (0.12, -m * 0.85), (0.26, m),
                                       (0.42, m), (0.61, -m), (0.80, m), (1, m)],
                            apex_after=0.45)
    body = "\n".join([
        road(pts, 58),
        line(normal, BLUE), line(flick, ORANGE),
        dot(an, BLUE), dot(af, ORANGE),
        text(258, 268, "1 approach inside", "#a3a7b3", 12),
        text(258, 232, "2 feint away", "#a3a7b3", 12),
        text(258, 196, "3 snap back in", "#a3a7b3", 12),
        f'<rect x="30" y="250" width="26" height="4" fill="{BLUE}"/>',
        text(64, 258, "Normal turn-in"),
        f'<rect x="30" y="276" width="26" height="4" fill="{ORANGE}"/>',
        text(64, 284, "The flick — swing away, then in"),
    ])
    return svg(460, 320, body)


def swept_line_svg():
    """Where the grip actually is on a loose road: cars fling the loose top layer
    aside, exposing a grippier swept base along the used line. Loose material piles
    up off that line, thickest toward the edges."""
    pts = build_centerline((235, 296), -90, [('s', 170), ('a', 62, 90), ('s', 130)])
    nrm = left_normals(pts)
    m = 20
    swept, apex = offset_line(pts, nrm, [(0, m * 0.5), (0.44, m * 0.5), (0.61, -m),
                                         (0.80, m * 0.4), (1, m * 0.4)])
    # Loose material: scattered off the swept band, denser toward the road edges.
    rnd = random.Random(11)
    stones = []
    for _ in range(125):
        i = rnd.randrange(len(pts))
        # offset band chosen to sit outside the swept stripe but inside the road edge
        off = rnd.uniform(14, 27) * (1 if rnd.random() < 0.5 else -1)
        x = pts[i][0] + off * nrm[i][0]
        y = pts[i][1] + off * nrm[i][1]
        stones.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rnd.uniform(1.1, 2.2):.1f}" fill="#6b7280"/>')
    body = "\n".join([
        road(pts, 58),
        f'<path d="{smooth_path(swept)}" fill="none" stroke="#3c4250" stroke-width="22" '
        f'stroke-linecap="round" stroke-linejoin="round"/>',
        "\n".join(stones),
        line(swept, ORANGE, 3),
        f'<rect x="30" y="250" width="26" height="10" rx="2" fill="#3c4250"/>',
        text(64, 258, "Swept base — the grip is here"),
        f'<circle cx="36" cy="280" r="2.2" fill="#6b7280"/><circle cx="44" cy="276" r="1.6" fill="#6b7280"/>'
        f'<circle cx="50" cy="282" r="2" fill="#6b7280"/>',
        text(64, 284, "Loose material — piles up off the line"),
    ])
    return svg(460, 320, body)


def car_side(x, y, ang, color="#e6e7ea"):
    """Side-elevation car glyph. Origin sits at the tyre contact patch so it can be
    placed straight onto a ground line; `ang` pitches it nose-up (negative) or
    nose-down (positive), matching SVG's y-down rotation."""
    return (f'<g transform="translate({x:.1f},{y:.1f}) rotate({ang:.1f})">'
            f'<rect x="-14" y="-10" width="28" height="8" rx="3" fill="{color}"/>'
            f'<rect x="-6" y="-16" width="12" height="7" rx="2.5" fill="{color}"/>'
            f'<circle cx="-8" cy="-1" r="4" fill="#1c1e26" stroke="{color}" stroke-width="2"/>'
            f'<circle cx="8" cy="-1" r="4" fill="#1c1e26" stroke="{color}" stroke-width="2"/>'
            f'</g>')


def _arc_pts(p0, p1, h, n=44):
    """Ballistic arc from p0 to p1 peaking `h` above the straight line between them."""
    (x0, y0), (x1, y1) = p0, p1
    return [(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t - h * 4 * t * (1 - t))
            for t in (i / n for i in range(n + 1))]


def _jump_panel(y0, pitch, label, label_color, note):
    """One side-elevation panel: ramp, shared ballistic arc, and the car at takeoff,
    mid-air and landing at a given pitch attitude."""
    ground_y = y0 + 86
    lip = (168, y0 + 40)
    land = (372, ground_y)
    arc = _arc_pts(lip, land, 34)
    mid = arc[len(arc) // 2]
    return "\n".join([
        # ground + ramp
        f'<path d="M24,{ground_y} L104,{ground_y} L{lip[0]},{lip[1]} L{lip[0] + 8},{ground_y} '
        f'L436,{ground_y}" fill="none" stroke="#2e323d" stroke-width="7" '
        f'stroke-linecap="round" stroke-linejoin="round"/>',
        f'<path d="{smooth_path(arc)}" fill="none" stroke="#4a5060" stroke-width="2" '
        f'stroke-dasharray="6 6"/>',
        car_side(96, ground_y, -14, "#8b909c"),
        car_side(mid[0], mid[1], pitch, label_color),
        car_side(land[0] + 26, ground_y, pitch, label_color),
        text(30, y0 + 20, label, label_color),
        text(30, y0 + 36, note, "#a3a7b3", 12),
    ])


def jump_svg():
    """Jumps: the trajectory is the same either way — what you control is the car's
    pitch. Staying on throttle over the lip keeps it flat; lifting drops the nose."""
    body = "\n".join([
        _jump_panel(18, -8, "Stay on throttle over the lip", ORANGE,
                    "Weight stays back — flat attitude, lands on all four"),
        f'<line x1="24" y1="140" x2="436" y2="140" stroke="#2e323d" stroke-width="1"/>',
        _jump_panel(158, 22, "Lift on the lip", BLUE,
                    "Weight pitches forward — nose dives, lands front-first"),
    ])
    return svg(460, 300, body)


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    os.makedirs(out, exist_ok=True)
    files = {
        "racing-line.svg": racing_line_svg(),
        "corner-types.svg": corner_types_svg(),
        "pendulum.svg": pendulum_svg(),
        "swept-line.svg": swept_line_svg(),
        "jump.svg": jump_svg(),
    }
    for name, content in files.items():
        open(os.path.join(out, name), "w", encoding="utf-8").write(content)
    print("wrote", ", ".join(files), "to", out)


if __name__ == "__main__":
    main()
