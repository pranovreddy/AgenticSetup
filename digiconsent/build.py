#!/usr/bin/env python3
"""Assemble the DigiConsent complaints prototype (brief version).

  src/vendor/base.css    the app's compiled stylesheet
  src/vendor/react.html  React + ReactDOM, inlined
  src/vendor/data.js     demo screenshots and brand logos (base64)
  src/app.css            complaints styles
  src/app.js             complaints flow

Writes complaints-brief.html (standalone). Pass a path as the first argument to
also write a body-only fragment (no doctype / html / head / body) for hosts that
wrap the page themselves.
"""
import sys
from pathlib import Path

root = Path(__file__).parent
src = root / "src"
read = lambda p: (src / p).read_text()

title = "<title>DigiConsent Complaints</title>"
style = "<style>" + read("vendor/base.css") + "\n" + read("app.css") + "</style>"
body = '<div id="root"></div>\n' + read("vendor/react.html") + "\n<script>\n" + read("vendor/data.js") + read("app.js") + "</script>"

(root / "complaints-brief.html").write_text(
    '<!doctype html>\n<html lang="en"><head><meta charset="UTF-8">'
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">\n'
    '<meta name="theme-color" content="#3868E0">' + title + "\n" + style + "</head>\n<body>" + body + "</body></html>\n"
)
if len(sys.argv) > 1:
    Path(sys.argv[1]).write_text(title + "\n" + style + "\n" + body + "\n")
print("built complaints-brief.html")
