#!/usr/bin/env python3
"""Builds the single offline file digiconsent-complaints-demo.html from src/."""
import pathlib
here = pathlib.Path(__file__).parent
r = lambda n: (here / "src" / n).read_text(encoding="utf-8")
html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>DigiConsent Complaint Management</title>
<style>
%s
</style>
</head>
<body>
<a class="skip" href="#main">Skip to the demonstration</a>
<div id="app"></div>
<div id="panel"></div>
<div id="live" class="sr" aria-live="polite" role="status"></div>
<script>
%s
</script>
</body>
</html>
""" % (r("style.css"), "\n".join(r(n) for n in ["data.js", "content.js", "app1.js", "app2.js"]))
assert "\u2014" not in html and "\u2013" not in html, "dash found"
out = here.parent / "digiconsent-complaints-demo.html"
out.write_text(html, encoding="utf-8")
print(out, len(html))
