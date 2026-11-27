# DigiConsent complaints prototypes

Three self-contained pages. Open any `.html` file in a browser; nothing to install.

| File | What it is |
|---|---|
| `complaints-brief.html` | New complaints module: home screen, raise a complaint from a screenshot, complaint receipt with the agent animation, complaint history. |
| `complaints-upload.html` | The same module without the demo screenshot chips. Any uploaded image is read as the first demo screenshot (an inbox with 4 messages, or a call log with 3 calls). |
| `complaints-v2.html` | As `complaints-upload.html`, but step 2 is an explicit choice: upload a screenshot or enter the details, with only the chosen one shown. |
| `complaints-dialer.html` | In-app reporting: report a call from the Phone list (swipe left, tap the hand) or a text from Messages, through a bottom tray. Submit only, no receipt. |
| `complaints-v1.html` | The original v1 prototype, unchanged. |

## Changing something

Edit the files in `src/`, then rebuild:

```bash
python3 build.py
```

- `src/app.js`, `src/app.css`: complaint form, receipt, history (shared by both new pages)
- `src/home.js`, `src/home.css`: home screen, from the Consent OS Figma file; its icons and logos are in `src/assets/home/`
- `src/dialer.js`, `src/dialer.css`: Phone and Messages reporting
- `src/vendor/`: the app's compiled stylesheet, React, and demo images

## What is simulated

Screenshot reading, record checks, sender confirmations and all complaint outcomes are demo data in `src/app.js` (`ITEMS`, `buildPlan`, `outcome`, `SEED`). Uploading your own screenshot shows a placeholder item.
