"""Builds agentic-setup-cards-states.html from agentic-setup-cards-ux.html: Part 2 design gaps as live, forceable states."""
import pathlib
here = pathlib.Path(__file__).parent
root = here.parents[4]
h = (root / "agentic-setup-cards-ux.html").read_text()
css = (here / "states.css").read_text(); js = (here / "states.js").read_text()
assert h.count("window.__deck = { opening,") == 1
h = h.replace("window.__deck = { opening,", js + "\nwindow.__deck = { uxState, opening,", 1)
h = h.replace('<script>document.body.classList.add("dk-6","lt-1");</script>', f"<style id=\"ux-states\">{css}</style>\n" + '<script>document.body.classList.add("dk-6","lt-1");</script>', 1)
(root / "agentic-setup-cards-states.html").write_text(h)
print("ok", len(h))
