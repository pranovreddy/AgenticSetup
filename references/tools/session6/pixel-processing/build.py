# Builds agentic-processing-pixels.html from src.html, injecting the rail logo from the C2P2 prototype.
import re, pathlib
root = pathlib.Path(__file__).resolve().parents[4]
src = (pathlib.Path(__file__).parent / "src.html").read_text()
logo = re.search(r'data:image/png;base64,[A-Za-z0-9+/=]+', (root / "agentic-setup-C2P2.html").read_text()).group(0)
(root / "agentic-processing-pixels.html").write_text(src.replace("__LOGO__", logo))
