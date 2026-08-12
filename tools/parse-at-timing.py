#!/usr/bin/env python3
"""
parse-at-timing.py — Timing-Analyse der all-turtles-Lottie (Erweiterung von
parse-at-lottie.py). Extrahiert pro Shape-Layer in comp_1..comp_5 Einflug-
Zeitpunkt, Ankunfts-Zeitpunkt und Einflug-Weltposition, sowie pro Szene eine
Sichtbarkeits-Kurve ueber die Zeit.

Es werden NUR Messdaten aus der bestehenden Lottie-Datei extrahiert (Keyframe-
Zeiten, Transform-Ketten) - kein Lottie-Inhalt kopiert, nichts geschaetzt.

Aufruf:
    python3 tools/parse-at-timing.py [<pfad/zur/anim_0.json>] [<output.json>]
Default-Quelle:  /Users/McTomson/dev/at-reference-lottie/anim_0.json  (nur lesen)
Default-Output:  lib/relaunch/morph/at-timing.json
"""
import importlib.util
import json
import os
import statistics
import sys

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location(
    "parse_at_lottie", os.path.join(TOOLS_DIR, "parse-at-lottie.py")
)
lot = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(lot)  # laedt Funktionen, fuehrt aber lot.__main__ NICHT aus
# (parse-at-lottie.py hat `if __name__ == "__main__":` -> beim Import als Modul
#  unter fremdem Namen wird der Block nicht ausgefuehrt)

SRC = sys.argv[1] if len(sys.argv) > 1 else "/Users/McTomson/dev/at-reference-lottie/anim_0.json"
OUT = sys.argv[2] if len(sys.argv) > 2 else "/Users/McTomson/dev/redrabbit/lib/relaunch/morph/at-timing.json"

CANVAS_W, CANVAS_H = lot.CANVAS_W, lot.CANVAS_H
ON_CANVAS_LO, ON_CANVAS_HI = -0.02, 1.02
N_SAMPLES = 48


def r4(x):
    return round(float(x), 4)


def world_matrix_st(layer, ind_map, comp_frame, _depth=0):
    """Wie lot.world_matrix, aber beruecksichtigt layer.st: die Property-Keyframes
    eines Layers sind in dessen EIGENER lokaler Zeit (comp_frame - layer.st)
    definiert, nicht direkt in der geteilten Comp-Frame-Achse. Ohne diese
    Korrektur waeren Keyframe-Zeiten verschiedener Layer nicht vergleichbar
    (in dieser Datei hat layer.st Werte 8..20 je nach Layer, siehe Validierung).
    """
    st = layer.get("st", 0) or 0
    local_frame = comp_frame - st
    m = lot.layer_matrix(layer.get("ks", {}), local_frame)
    par = layer.get("parent")
    if par is not None and par in ind_map and _depth < 20:
        pm = world_matrix_st(ind_map[par], ind_map, comp_frame, _depth + 1)
        return lot.mat_mul(pm, m)
    return m


def clamp(v, lo, hi):
    return max(lo, min(hi, v))


def process():
    doc = json.load(open(SRC))
    assets = {a["id"]: a for a in doc.get("assets", [])}
    top = doc.get("layers", [])
    display_dur = {}
    for L in top:
        display_dur[L.get("refId")] = L.get("op", 0) - L.get("ip", 0)

    scenes_out = []
    report = {}

    for cid in ["comp_1", "comp_2", "comp_3", "comp_4", "comp_5"]:
        comp = assets[cid]
        layers = comp["layers"]
        ind_map = lot.build_parent_index(layers)
        dur = display_dur.get(cid, 24)
        shape_layers = [L for L in layers if L.get("ty") == 4]

        pieces_out = []
        rep_pieces = []
        anomalies = []

        # Cache: pro Layer lokale Bbox-Zentrum (Shape-Geometrie ist in dieser
        # Datei nie keyframe-animiert, siehe Kommentar in parse-at-lottie.py
        # collect_layer_points -> "animiert - hier nie der Fall"). Auswertung
        # am eigenen ip-Frame des Layers (lokale Zeit).
        layer_center = {}
        for L in shape_layers:
            ind = L.get("ind")
            local_ip = L.get("ip", 0)
            local_pts = lot.collect_layer_points(L.get("shapes", []), local_ip)
            if not local_pts:
                anomalies.append({"_anomaly": "no_path", "ind": ind})
                layer_center[ind] = None
                continue
            xs = [p[0] for p in local_pts]
            ys = [p[1] for p in local_pts]
            lcx = (min(xs) + max(xs)) / 2
            lcy = (min(ys) + max(ys)) / 2
            layer_center[ind] = (lcx, lcy)

        for L in shape_layers:
            ind = L.get("ind")
            center = layer_center.get(ind)
            if center is None:
                continue
            lcx, lcy = center
            st = L.get("st", 0) or 0
            local_ip = L.get("ip", 0)
            p_prop = L.get("ks", {}).get("p")

            local_first_kf = lot.first_kf_time(p_prop)
            local_last_kf = lot.last_kf_time(p_prop)

            entry_local = local_ip if local_first_kf is None else max(local_ip, local_first_kf)
            arrive_local = local_ip if local_last_kf is None else local_last_kf

            entry_comp = entry_local + st
            arrive_comp = arrive_local + st

            entry_comp_c = clamp(entry_comp, 0, dur)
            arrive_comp_c = clamp(arrive_comp, 0, dur)
            entryT = entry_comp_c / dur if dur else 0.0
            arriveT = arrive_comp_c / dur if dur else 0.0

            wm = world_matrix_st(L, ind_map, entry_comp)
            wc = lot.mat_apply(wm, [lcx, lcy])
            entryX = wc[0] / CANVAS_W
            entryY = wc[1] / CANVAS_H
            on_canvas = (ON_CANVAS_LO <= entryX <= ON_CANVAS_HI) and (ON_CANVAS_LO <= entryY <= ON_CANVAS_HI)

            pieces_out.append([r4(entryT), r4(arriveT), r4(entryX), r4(entryY), 1 if on_canvas else 0])
            rep_pieces.append({
                "ind": ind, "entryT": r4(entryT), "arriveT": r4(arriveT),
                "entryX": r4(entryX), "entryY": r4(entryY), "onCanvas": on_canvas,
                "st": st, "local_ip": local_ip, "local_first_kf": local_first_kf,
                "local_last_kf": local_last_kf,
            })

        # visibleCurve: 48 gleichverteilte t in [0,1] (inkl. Endpunkte)
        visible_curve = []
        for i in range(N_SAMPLES):
            t = i / (N_SAMPLES - 1)
            comp_frame = t * dur
            count = 0
            for L in shape_layers:
                ind = L.get("ind")
                center = layer_center.get(ind)
                if center is None:
                    continue
                st = L.get("st", 0) or 0
                local_frame = comp_frame - st
                local_ip = L.get("ip", 0)
                local_op = L.get("op", dur)
                if not (local_ip <= local_frame <= local_op):
                    continue
                o = lot.prop_value(L.get("ks", {}).get("o"), local_frame)
                opac = o[0] if isinstance(o, list) else o
                opac = 100.0 if opac is None else float(opac)
                if opac <= 0:
                    continue
                lcx, lcy = center
                wm = world_matrix_st(L, ind_map, comp_frame)
                wc = lot.mat_apply(wm, [lcx, lcy])
                x, y = wc[0] / CANVAS_W, wc[1] / CANVAS_H
                if ON_CANVAS_LO <= x <= ON_CANVAS_HI and ON_CANVAS_LO <= y <= ON_CANVAS_HI:
                    count += 1
            visible_curve.append(count)

        scenes_out.append({
            "id": cid,
            "pieces": pieces_out,
            "visibleCurve": visible_curve,
        })
        report[cid] = {
            "pieces": rep_pieces,
            "anomalies": anomalies,
            "dur": dur,
            "n_layers": len(shape_layers),
            "visibleCurve": visible_curve,
        }

    out = {
        "source": "vermessen aus all-turtles Original-Lottie (nur Messdaten, Timing-Erweiterung, Tomson-Freigabe)",
        "canvas": {"w": CANVAS_W, "h": CANVAS_H},
        "onCanvasRange": [ON_CANVAS_LO, ON_CANVAS_HI],
        "note": "pieces=[entryT,arriveT,entryX,entryY,onCanvasAtEntry(0/1)] pro Shape-Layer",
        "scenes": scenes_out,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(out, open(OUT, "w"), ensure_ascii=False, indent=2)
    return report


def pct(vals, p):
    if not vals:
        return 0.0
    s = sorted(vals)
    i = max(0, min(len(s) - 1, int(round(p * (len(s) - 1)))))
    return s[i]


def validate(report):
    print("=" * 72)
    for cid, r in report.items():
        pieces = r["pieces"]
        n = len(pieces)
        entryTs = [p["entryT"] for p in pieces]
        arriveTs = [p["arriveT"] for p in pieces]
        onc = [p for p in pieces if p["onCanvas"]]
        print(f"\n### {cid} ({r['n_layers']} shape-layer, dur={r['dur']}, anomalien={len(r['anomalies'])})")
        print(f"  entryT: median={pct(entryTs,0.5):.3f} p10={pct(entryTs,0.1):.3f} p90={pct(entryTs,0.9):.3f}")
        print(f"  arriveT: median={pct(arriveTs,0.5):.3f} p10={pct(arriveTs,0.1):.3f} p90={pct(arriveTs,0.9):.3f}")
        print(f"  onCanvasAtEntry: {len(onc)}/{n} = {100.0*len(onc)/n if n else 0:.1f}%")
        vc = r["visibleCurve"]
        print(f"  visibleCurve: min={min(vc)} max={max(vc)} start={vc[0]} end={vc[-1]}")
        print(f"  visibleCurve (48 Werte): {vc}")
        print(f"  Stichprobe (3 Teile):")
        for p in pieces[:3]:
            print(f"    ind={p['ind']} entryT={p['entryT']} arriveT={p['arriveT']} "
                  f"entryX={p['entryX']} entryY={p['entryY']} onCanvas={p['onCanvas']} "
                  f"st={p['st']} local_ip={p['local_ip']} first_kf={p['local_first_kf']} last_kf={p['local_last_kf']}")
        if r["anomalies"]:
            print(f"  ANOMALIEN: {r['anomalies']}")
    print("=" * 72)


if __name__ == "__main__":
    rep = process()
    validate(rep)
    print(f"\nOutput geschrieben: {OUT}")
