#!/usr/bin/env python3
"""
parse-at-lottie.py — Vermisst eine all-turtles-Lottie und extrahiert pro Szene die
Ziel-Weltkoordinaten aller roten Teile (Halte-Frame-Formation) als Mess-JSON.

Zweck: Uebergangs-Datendatei fuer die AT-Morph-Engine im Relaunch. Es werden NUR
Messdaten erzeugt (Positionen/Groessen/Farben) - kein Lottie-Inhalt kopiert.

Aufruf:
    python3 tools/parse-at-lottie.py <pfad/zur/anim_0.json> [<output.json>]
Default-Quelle:  /Users/McTomson/dev/at-reference-lottie/anim_0.json  (nur lesen)
Default-Output:  lib/relaunch/morph/at-formations.json
"""
import json, math, sys, os
from collections import Counter

SRC = sys.argv[1] if len(sys.argv) > 1 else "/Users/McTomson/dev/at-reference-lottie/anim_0.json"
OUT = sys.argv[2] if len(sys.argv) > 2 else "/Users/McTomson/dev/redrabbit/lib/relaunch/morph/at-formations.json"

CANVAS_W, CANVAS_H = 1920, 1080

# ---------------------------------------------------------------- property eval
def is_keyframed(prop):
    if not isinstance(prop, dict):
        return False
    k = prop.get("k")
    return isinstance(k, list) and len(k) > 0 and isinstance(k[0], dict)

def prop_value(prop, frame):
    """Wert einer Lottie-Transform-Property zum lokalen Comp-Frame (linear interp)."""
    if not isinstance(prop, dict):
        return prop
    k = prop.get("k")
    if not is_keyframed(prop):
        return k  # Zahl oder statische Liste
    kfs = k
    t0 = kfs[0].get("t")
    if frame <= t0:
        return list(kfs[0].get("s", []))
    for i in range(len(kfs) - 1):
        a, b = kfs[i], kfs[i + 1]
        ta, tb = a.get("t"), b.get("t")
        if ta <= frame <= tb:
            sa = a.get("s")
            sb = b.get("s", a.get("e", sa))
            if sb is None:
                sb = sa
            if tb == ta:
                return list(sa)
            u = (frame - ta) / (tb - ta)
            return [sa[j] + (sb[j] - sa[j]) * u for j in range(len(sa))]
    return list(kfs[-1].get("s", []))

def first_kf_time(prop):
    if is_keyframed(prop):
        return prop["k"][0].get("t")
    return None

def last_kf_time(prop):
    if is_keyframed(prop):
        return prop["k"][-1].get("t")
    return None

def as2(v, default=(0.0, 0.0)):
    if v is None:
        return list(default)
    if isinstance(v, (int, float)):
        return [float(v), float(v)]
    return [float(v[0]), float(v[1])]

# ---------------------------------------------------------------- 2D affine (3x3 -> 2x3)
def mat_identity():
    return [1.0, 0.0, 0.0, 0.0, 1.0, 0.0]  # a b tx c d ty

def mat_mul(m, n):
    a1, b1, tx1, c1, d1, ty1 = m
    a2, b2, tx2, c2, d2, ty2 = n
    return [
        a1 * a2 + b1 * c2,
        a1 * b2 + b1 * d2,
        a1 * tx2 + b1 * ty2 + tx1,
        c1 * a2 + d1 * c2,
        c1 * b2 + d1 * d2,
        c1 * tx2 + d1 * ty2 + ty1,
    ]

def mat_translate(tx, ty):
    return [1.0, 0.0, tx, 0.0, 1.0, ty]

def mat_scale(sx, sy):
    return [sx, 0.0, 0.0, 0.0, sy, 0.0]

def mat_rotate(deg):
    r = math.radians(deg)
    c, s = math.cos(r), math.sin(r)
    return [c, -s, 0.0, s, c, 0.0]

def mat_apply(m, p):
    a, b, tx, c, d, ty = m
    return [a * p[0] + b * p[1] + tx, c * p[0] + d * p[1] + ty]

def mat_decompose(m):
    a, b, tx, c, d, ty = m
    sx = math.hypot(a, c)
    sy = math.hypot(b, d)
    rot = math.degrees(math.atan2(c, a))
    return sx, sy, rot

def layer_matrix(ks, frame):
    """M = T(pos) * R(rot) * S(scale) * T(-anchor)  in lokaler Comp-Zeit."""
    p = prop_value(ks.get("p"), frame)
    a = prop_value(ks.get("a"), frame)
    s = prop_value(ks.get("s"), frame)
    r = prop_value(ks.get("r"), frame)
    px, py = as2(p)
    ax, ay = as2(a)
    ssx, ssy = as2(s, (100.0, 100.0))
    rot = r[0] if isinstance(r, list) else (r if r is not None else 0.0)
    m = mat_translate(px, py)
    m = mat_mul(m, mat_rotate(rot))
    m = mat_mul(m, mat_scale(ssx / 100.0, ssy / 100.0))
    m = mat_mul(m, mat_translate(-ax, -ay))
    return m

# ---------------------------------------------------------------- shape geometry
def gr_transform(tr, frame):
    if tr is None:
        return mat_identity()
    p = as2(prop_value(tr.get("p"), frame))
    a = as2(prop_value(tr.get("a"), frame))
    s = as2(prop_value(tr.get("s"), frame), (100.0, 100.0))
    rv = prop_value(tr.get("r"), frame)
    rot = rv[0] if isinstance(rv, list) else (rv if rv is not None else 0.0)
    m = mat_translate(p[0], p[1])
    m = mat_mul(m, mat_rotate(rot))
    m = mat_mul(m, mat_scale(s[0] / 100.0, s[1] / 100.0))
    m = mat_mul(m, mat_translate(-a[0], -a[1]))
    return m

def collect_layer_points(shapes, frame, base=None):
    """Alle Bezier-Ankerpunkte in Layer-Koordinaten (Gruppen-Transform angewandt)."""
    if base is None:
        base = mat_identity()
    pts = []
    for s in shapes:
        ty = s.get("ty")
        if ty == "gr":
            it = s.get("it", [])
            tr = next((x for x in it if x.get("ty") == "tr"), None)
            m = mat_mul(base, gr_transform(tr, frame))
            children = [x for x in it if x.get("ty") != "tr"]
            pts.extend(collect_layer_points(children, frame, m))
        elif ty == "sh":
            k = s.get("ks", {}).get("k")
            if isinstance(k, list):  # animiert - hier nie der Fall
                k = k[0].get("s", [{}])[0] if k and isinstance(k[0], dict) else None
            if isinstance(k, dict):
                for v in k.get("v", []):
                    pts.append(mat_apply(base, [v[0], v[1]]))
        elif ty == "rc":
            pos = as2(prop_value(s.get("p"), frame))
            sz = as2(prop_value(s.get("s"), frame))
            for dx in (-sz[0] / 2, sz[0] / 2):
                for dy in (-sz[1] / 2, sz[1] / 2):
                    pts.append(mat_apply(base, [pos[0] + dx, pos[1] + dy]))
        elif ty == "el":
            pos = as2(prop_value(s.get("p"), frame))
            sz = as2(prop_value(s.get("s"), frame))
            for dx in (-sz[0] / 2, sz[0] / 2):
                for dy in (-sz[1] / 2, sz[1] / 2):
                    pts.append(mat_apply(base, [pos[0] + dx, pos[1] + dy]))
    return pts

def first_fill(shapes):
    for s in shapes:
        if s.get("ty") == "fl":
            c = s.get("c", {}).get("k")
            if isinstance(c, list) and len(c) >= 3:
                return c
        if s.get("ty") == "gr":
            r = first_fill(s.get("it", []))
            if r:
                return r
    return None

def rgb_hex(c):
    if not c:
        return "#000000"
    r = max(0, min(255, round(c[0] * 255)))
    g = max(0, min(255, round(c[1] * 255)))
    b = max(0, min(255, round(c[2] * 255)))
    return "#%02x%02x%02x" % (r, g, b)

# ---------------------------------------------------------------- main
def build_parent_index(layers):
    return {L.get("ind"): L for L in layers if L.get("ind") is not None}

def world_matrix(layer, ind_map, frame, _depth=0):
    m = layer_matrix(layer.get("ks", {}), frame)
    par = layer.get("parent")
    if par is not None and par in ind_map and _depth < 20:
        pm = world_matrix(ind_map[par], ind_map, frame, _depth + 1)
        return mat_mul(pm, m)
    return m

def r4(x):
    return round(float(x), 4)

def process():
    doc = json.load(open(SRC))
    assets = {a["id"]: a for a in doc.get("assets", [])}
    top = doc.get("layers", [])
    # display duration je precomp (op-ip des top-layers)
    display_dur = {}
    for L in top:
        display_dur[L.get("refId")] = L.get("op", 0) - L.get("ip", 0)

    scenes = []
    labels = {"comp_0": "wordmark", "comp_1": "form1", "comp_2": "form2",
              "comp_3": "form3", "comp_4": "form4", "comp_5": "form5"}
    report = {}

    for cid in ["comp_0", "comp_1", "comp_2", "comp_3", "comp_4", "comp_5"]:
        comp = assets[cid]
        layers = comp["layers"]
        ind_map = build_parent_index(layers)
        dur = display_dur.get(cid, 24)

        shape_layers = [L for L in layers if L.get("ty") == 4]

        # Halte-Frame: pro Layer Ankunftszeit (letztes Position-Keyframe), 75. Perzentil, geklemmt.
        arrivals = []
        for L in shape_layers:
            lt = last_kf_time(L.get("ks", {}).get("p"))
            if lt is None:
                lt = L.get("ip", 0)
            arrivals.append(lt)
        arrivals_sorted = sorted(arrivals)
        if arrivals_sorted:
            idx = int(round(0.75 * (len(arrivals_sorted) - 1)))
            hold = arrivals_sorted[idx]
        else:
            hold = dur
        hold = max(0, min(hold, dur))

        pieces = []
        for L in shape_layers:
            ks = L.get("ks", {})
            shapes = L.get("shapes", [])
            # Layer-Punkte am Halte-Frame
            local_pts = collect_layer_points(shapes, hold)
            if not local_pts:
                # kein Pfad gefunden -> Struktur-Anomalie
                pieces.append({"_anomaly": "no_path", "ind": L.get("ind")})
                continue
            xs = [p[0] for p in local_pts]
            ys = [p[1] for p in local_pts]
            lminx, lmaxx, lminy, lmaxy = min(xs), max(xs), min(ys), max(ys)
            lcx, lcy = (lminx + lmaxx) / 2, (lminy + lmaxy) / 2
            lw, lh = (lmaxx - lminx), (lmaxy - lminy)

            wm = world_matrix(L, ind_map, hold)
            sx, sy, rot = mat_decompose(wm)
            wc = mat_apply(wm, [lcx, lcy])  # Weltzentrum der Bbox
            w_px = lw * sx
            h_px = lh * sy

            # Opacity am Halte-Frame
            o = prop_value(ks.get("o"), hold)
            opac = (o[0] if isinstance(o, list) else o)
            opac = 100.0 if opac is None else float(opac)
            hidden = opac <= 0.5

            # Klassifikation
            bw, bh = max(w_px, 1e-6), max(h_px, 1e-6)
            aspect = max(bw, bh) / max(1.0, min(bw, bh))
            area = w_px * h_px
            if aspect > 3:
                kind = "bar"
            elif aspect >= 1.6:
                kind = "curve"
            elif area < 0.0005 * CANVAS_W * CANVAS_H:
                kind = "dot"
            else:
                kind = "blob"

            color = rgb_hex(first_fill(shapes))

            # Einflug-Startpunkt: Weltzentrum am ersten Position-Keyframe
            fkt = first_kf_time(ks.get("p"))
            if fkt is None:
                fkt = L.get("ip", 0)
            wm0 = world_matrix(L, ind_map, fkt)
            wc0 = mat_apply(wm0, [lcx, lcy])

            pieces.append({
                "x": r4(wc[0] / CANVAS_W),
                "y": r4(wc[1] / CANVAS_H),
                "rot": r4(rot),
                "scaleX": r4(sx),
                "scaleY": r4(sy),
                "w": r4(w_px),
                "h": r4(h_px),
                "kind": kind,
                "color": color,
                "fromX": r4(wc0[0] / CANVAS_W),
                "fromY": r4(wc0[1] / CANVAS_H),
                "hidden": hidden,
            })

        clean = [p for p in pieces if "_anomaly" not in p]
        anomalies = [p for p in pieces if "_anomaly" in p]
        scenes.append({
            "id": cid,
            "label": labels[cid],
            "holdFrame": hold,
            "pieces": clean,
        })
        report[cid] = {"pieces": clean, "anomalies": anomalies,
                       "hold": hold, "dur": dur, "n_layers": len(shape_layers)}

    out = {
        "source": "vermessen aus all-turtles Original-Lottie (nur Messdaten, Uebergangsloesung, Tomson-Freigabe 05.07.2026)",
        "canvas": {"w": CANVAS_W, "h": CANVAS_H},
        "scenes": scenes,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(out, open(OUT, "w"), ensure_ascii=False, indent=2)
    return report


def validate(report):
    def pct(vals, p):
        if not vals:
            return 0.0
        s = sorted(vals)
        i = max(0, min(len(s) - 1, int(round(p * (len(s) - 1)))))
        return s[i]

    print("=" * 72)
    for cid, r in report.items():
        pieces = r["pieces"]
        vis = [p for p in pieces if not p["hidden"]]
        n = len(pieces)
        nvis = len(vis)
        # in-range x,y
        inr = [p for p in vis if -0.2 <= p["x"] <= 1.2 and -0.2 <= p["y"] <= 1.2]
        inr_pct = 100.0 * len(inr) / nvis if nvis else 0.0
        ws = [p["w"] for p in vis]
        wmed, w10, w90 = pct(ws, 0.5), pct(ws, 0.1), pct(ws, 0.9)
        # formation bbox (sichtbar)
        if vis:
            xs = [p["x"] for p in vis]
            ys = [p["y"] for p in vis]
            fminx, fmaxx = min(xs), max(xs)
            fw = (fmaxx - fminx)
            fcx = (fminx + fmaxx) / 2
            side = "LINKS" if fcx < 0.5 else "RECHTS"
        else:
            fw, fcx, side = 0, 0, "?"
        kinds = Counter(p["kind"] for p in vis)
        colors = Counter(p["color"] for p in vis)
        print(f"\n### {cid} ({r['n_layers']} shape-layer, hold={r['hold']}/{r['dur']})")
        print(f"  Teile: {n} total, {nvis} sichtbar, {n-nvis} hidden, anomalien={len(r['anomalies'])}")
        print(f"  x,y in [-0.2,1.2]: {inr_pct:.1f}% der sichtbaren")
        print(f"  w px: median={wmed:.1f} p10={w10:.1f} p90={w90:.1f}")
        print(f"  Formation-Breite: {fw*100:.1f}% canvas, Zentrum x={fcx:.3f} -> {side}")
        print(f"  kinds: {dict(kinds)}")
        top_colors = colors.most_common(4)
        print(f"  farben(top): {top_colors}")
        print(f"  beispiele:")
        for p in vis[:3]:
            print(f"    x={p['x']} y={p['y']} rot={p['rot']} w={p['w']} h={p['h']} "
                  f"{p['kind']} {p['color']} from=({p['fromX']},{p['fromY']})")
        if r["anomalies"]:
            print(f"  ANOMALIEN: {r['anomalies']}")
    print("=" * 72)


if __name__ == "__main__":
    rep = process()
    validate(rep)
    print(f"\nOutput geschrieben: {OUT}")
