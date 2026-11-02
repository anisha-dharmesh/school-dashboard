"""Regenerate web/src/gk/indiaMap.ts -- the SVG paths for the GK tab's India map.

Source: udit-001/india-maps-data (TopoJSON, state outlines per the Survey of India
map, 28 states + 8 UTs). Each shared border is an "arc"; simplifying arc by arc
keeps neighbouring states' borders identical, so there are no gaps or overlaps.

Usage:  python build_india_map.py [path/to/india.topo.json]
(downloads the file when no path is given)
"""
import json
import math
import sys
import urllib.request
from pathlib import Path

SOURCE = "https://raw.githubusercontent.com/udit-001/india-maps-data/main/topojson/india.json"
OUT = Path(__file__).parent / "web" / "src" / "gk" / "indiaMap.ts"
TOLERANCE = 0.025  # degrees (~2.5 km): fine for a classroom map, keeps the file small
K = math.cos(math.radians(22.5))  # squash longitude so India isn't stretched sideways


def decode_arcs(topo):
    sx, sy = topo["transform"]["scale"]
    tx, ty = topo["transform"]["translate"]
    arcs = []
    for arc in topo["arcs"]:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)
    return arcs


def simplify(points, tol):
    """Douglas-Peucker, keeping both endpoints (so arcs still meet)."""
    if len(points) < 3:
        return points
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        a, b = stack.pop()
        (ax, ay), (bx, by) = points[a], points[b]
        dx, dy = bx - ax, by - ay
        norm = math.hypot(dx, dy)
        far, far_d = -1, 0.0
        for i in range(a + 1, b):
            px, py = points[i]
            d = abs(dy * (px - ax) - dx * (py - ay)) / norm if norm else math.hypot(px - ax, py - ay)
            if d > far_d:
                far, far_d = i, d
        if far_d > tol:
            keep[far] = True
            stack += [(a, far), (far, b)]
    return [p for p, k in zip(points, keep) if k]


def ring_points(ring, arcs):
    pts = []
    for ref in ring:
        arc = arcs[ref] if ref >= 0 else arcs[~ref][::-1]
        pts += arc if not pts else arc[1:]
    return pts


def project(p):
    return (p[0] * K, -p[1])


def area_centroid(ring):
    a = cx = cy = 0.0
    for (x0, y0), (x1, y1) in zip(ring, ring[1:] + ring[:1]):
        c = x0 * y1 - x1 * y0
        a += c
        cx += (x0 + x1) * c
        cy += (y0 + y1) * c
    return a / 2, ((cx / (6 * a), cy / (6 * a)) if a else ring[0])


def inside(pt, ring):
    x, y = pt
    ok = False
    for (x0, y0), (x1, y1) in zip(ring, ring[1:] + ring[:1]):
        if (y0 > y) != (y1 > y) and x < (x1 - x0) * (y - y0) / (y1 - y0) + x0:
            ok = not ok
    return ok


def edge_dist(pt, ring):
    best = 1e9
    x, y = pt
    for (x0, y0), (x1, y1) in zip(ring, ring[1:] + ring[:1]):
        dx, dy = x1 - x0, y1 - y0
        t = max(0, min(1, ((x - x0) * dx + (y - y0) * dy) / (dx * dx + dy * dy))) if dx or dy else 0
        best = min(best, math.hypot(x - (x0 + t * dx), y - (y0 + t * dy)))
    return best


def label_point(rings):
    """The point inside the largest piece that is furthest from its edges."""
    outer = max(rings, key=lambda r: abs(area_centroid(r)[0]))
    xs, ys = [p[0] for p in outer], [p[1] for p in outer]
    best, best_d = area_centroid(outer)[1], -1.0
    n = 40
    for i in range(1, n):
        for j in range(1, n):
            pt = (min(xs) + (max(xs) - min(xs)) * i / n, min(ys) + (max(ys) - min(ys)) * j / n)
            if inside(pt, outer):
                d = edge_dist(pt, outer)
                if d > best_d:
                    best, best_d = pt, d
    return best


def main():
    if len(sys.argv) > 1:
        topo = json.loads(Path(sys.argv[1]).read_text())
    else:
        topo = json.load(urllib.request.urlopen(SOURCE, timeout=120))
    raw = decode_arcs(topo)
    arcs = [simplify(a, TOLERANCE) for a in raw]

    states = []
    min_x = min_y = 1e9
    max_x = max_y = -1e9
    for g in topo["objects"]["states"]["geometries"]:
        polys = g["arcs"] if g["type"] == "MultiPolygon" else [g["arcs"]]
        d, rings = [], []
        for poly in polys:
            for ring in poly:
                pts = ring_points(ring, arcs)
                if len(pts) < 5:  # a tiny UT (Chandigarh, Delhi...) would collapse -- keep its detail
                    pts = ring_points(ring, raw)
                pts = [project(p) for p in pts]
                rings.append(pts)
                d.append("M" + "L".join(f"{x:.2f},{y:.2f}" for x, y in pts[:-1]) + "Z")
                for x, y in pts:
                    min_x, max_x, min_y, max_y = min(min_x, x), max(max_x, x), min(min_y, y), max(max_y, y)
        lx, ly = label_point(rings)
        states.append({"name": g["properties"]["st_nm"], "d": "".join(d), "label": [round(lx, 2), round(ly, 2)]})

    states.sort(key=lambda s: s["name"])
    pad = 1.0
    view = [round(min_x - pad, 2), round(min_y - pad, 2), round(max_x - min_x + 2 * pad, 2), round(max_y - min_y + 2 * pad, 2)]
    header = "// Generated by build_india_map.py -- do not edit by hand.\n// Outlines: udit-001/india-maps-data (Survey of India state boundaries).\n"
    body = (
        f"export const INDIA_VIEWBOX = {json.dumps(view)} as const;\n\n"
        f"export const INDIA_PROJECTION = {{ kx: {K:.6f} }} as const; // x = lon * kx, y = -lat\n\n"
        f"export const INDIA_SHAPES: { '{' } name: string; d: string; label: [number, number] { '}' }[] = {json.dumps(states, ensure_ascii=False)};\n"
    )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(header + body, encoding="utf-8")
    print(f"{len(states)} shapes, viewBox {view}, {OUT.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
