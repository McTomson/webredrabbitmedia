#!/usr/bin/env python3
"""
verify-at-shapes.py — Verifiziert eine at-shapes-Extraktion pixelgenau gegen
das Original-Lottie (lottie-web als Ground Truth, headless agent-browser).

Ablauf pro Frame: (1) Engine-Simulation aus der JSON (entry->slot mit
cubic-bezier(0.6,0,0.4,1) + Kamera-Container) als SVG rendern, (2) die Precomp
per lottie-web auf denselben Frame stellen, (3) Rot-Masken vergleichen (IoU).

Gate: IoU >= 0.98 am Referenz-Frame, >= 0.90 bei ref-6. Exit-Code 1 sonst.

Aufruf:
    python3 tools/verify-at-shapes.py comp_1 [workdir]
Braucht: agent-browser, lottie.min.js im workdir (wird sonst via npm pack geholt).
"""
import json
import os
import re
import subprocess
import sys
import time

COMP = sys.argv[1] if len(sys.argv) > 1 else "comp_1"
WD = sys.argv[2] if len(sys.argv) > 2 else os.environ.get(
    "VERIFY_WORKDIR",
    "/private/tmp/claude-501/-Users-McTomson/0bc2b4b7-7da7-4e83-87f5-6681805ce8b6/scratchpad")
HERE = os.path.dirname(os.path.abspath(__file__))
SHAPES = os.path.join(HERE, "..", "lib", "relaunch", "morph", f"at-shapes-{COMP.replace('_','')}.json")
SRC = "/Users/McTomson/dev/at-reference-lottie/anim_0.json"
SESSION = f"verify-{COMP}"


def bez_ease(t, x1=0.6, y1=0.0, x2=0.4, y2=1.0):
    if t <= 0:
        return 0.0
    if t >= 1:
        return 1.0
    lo, hi = 0.0, 1.0
    for _ in range(40):
        mid = (lo + hi) / 2
        mt = 1 - mid
        x = 3 * mt * mt * mid * x1 + 3 * mt * mid * mid * x2 + mid ** 3
        if x < t:
            lo = mid
        else:
            hi = mid
    s = (lo + hi) / 2
    ms = 1 - s
    return 3 * ms * ms * s * y1 + 3 * ms * s * s * y2 + s ** 3


def sh(cmd):
    return subprocess.run(cmd, shell=True, capture_output=True, text=True)


def main():
    from PIL import Image
    import numpy as np

    data = json.load(open(SHAPES))
    dur = data["displayFrames"]
    ref = data["refFrame"]
    cam = data["camera"]

    def cam_at(u):
        if not cam:
            return {"x": 0.5, "y": 0.5, "s": 1.0}
        a, b = cam[0], cam[-1]
        if u <= a["t"]:
            return dict(a)
        if u >= b["t"]:
            return dict(b)
        e = bez_ease((u - a["t"]) / (b["t"] - a["t"]))
        return {k: a[k] + (b[k] - a[k]) * e for k in ("x", "y", "s")}

    cref = cam_at(ref / dur)

    def sim_html(frame):
        u = frame / dur
        c = cam_at(u)
        k = c["s"] / cref["s"]
        parts = []
        for p in data["pieces"]:
            if p["hidden"]:
                continue
            if u <= p["entryT"]:
                e = 0.0
            elif u >= p["arriveT"]:
                e = 1.0
            else:
                e = bez_ease((u - p["entryT"]) / (p["arriveT"] - p["entryT"]))
            x = p["fromX"] + (p["x"] - p["fromX"]) * e
            y = p["fromY"] + (p["y"] - p["fromY"]) * e
            rot = p["fromRot"] + (p["rot"] - p["fromRot"]) * e
            sc = (p["fromScale"] + (1 - p["fromScale"]) * e) * k
            wx = (c["x"] + k * (x - cref["x"])) * 1920
            wy = (c["y"] + k * (y - cref["y"])) * 1080
            parts.append(f'<path d="{p["d"]}" fill="#eb4646" transform="translate({wx} {wy}) '
                         f'rotate({rot}) scale({p["sx"]*sc} {p["sy"]*sc})"/>')
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 1920 1080">'
               '<rect width="1920" height="1080" fill="#fff"/>' + "".join(parts) + "</svg>")
        return "<!doctype html><body style='margin:0'>" + svg + "</body>"

    # GT-Seite: Precomp-Layer als Root (Kamera + alles inklusive)
    doc = json.load(open(SRC))
    comp = next(a for a in doc["assets"] if a["id"] == COMP)
    doc2 = {"v": doc.get("v", "5.7"), "fr": doc.get("fr", 24), "ip": 0, "op": dur + 1,
            "w": 1920, "h": 1080, "assets": [], "layers": comp["layers"]}
    if not os.path.exists(f"{WD}/lottie.min.js"):
        sh(f"cd {WD} && npm pack lottie-web@latest && tar xzf lottie-web-*.tgz "
           f"package/build/player/lottie.min.js && mv package/build/player/lottie.min.js .")
    gt_html = ("<!doctype html><body style='margin:0'>"
               "<div id=a style='width:1920px;height:1080px;background:#fff'></div>"
               "<script src='lottie.min.js'></script><script>const D=" + json.dumps(doc2) + ";"
               "const an=lottie.loadAnimation({container:document.getElementById('a'),renderer:'svg',"
               "loop:false,autoplay:false,animationData:D});"
               "an.addEventListener('DOMLoaded',()=>{an.goToAndStop(FRAME,true);document.title='READY'});"
               "</script></body>")

    def redmask(path):
        a = np.asarray(Image.open(path).convert("RGB")).astype(int)
        return (a[..., 0] > 120) & (a[..., 0] - a[..., 1] > 50) & (a[..., 0] - a[..., 2] > 50)

    frames = [max(0, ref - 6), max(0, ref - 2), ref]
    gates = {ref: 0.98, max(0, ref - 2): 0.95, max(0, ref - 6): 0.90}
    sh(f"agent-browser --session {SESSION} open about:blank")
    sh(f"agent-browser --session {SESSION} set viewport 1920 1080")
    ok = True
    for F in frames:
        open(f"{WD}/v-sim-{COMP}-{F}.html", "w").write(sim_html(F))
        open(f"{WD}/v-gt-{COMP}-{F}.html", "w").write(gt_html.replace("FRAME", str(F)))
        for kind in ("sim", "gt"):
            sh(f"agent-browser --session {SESSION} open 'file://{WD}/v-{kind}-{COMP}-{F}.html'")
            time.sleep(1.6)
            sh(f"agent-browser --session {SESSION} screenshot '{WD}/v-{kind}-{COMP}-{F}.png'")
        gt = redmask(f"{WD}/v-gt-{COMP}-{F}.png")
        mn = redmask(f"{WD}/v-sim-{COMP}-{F}.png")
        union = (gt | mn).sum()
        iou = (gt & mn).sum() / union if union else 0.0
        gate = gates[F]
        status = "OK" if iou >= gate else "FAIL"
        if iou < gate:
            ok = False
        print(f"{COMP} Frame {F}: IoU={iou:.4f} (Gate {gate}) {status}")
        # Overlay fuer Sichtpruefung
        ov = np.full((*gt.shape, 3), 255, np.uint8)
        ov[gt] = [235, 70, 70]
        ov[mn] = [60, 90, 220]
        ov[gt & mn] = [60, 20, 80]
        Image.fromarray(ov).save(f"{WD}/v-overlay-{COMP}-{F}.png")
    sh(f"agent-browser --session {SESSION} close")
    if not ok:
        print("VERIFIKATION FEHLGESCHLAGEN — Overlays in", WD, file=sys.stderr)
        sys.exit(1)
    print(f"{COMP}: Verifikation bestanden. Overlays: {WD}/v-overlay-{COMP}-*.png")


if __name__ == "__main__":
    main()
