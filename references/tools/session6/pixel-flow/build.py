# Builds agentic-setup-pixels.html (full journey, dark) and agentic-setup-pixels-light.html (same page, light theme) from src.html: injects the rail logo
# from agentic-setup-C2P2.html and the two agreements (docs.json, taken from the final cards file).
import re, pathlib
here = pathlib.Path(__file__).parent
root = here.parents[3]
src = (here / "src.html").read_text()
logo = re.search(r'data:image/png;base64,[A-Za-z0-9+/=]+', (root / "agentic-setup-C2P2.html").read_text()).group(0)
docs = (here / "docs.json").read_text().replace("</", "<\\/")
# the HDFC Bank logo image used by the earlier prototypes
hdfc = re.search(r'HDFC_LOGO\s*=\s*"([^"]+)"', (root / "agentic-setup-final-approach-cards-critique-fixes.html").read_text()).group(1)
full = src.replace("__LOGO__", logo).replace("__DOCS__", docs).replace("__HDFC__", hdfc)
# The look is chosen by data-px (set by a script at the top of the page and on <html>), never by data-theme:
# the artifact viewer sets data-theme itself, which used to turn every page light or deep blue.
def page(theme, title):
    out = full.replace("__PXT__", theme)
    if theme: out = out.replace('<html lang="en">', '<html lang="en" data-px="%s">' % theme)
    return out.replace("<title>Agentic Setup Pixels</title>", "<title>%s</title>" % title)
(root / "agentic-setup-pixels.html").write_text(page("", "Agentic Setup Pixels"))
# light version: same page, data-px="light" switches the field, triangles and the pieces that sit on it
(root / "agentic-setup-pixels-light.html").write_text(page("light", "Agentic Setup Pixels Light"))
# azure version: a brighter blue field than the original deep blue
(root / "agentic-setup-pixels-azure.html").write_text(page("azure", "Agentic Setup Pixels Azure"))
# intelligence version: a fork (src-intelligence.html) of the deep-blue page with a visible agent core and reasoning trace
ifull = (here / "src-intelligence.html").read_text().replace("__LOADERJS__", (here / "loader.js").read_text()).replace("__LOGO__", logo).replace("__DOCS__", docs).replace("__HDFC__", hdfc).replace("__PXT__", "")
(root / "agentic-setup-pixels-intelligence.html").write_text(ifull)
