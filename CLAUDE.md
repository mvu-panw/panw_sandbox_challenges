# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Static multi-page HTML/CSS/JS site for PANW hands-on sandbox challenges. No build tools, no framework, no dependencies — open any `.html` file directly in a browser or serve with any static file server. The visible terms "CTF" and "Capture the Flag" have been fully replaced site-wide with "Sandbox Challenge" (e.g. card labels like "Cortex XSIAM CTF" are now "Cortex XSIAM Sandbox Challenge") — don't reintroduce either term in new user-facing copy.

## Development
```bash
# Serve locally (pick any)
npx serve .
python3 -m http.server 8080
```

## File Map
| File | Purpose |
|---|---|
| `index.html` | Site entry point — grid of demo/sandbox challenges by section. Section order: **AI Security** (top), Prisma / Strata, Cortex. AI Security has three live cards — "Agentic Endpoint Security (AES)" (→ `koi.html`), "Prisma AI Gateway" (→ `prisma-ai-gateway.html`), and "Prisma AIRS API Intercept" (→ `prisma-airs-api-intercept.html`). Prisma / Strata has one live card — "SCM Quantum Safe Security" (→ `scm-quantum-safe-security.html`) — plus the disabled "Prisma Access Sandbox Challenge" placeholder left after removing the old Healthcare CTF and Quantum Security in SCM pages. Cortex is all "Coming Soon" placeholders. The Idira section (a single disabled placeholder card, no linked pages) has been removed. Formerly `menu.html`; the registration gate that used to live at `index.html` has been removed entirely — there is no sign-up step, session, or auth guard anywhere on the site |
| `koi.html` | Live flow step 1 (AES) — page title/heading is "Agentic Endpoint Security Self-Guided Demo" (filename is still `koi.html`, unchanged). Self-guided demo embedding a `launch.paloaltonetworks.com` walkthrough, with an explicit "Open Demo in New Tab" button linking to the same URL; links to `koi-challenge.html` |
| `koi-challenge.html` | Live flow step 2 (AES) — page title/heading is "Agentic Endpoint Security Sandbox Challenge" (filename is still `koi-challenge.html`, unchanged). Instructions + `launch.paloaltonetworks.com` sandbox embed; links out to a dedicated Google Form quiz. No companion guide button |
| `prisma-ai-gateway.html` | Live flow step 1 (Prisma AI Gateway) — same layout as `koi.html`, but the self-guided demo has no embed yet; shows a `.status-center` "not yet available" placeholder instead of an iframe. Links to `prisma-ai-gateway-challenge.html` |
| `prisma-ai-gateway-challenge.html` | Live flow step 2 (Prisma AI Gateway) — same layout as `koi-challenge.html`. Quiz button href is the placeholder `YOUR_QUIZ_FORM_URL_HERE` (no quiz exists yet); embeds the `launch.paloaltonetworks.com/.../jae4ot6fd2kl6sa2wk73is` sandbox with the `aspect-ratio` pattern, plus an explicit "Open Sandbox in New Tab" button linking to the same URL with `target="_blank"` |
| `prisma-airs-api-intercept.html` | Live flow step 1 (Prisma AIRS API Intercept) — same layout as `koi.html`: embeds a `launch.paloaltonetworks.com/.../5kgxlu5ku6646yfod7foje` walkthrough with the `aspect-ratio` pattern plus an "Open Demo in New Tab" button linking to the same URL. Links to `prisma-airs-api-intercept-challenge.html` |
| `prisma-airs-api-intercept-challenge.html` | Live flow step 2 (Prisma AIRS API Intercept) — same layout as `prisma-ai-gateway-challenge.html`, but its quiz button now links to a real Google Form (`.../1FAIpQLSe2yHQDY8uCkIXLAHNqXjajYP40t-T76Y1NcgkqI6pl8X2tzA/viewform`); embeds the `launch.paloaltonetworks.com/.../pbv5xz7siw6x5dkuv2siou` sandbox, plus an "Open Sandbox in New Tab" button linking to the same URL |
| `scm-quantum-safe-security.html` | Live flow step 1 (SCM Quantum Safe Security, under Prisma / Strata) — same layout/placeholder pattern as `prisma-ai-gateway.html`; no self-guided demo embed yet. Links to `scm-quantum-safe-security-challenge.html` |
| `scm-quantum-safe-security-challenge.html` | Live flow step 2 (SCM Quantum Safe Security) — same layout as `prisma-ai-gateway-challenge.html`. Quiz button href is the placeholder `YOUR_QUIZ_FORM_URL_HERE` (no quiz exists yet); embeds the `launch.paloaltonetworks.com/.../fbou2evq6pq3lbyqjiaalp` sandbox, plus an "Open Sandbox in New Tab" button linking to the same URL |
| `demo.html`, `companion.html`, `quiz.html` | Orphaned legacy flow — not linked from `index.html` or `koi.html`/`koi-challenge.html`; only reachable by direct URL or from each other. Keep in mind before editing: changes here don't affect what participants actually see |
| `assets/css/styles.css` | All styles — PANW Prisma AIRS color scheme. Still contains rules for the removed registration form (`.form-group`, `.form-note`, etc.) that are now unused |
| `ctf_page_outline.md`, `storylane.md` | Original planning/spec docs (page-by-page outline, Storylane value prop). Describe the old registration-gated flow and are now out of sync with the site — treat the HTML as source of truth over these |
| `assets/images/` | Product logos (Prisma/Strata/Cortex family) used in `index.html` cards and navbars |

## Deployment
There is no CI/CD config in the repo (a `.gitlab-ci.yml` for GitLab Pages existed briefly but was deleted in the "Rework site as PANW Sandbox Challenges" commit). The repo has two remotes — `origin` (GitLab, `code.pan.run/mvu/capture-the-flag-page`) and `github` (`github.com/mvu-panw/panw_sandbox_challenges`) — with no automated publish step on either as of this writing; confirm with the user how/where the site is actually served before assuming a push auto-deploys it.

## Configuration
**`companion.html`** — `YOUR_GOOGLE_DOC_EMBED_URL_HERE` in the `<iframe src>` still needs a real Google Docs publish URL (File → Share → Publish to web → Embed). It's part of the orphaned legacy flow now, not linked from anywhere live.

## Key Behaviors
- **No registration or auth gate**: the site used to require registering a name/email (stored in `sessionStorage`) before any other page would load. That whole flow — the registration form, `assets/js/registration.js`, `not-registered.html`, and the `sessionStorage.registeredName` guard script at the bottom of every gated page's `<body>` — has been removed. Every page is directly reachable; `index.html` (the old `menu.html`) is the effective home page since it's the file any static host will serve at the root (see Deployment below for how/whether this is currently published).
- **Prisma AIRS Healthcare CTF and the old Quantum Security in SCM page were removed**: `ctf.html`, `ctf-challenge.html`, and the original `quantum-security.html`/`quantum-security-challenge.html` are deleted, along with their cards on `index.html`. The Prisma/Strata section was later given a new live card, "SCM Quantum Safe Security" (`scm-quantum-safe-security.html`/`-challenge.html`) — a different, unrelated challenge despite the similar name — alongside the still-disabled "Prisma Access Sandbox Challenge" placeholder.
- **Nav corner branding**: the top-left nav shows the `panw_RGB_Logo_Negative.png` wordmark (white, for the nav's dark background — not `panw_logo.png`, which is black-on-transparent and used elsewhere, e.g. favicons) next to the site-title text "Sandbox Challenges" — no "PANW" prefix. `nav img.logo` is sized by `height: 42px` only (no fixed width, scales with aspect ratio); `nav .site-title` is `font-size: 1.37rem` with `margin-left: 16px` for breathing room next to the wide wordmark. Both were bumped +30% from their original 32px/1.05rem — keep them proportional if adjusting further.
- **Non-Storylane embeds size themselves with the `aspect-ratio` CSS property directly on the `<iframe>`** (`koi.html`, `koi-challenge.html`), not the `padding-bottom` percentage hack used for the orphaned Storylane embed in `demo.html`. The percentage-padding trick caused visible flicker with the `launch.paloaltonetworks.com` embeds, so don't copy it forward for new `launch.paloaltonetworks.com` pages — copy the `aspect-ratio` pattern instead.
- **No shared templating**: navbar/footer markup is duplicated in every HTML file (per the root `CLAUDE.md` convention) — a layout change means editing every page individually, and it's easy to miss one (e.g. `demo.html` isn't in `index.html`'s nav the way the other pages are).
