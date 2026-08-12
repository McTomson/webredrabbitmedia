#!/usr/bin/env python3
"""
extract-at-shapes.py — Extrahiert die ORIGINAL-Teilformen (Bezier-Pfade) einer
all-turtles-Precomp als SVG-Pfade + Welt-Slots.

Kontext: Tomson-Entscheidung 05.07.2026 (brand/decisions-log.md) — fuer ein
identisches Formations-Ergebnis werden die Original-Teilformen uebernommen
(Uebergangsloesung, Wiedervorlage vor Launch). Faerbung im Renderer: #F12032.

Struktur-Voraussetzung (verifiziert fuer comp_1): jeder Shape-Layer hat genau
eine Gruppe mit genau einem statischen "sh"-Pfad + "fl"-Fill; keine Modifier
(tm/mm/rd), kein Skew, keine Pfad-Animation. Das Skript prueft das fail-closed.

Aufruf:
    python3 tools/extract-at-shapes.py [comp_id] [output.json]
Default: comp_1 -> lib/relaunch/morph/at-shapes-comp1.json
Quelle (NUR lesen): /Users/McTomson/dev/at-reference-lottie/anim_0.json
"""
import importlib.util
import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("atparse", os.path.join(HERE, "parse-at-lottie.py"))
atparse = importlib.util.module_from_spec(spec)
# parse-at-lottie fuehrt bei __main__ main aus; als Modul geladen nicht.
spec.loader.exec_module(atparse)

SRC = "/Users/McTomson/dev/at-reference-lottie/anim_0.json"
COMP = sys.argv[1] if len(sys.argv) > 1 else "comp_1"
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(
    HERE, "..", "lib", "relaunch", "morph", f"at-shapes-{COMP.replace('_','')}.json")

CANVAS_W, CANVAS_H = 1920, 1080


def fail(msg):
    print(f"FAIL-CLOSED: {msg}", file=sys.stderr)
    sys.exit(1)


def world_matrix_ref(layer, ind_map, comp_frame, _depth=0, parent_frame=None):
    """Wie atparse.world_matrix (Keyframe-t = Comp-Zeit, st NICHT addieren —
    per lottie-web-Live-Abfrage 05.07. verifiziert), zusaetzlich:
    parent_frame = optionale abweichende Comp-Zeit fuer die Parent-Kette
    ("Kamera"-Null bei Referenz-Frame einfrieren, Layer bei Ankunftszeit)."""
    m = atparse.layer_matrix(layer.get("ks", {}), comp_frame)
    par = layer.get("parent")
    if par is not None and par in ind_map and _depth < 20:
        pf = comp_frame if parent_frame is None else parent_frame
        pm = world_matrix_ref(ind_map[par], ind_map, pf, _depth + 1)
        return atparse.mat_mul(pm, m)
    return m


def decompose_flip(wm):
    """Dekomposition mit Flip-Erhalt (Determinante < 0 -> sy negativ)."""
    sx, sy, rot = atparse.mat_decompose(wm)
    if wm[0] * wm[4] - wm[1] * wm[3] < 0:
        sy = -sy
    return sx, sy, rot


def world_rotation_raw(layer, ind_map, comp_frame, _depth=0, parent_frame=None):
    """Rohe (nicht per atan2 gewrappte) Rotationssumme entlang der Elternkette —
    gleiche Frame-Semantik wie world_matrix_ref. mat_decompose liefert nur
    (-180,180] und verwirft damit Mehrfachumdrehungen (comp_2/3/5 haben Layer
    mit rohen r-Keyframes >180 Grad Differenz, z.B. -162.42 -> -360). Rotation
    ist additiv (keine Skew vorhanden, Rekompositions-Check prueft das separat)."""
    r = atparse.prop_value(layer.get("ks", {}).get("r"), comp_frame)
    rot = r[0] if isinstance(r, list) else (r if r is not None else 0.0)
    par = layer.get("parent")
    if par is not None and par in ind_map and _depth < 20:
        pf = comp_frame if parent_frame is None else parent_frame
        rot += world_rotation_raw(ind_map[par], ind_map, pf, _depth + 1)
    return rot


def collect_paths(shapes, frame, base=None, out=None):
    """Alle statischen sh-Pfade mit ihrer Gruppen-Matrix (Layer-Koordinaten)."""
    if base is None:
        base = atparse.mat_identity()
    if out is None:
        out = []
    for s in shapes:
        ty = s.get("ty")
        if ty == "gr":
            it = s.get("it", [])
            tr = next((x for x in it if x.get("ty") == "tr"), None)
            m = atparse.mat_mul(base, atparse.gr_transform(tr, frame))
            collect_paths([x for x in it if x.get("ty") != "tr"], frame, m, out)
        elif ty == "sh":
            k = s.get("ks", {}).get("k")
            if isinstance(k, list):
                fail("animierter Pfad gefunden — Extraktion dafuer nicht gebaut")
            out.append((k, base))
        elif ty in ("tm", "mm", "rd", "pb", "zz", "op"):
            fail(f"Pfad-Modifier '{ty}' gefunden — wuerde Form verfaelschen")
    return out


def path_to_svg(k, m, r2=lambda x: round(x, 2)):
    """Lottie-Bezier (v/i/o, c) -> SVG-Pfad-d, Matrix m angewandt."""
    v = k["v"]; i_t = k["i"]; o_t = k["o"]; closed = k.get("c", False)
    ap = atparse.mat_apply
    pts = [ap(m, p) for p in v]
    d = [f"M{r2(pts[0][0])} {r2(pts[0][1])}"]
    n = len(v)
    seg_count = n if closed else n - 1
    for j in range(seg_count):
        j1 = (j + 1) % n
        c1 = ap(m, [v[j][0] + o_t[j][0], v[j][1] + o_t[j][1]])
        c2 = ap(m, [v[j1][0] + i_t[j1][0], v[j1][1] + i_t[j1][1]])
        p1 = pts[j1]
        d.append(f"C{r2(c1[0])} {r2(c1[1])} {r2(c2[0])} {r2(c2[1])} {r2(p1[0])} {r2(p1[1])}")
    if closed:
        d.append("Z")
    return " ".join(d), pts


def bezier_bbox(k, m, samples=8):
    """Bbox inkl. Kurvenbaeuchen: Kurven grob abtasten (reicht fuer Zentrierung)."""
    v = k["v"]; i_t = k["i"]; o_t = k["o"]; closed = k.get("c", False)
    ap = atparse.mat_apply
    xs, ys = [], []
    n = len(v)
    seg_count = n if closed else n - 1
    for j in range(seg_count):
        j1 = (j + 1) % n
        p0 = v[j]
        c1 = [v[j][0] + o_t[j][0], v[j][1] + o_t[j][1]]
        c2 = [v[j1][0] + i_t[j1][0], v[j1][1] + i_t[j1][1]]
        p1 = v[j1]
        for s in range(samples + 1):
            t = s / samples
            mt = 1 - t
            x = mt**3 * p0[0] + 3 * mt**2 * t * c1[0] + 3 * mt * t**2 * c2[0] + t**3 * p1[0]
            y = mt**3 * p0[1] + 3 * mt**2 * t * c1[1] + 3 * mt * t**2 * c2[1] + t**3 * p1[1]
            wx, wy = ap(m, [x, y])
            xs.append(wx); ys.append(wy)
    return min(xs), min(ys), max(xs), max(ys)


def main():
    doc = json.load(open(SRC))
    assets = {a["id"]: a for a in doc.get("assets", [])}
    comp = assets[COMP]
    layers = comp["layers"]
    ind_map = atparse.build_parent_index(layers)
    shape_layers = [L for L in layers if L.get("ty") == 4]

    # Referenz-Frame = letzter angezeigter Frame der Precomp: dort ist die
    # "Kamera" (animierter Null-Parent: Pan + Zoom 100->55%) eingeschwungen.
    # Slot je Teil = Layer bei seiner EIGENEN Ankunftszeit, Parent-Kette beim
    # Referenz-Frame. (Ankuenfte liegen teils NACH dem Anzeige-Ende; die dank
    # Easing noch randnahen Nachzuegler friert das Original beim Scroll-Stopp
    # genauso unsichtbar ein.)
    top_dur = {L.get("refId"): L.get("op", 0) - L.get("ip", 0) for L in doc.get("layers", [])}
    dur = top_dur.get(COMP, 24)
    ref = float(os.environ.get("REF_FRAME", dur - 1))

    pieces = []
    max_recompose_err = 0.0
    for L in shape_layers:
        fkt = atparse.first_kf_time(L.get("ks", {}).get("p"))
        lkt = atparse.last_kf_time(L.get("ks", {}).get("p"))
        fkt_c = 0 if fkt is None else fkt                       # Comp-Zeit
        lkt_c = 0 if lkt is None else lkt

        paths = collect_paths(L.get("shapes", []), lkt_c)
        if len(paths) != 1:
            fail(f"Layer ind={L.get('ind')} hat {len(paths)} Pfade (erwartet 1)")
        k, gm = paths[0]

        # lokale Geometrie (Gruppen-Transform eingebacken)
        minx, miny, maxx, maxy = bezier_bbox(k, gm)
        lw, lh = maxx - minx, maxy - miny
        lcx, lcy = (minx + maxx) / 2, (miny + maxy) / 2
        # Pfad um sein Bbox-Zentrum zentrieren -> Renderer setzt nur T*R*S
        center_m = atparse.mat_mul(atparse.mat_translate(-lcx, -lcy), gm)
        d, _ = path_to_svg(k, center_m)

        # Welt-Slot: Layer bei ANKUNFT (letztes p-Keyframe), Kamera bei ref.
        # mat_decompose verliert das Vorzeichen bei Spiegelung (23 Layer nutzen
        # scaleY=-217%) -> decompose_flip prueft die Determinante.
        wm = world_matrix_ref(L, ind_map, lkt_c, parent_frame=ref)
        sx, sy, rot = decompose_flip(wm)
        wc = atparse.mat_apply(wm, [lcx, lcy])

        # Verifikation: T(wc)*R*S muss die Original-Matrix reproduzieren
        # (kein Skew / keine Spiegelung). Testpunkt = lokale Bbox-Ecke.
        rec = atparse.mat_mul(
            atparse.mat_translate(wc[0], wc[1]),
            atparse.mat_mul(atparse.mat_rotate(rot), atparse.mat_scale(sx, sy)))
        for tp in ([minx - lcx, miny - lcy], [maxx - lcx, miny - lcy]):
            orig_pt = atparse.mat_apply(wm, [tp[0] + lcx, tp[1] + lcy])
            rec_pt = atparse.mat_apply(rec, tp)
            err = math.hypot(orig_pt[0] - rec_pt[0], orig_pt[1] - rec_pt[1])
            max_recompose_err = max(max_recompose_err, err)

        # Opacity am Referenz-Frame
        o = atparse.prop_value(L.get("ks", {}).get("o"), ref)
        opac = (o[0] if isinstance(o, list) else o)
        hidden = (100.0 if opac is None else float(opac)) <= 0.5

        # In/Out-Point des Layers (Comp-lokale Frames): manche Comps (z.B. comp_2)
        # nutzen ip/op als Flacker-/Reveal-Fenster - Teile koennen VOR dem
        # Referenz-Frame wieder verschwinden (op <= ref) oder erst spaeter
        # auftauchen (ip > 0). comp_1 hat ip=0/-1, op=dur+1 fuer alle Layer
        # (immer sichtbar) -> Feld ist dort ein no-op.
        ip_raw = L.get("ip", 0)
        op_raw = L.get("op", dur + 1)

        # Entry-Zustand KOMPLETT (Position/Rotation/Scale) — Kamera auch hier
        # auf dem Referenz-Frame eingefroren: Original interpoliert in Layer-
        # Koordinaten VOR der Kamera. Entry und Slot im selben (REF-)Kamera-
        # Raum -> die Welt-Raum-Interpolation der Engine ist exakt aequivalent.
        # Der Kamera-Zoom waehrend des Aufbaus kommt separat als Buehnen-
        # Container-Transform (siehe "camera" im Output).
        wm0 = world_matrix_ref(L, ind_map, fkt_c, parent_frame=ref)
        sx0, sy0, rot0 = decompose_flip(wm0)
        wc0 = atparse.mat_apply(wm0, [lcx, lcy])

        # Kontinuierliche Rotation fuer die Sim-Interpolation (fromRot->rot):
        # atan2 (rot/rot0 oben) wrapped auf (-180,180] und macht bei rohen
        # Mehrfachdrehungen (z.B. -162.42 -> -360 Grad) die Zwischenbewegung
        # falschrum/zu kurz. Rohsumme entlang der Kette ist kontinuierlich,
        # braucht aber einen Flip-Ausgleich (Spiegelung addiert 180 Grad
        # Mehrdeutigkeit zwischen (rot,sy) und (rot+180,-sy)) — Offset wird
        # am Ankunfts-Frame gegen den verifizierten atan2-Wert justiert und
        # gilt (Flip ist statisch) unveraendert auch am Eintritts-Frame.
        raw_rot_arrive = world_rotation_raw(L, ind_map, lkt_c, parent_frame=ref)
        rot_offset = round((rot - raw_rot_arrive) / 180.0) * 180.0
        raw_rot_entry = world_rotation_raw(L, ind_map, fkt_c, parent_frame=ref)
        rot0_cont = raw_rot_entry + rot_offset

        r4 = atparse.r4
        pieces.append({
            "d": d,
            "w": r4(lw), "h": r4(lh),
            "x": r4(wc[0] / CANVAS_W), "y": r4(wc[1] / CANVAS_H),
            "rot": r4(rot), "sx": r4(sx), "sy": r4(sy),
            "fromX": r4(wc0[0] / CANVAS_W), "fromY": r4(wc0[1] / CANVAS_H),
            "fromRot": r4(rot0_cont),
            "fromScale": r4(sx0 / sx if sx else 1.0),
            "entryT": r4(fkt_c / dur),
            "arriveT": r4(lkt_c / dur),
            "hidden": hidden,
            "ip": r4(ip_raw),
            "op": r4(op_raw),
        })

    if max_recompose_err > 0.5:
        fail(f"Rekompositions-Fehler {max_recompose_err:.2f}px > 0.5px — Skew/Flip im Spiel")

    # Kamera-Track (animierte Null-Parents): Keyframes von Position + Scale in
    # Comp-Zeit/dur normiert. Engine legt daraus einen Container-Transform
    # relativ zum Referenz-Frame ueber die Buehne (Zoom 100->55% im Original).
    camera = []
    nulls = [L for L in layers if L.get("ty") == 3]
    if len(nulls) > 1:
        fail(f"{len(nulls)} Null-Layer — Kamera-Export erwartet max. 1")
    if nulls:
        cam = nulls[0]
        kts = set()
        for prop in ("p", "s"):
            kk = cam["ks"].get(prop, {}).get("k")
            if isinstance(kk, list) and kk and isinstance(kk[0], dict):
                kts.update(kf["t"] for kf in kk)
        for t in sorted(kts) or [ref]:
            cp = atparse.as2(atparse.prop_value(cam["ks"].get("p"), t))
            cs = atparse.as2(atparse.prop_value(cam["ks"].get("s"), t), (100.0, 100.0))
            camera.append({"t": atparse.r4(t / dur), "x": atparse.r4(cp[0] / CANVAS_W),
                           "y": atparse.r4(cp[1] / CANVAS_H), "s": atparse.r4(cs[0] / 100.0)})

    out = {
        "source": f"all-turtles Original-Teilformen {COMP} (Tomson-Entscheidung 05.07.2026, Uebergangsloesung)",
        "comp": COMP, "refFrame": ref, "displayFrames": dur,
        "ease": [0.6, 0, 0.4, 1],
        "canvas": {"w": CANVAS_W, "h": CANVAS_H},
        "camera": camera,
        "pieces": pieces,
    }
    outp = os.path.abspath(OUT)
    json.dump(out, open(outp, "w"), ensure_ascii=False, separators=(",", ":"))
    vis = [p for p in pieces if not p["hidden"]]
    arr_in = sum(1 for p in pieces if p["arriveT"] <= 1.0)
    print(f"{COMP}: {len(pieces)} Teile ({len(vis)} sichtbar, {arr_in} kommen im Anzeigefenster an), "
          f"ref={ref}/{dur}, max Rekompositions-Fehler {max_recompose_err:.4f}px")
    print(f"Output: {outp} ({os.path.getsize(outp)//1024} KB)")


if __name__ == "__main__":
    main()
