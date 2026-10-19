# Builds agentic-setup-pixels.html (full journey) from src.html: injects the rail logo
# from agentic-setup-C2P2.html and the two agreements (docs.json, taken from the final cards file).
import re, pathlib
here = pathlib.Path(__file__).parent
root = here.parents[3]
src = (here / "src.html").read_text()
logo = re.search(r'data:image/png;base64,[A-Za-z0-9+/=]+', (root / "agentic-setup-C2P2.html").read_text()).group(0)
docs = (here / "docs.json").read_text().replace("</", "<\\/")
# the HDFC Bank logo image used by the earlier prototypes
hdfc = re.search(r'HDFC_LOGO\s*=\s*"([^"]+)"', (root / "agentic-setup-final-approach-cards-critique-fixes.html").read_text()).group(1)
(root / "agentic-setup-pixels.html").write_text(src.replace("__LOGO__", logo).replace("__DOCS__", docs).replace("__HDFC__", hdfc))
