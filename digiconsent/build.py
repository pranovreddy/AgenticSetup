#!/usr/bin/env python3
"""Assemble the DigiConsent complaints prototype (brief version).

  src/vendor/base.css    the app's compiled stylesheet
  src/vendor/react.html  React + ReactDOM, inlined
  src/app.css            complaints styles
  src/app.js             complaints flow, receipt, history
  src/dialer.css/.js     the report-from-dialer version
  src/home.css/.js       the home screen (from the Consent OS Figma file), assets in src/assets/home

Writes complaints-brief.html (screenshot flow) and complaints-dialer.html (report
from the call log). Pass a folder as the first argument to also write body-only
fragments (no doctype / html / head / body) for hosts that
wrap the page themselves.
"""
import base64
import json
import sys
from pathlib import Path

root = Path(__file__).parent
src = root / "src"
read = lambda p: (src / p).read_text()

def page(name, title, scripts, mount, fragment=None, pre=""):
    title = "<title>" + title + "</title>"
    style = "<style>" + read("vendor/base.css") + "\n" + "\n".join(read(c) for c in scripts if c.endswith(".css")) + "</style>"
    js = "".join(read(c) for c in scripts if c.endswith(".js"))
    if "home.js" in scripts:   # home-screen icons and logos from the Figma design, inlined as data URIs
        mime = {".svg": "image/svg+xml", ".png": "image/png"}
        assets = {f.stem: "data:" + mime[f.suffix] + ";base64," + base64.b64encode(f.read_bytes()).decode() for f in sorted((src / "assets/home").iterdir())}
        js = "const HA = " + json.dumps(assets) + ";\n" + js
    body = ('<div id="root"></div>\n' + read("vendor/react.html") + "\n<script>\n" + pre + js
            + 'ReactDOM.createRoot(document.getElementById("root")).render(h(' + mount + "));\n</script>")
    (root / name).write_text(
        '<!doctype html>\n<html lang="en"><head><meta charset="UTF-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">\n'
        '<meta name="theme-color" content="#3868E0">' + title + "\n" + style + "</head>\n<body>" + body + "</body></html>\n")
    if fragment:
        Path(fragment).write_text(title + "\n" + style + "\n" + body + "\n")
    print("built", name)


out = sys.argv[1] if len(sys.argv) > 1 else None   # optional folder for body-only fragments
frag = lambda n: str(Path(out) / n) if out else None
page("complaints-brief.html", "DigiConsent Complaints", ["app.css", "home.css", "app.js", "home.js"], "App", frag("brief-artifact.html"))
# same module without the demo screenshots: any uploaded image is read as the first demo screenshot
page("complaints-upload.html", "DigiConsent Complaints Upload", ["app.css", "home.css", "app.js", "home.js"], "App", frag("upload-artifact.html"), pre="window.__CX_NO_DEMOS = true;\n")
page("complaints-dialer.html", "DigiConsent In-App Report", ["app.css", "dialer.css", "app.js", "dialer.js"], "DialerApp", frag("dialer-artifact.html"))
