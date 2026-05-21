# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Static multi-page HTML/CSS/JS site for a "PANW Capture the Flags" event. No build tools, no framework, no dependencies — open any `.html` file directly in a browser or serve with any static file server.

## Development
```bash
# Serve locally (pick any)
npx serve .
python3 -m http.server 8080
```

## File Map
| File | Purpose |
|---|---|
| `index.html` | Registration — collects name+email, sets session, redirects to menu |
| `menu.html` | Grid of available CTF challenges |
| `ctf.html` | Storylane self-guided demo embed with links to companion/quiz |
| `ctf-challenge.html` | Alternate CTF page — inline instructions + Storylane CTF sandbox embed |
| `companion.html` | Google Doc companion guide embed |
| `quiz.html` | Google Form quiz embed |
| `scoreboard.html` | Live ranked table from Google Form responses via Apps Script |
| `not-registered.html` | Shown when registration fails |
| `storylane-value-prop.html` | Static info page about Storylane (no auth guard) |
| `assets/css/styles.css` | All styles — PANW Prisma AIRS color scheme |
| `assets/js/registration.js` | Form submit handler → Apps Script lookup → sessionStorage |
| `assets/js/scoreboard.js` | Fetches scores from Apps Script, parses and renders ranked table |

## Configuration
Both JS files share a single constant — `APPS_SCRIPT_URL` — pointing to a deployed Google Apps Script Web App:

- **`assets/js/registration.js`** — calls the script to validate name+email against a pre-approved list
- **`assets/js/scoreboard.js`** — calls the same script with `?action=scores` to fetch quiz responses

To redeploy or swap the script: go to script.google.com → Deploy → New deployment → Web app → Execute as: Me → Access: Anyone → copy the URL into both files.

**`companion.html`** — `YOUR_GOOGLE_DOC_EMBED_URL_HERE` in the `<iframe src>` still needs a real Google Docs publish URL (File → Share → Publish to web → Embed).

## Key Behaviors
- **Auth guard**: every page except `index.html`, `not-registered.html`, and `storylane-value-prop.html` checks `sessionStorage.registeredName` and redirects to `index.html` if missing. The guard is an inline `<script>` at the bottom of each `<body>`.
- **Registration**: validation against the Apps Script is currently bypassed — any name/email is accepted and stored in `sessionStorage.registeredName`. Re-enable by uncommenting the fetch call in `registration.js`.
- **Scoreboard scoring**: `parseScore()` handles `"8 / 10"`, `"8/10"`, or raw numeric values; normalizes to a 0–100 percentage. Ties broken by earliest submission timestamp. Refreshes every 60 seconds.
- **Session scope**: `sessionStorage` clears when the tab is closed — intentional, so each session requires fresh registration.
