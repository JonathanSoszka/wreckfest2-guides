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

Run:  python scripts/gen_diagrams.py <out_dir>
Writes racing-line.svg and corner-types.svg (pure stdlib; no dependencies).
"""
import math
import os
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
    """Interpolate control points [(frac, n), ...] over the path with smooth
    (raised-cosine) blends; returns an n-value per centerline point."""
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
                vals.append(n0 + (n1 - n0) * _smooth((f - f0) / (f1 - f0)))
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


def offset_line(pts, normals, ctrl):
    vals = _smooth_vals(offset_values(len(pts), ctrl))
    line = [(x + vals[i] * normals[i][0], y + vals[i] * normals[i][1])
            for i, (x, y) in enumerate(pts)]
    apex_i = min(range(len(vals)), key=lambda i: vals[i])  # most-inside point
    return line, line[apex_i]


# --------------------------------------------------------------- svg emitters
def _d(pts):
    return "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts)


def _poly(pts):
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)


def road(pts, w):
    return (f'<path d="{_d(pts)}" fill="none" stroke="#2e323d" stroke-width="{w + 6}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>\n'
            f'<path d="{_d(pts)}" fill="none" stroke="#23262f" stroke-width="{w}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>')


def line(pts, color, lw=4):
    return f'<polyline points="{_poly(pts)}" fill="none" stroke="{color}" stroke-width="{lw}"/>'


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


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    os.makedirs(out, exist_ok=True)
    open(os.path.join(out, "racing-line.svg"), "w", encoding="utf-8").write(racing_line_svg())
    open(os.path.join(out, "corner-types.svg"), "w", encoding="utf-8").write(corner_types_svg())
    print("wrote racing-line.svg, corner-types.svg to", out)


if __name__ == "__main__":
    main()
