# Catan Timer

A timer app for The Settlers of Catan — built as a single-page HTML/JS app with no build step.

## Features

- **Setup Phase** — Forward/backward placement timer for the initial board setup round
- **Play Phase** — Action timer with configurable duration
- **Robust +15s** — Instantly add 15 seconds when the robber is moved
- **Pause / Resume** — Freeze and resume the active timer at any time
- **Back Button** — Return to the previous phase

## Tech Stack

- **Vanilla JavaScript** with ES modules — no framework, no build step
- **Playwright** for end-to-end and unit tests (67 tests total: 35 unit + 32 UI)

## Run Locally

```bash
python3 -m http.server 3123
```

Then open [http://localhost:3123/catan-timer.html](http://localhost:3123/catan-timer.html) in your browser.

## Run Tests

```bash
npm install
npx playwright test
```

## Project Structure

```
catan-timer/
├── catan-timer.html          # Entry point
├── catan-timer.js            # Main app / screen router
├── config.js                 # Configuration constants
├── game-state.js             # Game state machine
├── timer.js                  # Timer UI component
├── timer-logic.js            # Timer logic (countdown, +15s, pause/resume)
├── setup-logic.js            # Setup phase placement logic
├── playwright.config.ts      # Playwright configuration
├── tests/
│   ├── unit/
│   │   ├── config-timer.spec.ts
│   │   ├── game-state.spec.ts
│   │   └── setup-logic.spec.ts
│   └── ui/
│       ├── setup-screen.spec.ts
│       └── play-screen.spec.ts
└── package.json
```
