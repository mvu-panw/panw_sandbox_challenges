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
| `menu.html` | Grid of CTF/demo challenges by product family (Prisma/Strata, Cortex, Koi, Idira). "Prisma AIRS Healthcare CTF", "Koi", and "Quantum Security in SCM" cards are live; the rest are disabled "Coming Soon" placeholders |
| `ctf.html` | Live flow step 1 (Healthcare CTF) — Storylane self-guided demo, links to `ctf-challenge.html` |
| `ctf-challenge.html` | Live flow step 2 (Healthcare CTF) — instructions + Storylane CTF sandbox embed; links straight out to the Google Doc companion guide and Google Form quiz (external URLs, not `companion.html`/`quiz.html`) |
| `koi.html` | Live flow step 1 (Koi CTF) — self-guided demo embedding a `launch.paloaltonetworks.com` walkthrough (not Storylane), links to `koi-challenge.html` |
| `koi-challenge.html` | Live flow step 2 (Koi CTF) — instructions + `launch.paloaltonetworks.com` CTF sandbox embed; links out to a dedicated Google Form quiz. No companion guide button (Koi has none) |
| `quantum-security.html` | Live flow step 1 (Strata Cloud Manager CTF) — self-guided demo embedding a `launch.paloaltonetworks.com` walkthrough, links to `quantum-security-challenge.html`. Same pattern as `koi.html` |
| `quantum-security-challenge.html` | Live flow step 2 (Strata Cloud Manager CTF) — instructions + `launch.paloaltonetworks.com` CTF sandbox embed; links out to a dedicated Google Form quiz. Same pattern as `koi-challenge.html` |
| `demo.html`, `companion.html`, `quiz.html` | Orphaned legacy flow — not linked from `menu.html` or the live CTF pages; only reachable by direct URL or from each other. Keep in mind before editing: changes here don't affect what participants actually see |
| `scoreboard.html` | Live ranked table from Google Form responses via Apps Script |
| `not-registered.html` | Shown when registration fails (no auth guard — reachable pre-session) |
| `assets/css/styles.css` | All styles — PANW Prisma AIRS color scheme |
| `assets/js/registration.js` | Form submit handler → (currently bypassed) Apps Script lookup → sessionStorage |
| `assets/js/scoreboard.js` | Fetches scores from Apps Script, parses and renders ranked table |
| `.gitlab-ci.yml` | GitLab Pages deploy — on push to `main`, copies the whole repo into a `public/` artifact and publishes it. No build step, so anything in the repo root gets deployed as-is |

## Configuration
Both JS files share a single constant — `APPS_SCRIPT_URL` — pointing to a deployed Google Apps Script Web App:

- **`assets/js/registration.js`** — calls the script to validate name+email against a pre-approved list
- **`assets/js/scoreboard.js`** — calls the same script with `?action=scores` to fetch quiz responses

To redeploy or swap the script: go to script.google.com → Deploy → New deployment → Web app → Execute as: Me → Access: Anyone → copy the URL into both files.

**`companion.html`** — `YOUR_GOOGLE_DOC_EMBED_URL_HERE` in the `<iframe src>` still needs a real Google Docs publish URL (File → Share → Publish to web → Embed). Moot for the live flow since `ctf-challenge.html` links to the doc directly instead.

## Key Behaviors
- **Auth guard is inconsistently applied** — don't assume every gated page has it. `menu.html`, `ctf.html`, `ctf-challenge.html`, `koi.html`, `koi-challenge.html`, `quantum-security.html`, `quantum-security-challenge.html`, `scoreboard.html`, and `demo.html` check `sessionStorage.registeredName` (inline `<script>` at the bottom of `<body>`) and redirect to `index.html` if missing. `companion.html` and `quiz.html` currently have **no** guard, despite being conceptually "post-registration" pages — check before relying on the doc comment in the root `CLAUDE.md` files, which describes the intended pattern, not this exception.
- **Non-Storylane embeds size themselves with the `aspect-ratio` CSS property directly on the `<iframe>`** (`koi.html`, `koi-challenge.html`, `quantum-security.html`, `quantum-security-challenge.html`), not the `padding-bottom` percentage hack used for the Storylane embeds in `ctf.html`/`ctf-challenge.html`. The percentage-padding trick caused visible flicker with the `launch.paloaltonetworks.com` embeds, so don't copy it forward for new `launch.paloaltonetworks.com` pages — copy the `aspect-ratio` pattern instead.
- **Registration**: validation against the Apps Script is currently bypassed in `registration.js` — any name/email is accepted and stored in `sessionStorage.registeredName`. Re-enable by uncommenting the fetch call.
- **Scoreboard scoring**: `parseScore()` in `scoreboard.js` handles `"8 / 10"`, `"8/10"`, or raw numeric values; normalizes to a 0–100 percentage. Ties broken by earliest submission timestamp. Refreshes every 60 seconds via `setInterval`.
- **Session scope**: `sessionStorage` clears when the tab is closed — intentional, so each session requires fresh registration.
- **No shared templating**: navbar/footer markup is duplicated in every HTML file (per the root `CLAUDE.md` convention) — a layout change means editing every page individually, and it's easy to miss one (e.g. `demo.html` isn't in `menu.html`'s nav the way the other pages are).
