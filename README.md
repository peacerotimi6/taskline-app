# Star Dash

A Vite + React browser game with a Tailwind-powered UI shell, ready for cloud deployment.

## Local Run

```bash
npm install
npm run dev
```

The dev server binds to `0.0.0.0` and uses:
- `PORT` if provided
- otherwise `VITE_PORT`
- otherwise `5173`

Example:

```bash
PORT=3000 npm run dev
```

## Port Guide

- Local development uses `npm run dev`, which typically runs on `5173`.
- Production/server mode uses `npm start`, which reads `PORT`.
- On the VM workflow, the app is forced to run on `8080`.

Example VM/production command:
```bash
PORT=8080 npm start
```

## Production

```bash
npm run build
PORT=8080 npm start
```

`npm start` serves the built `dist/` app and binds to `process.env.PORT` (default `8080`), which works for Azure Web App, GCP, and AWS setups that inject a port.

## UI Stack

- React 18
- Vite 5
- Tailwind CSS 4 via `@tailwindcss/vite`
- Canvas-based game rendering in `src/renderer.js`

For Azure ZIP deploys on Linux, set:
- startup command: `bash startup.sh`
- app setting: `SCM_DO_BUILD_DURING_DEPLOYMENT=true`
- runtime stack: Node 20 LTS or newer

For Azure Windows App Service, keep `web.config` at the app root.

## App Env Variables

Only one app-specific env var is still used by the current UI:
- `APP_TITLE`

Runtime behavior:
- `APP_TITLE` updates browser tab title and app heading.

Allowed values:
- `APP_TITLE`: any text

Local/dev fallback (optional):
- `VITE_APP_TITLE`

## Cloud Deploy Presets

Deployment starter files are in:
- `deploy/azure`
- `deploy/gcp`
- `deploy/aws`

## Controls

- Move: mouse/touch/trackpad, `ArrowLeft`/`ArrowRight`, or `A`/`D`
- Session controls: `Pause`, `Resume`, `Restart`, `Special`

Collect blue stars for points, avoid red bombs, and survive until time runs out.

Green power-up orbs grant a temporary shield that blocks bomb damage.

Scoring:
- Stars build a combo.
- Higher combo increases score multiplier.
- Bomb hits or combo timeout reset combo.
- Power-ups also add bonus points.
- Gold stars grant extra points.

## Product Features

- Level progression and dynamic difficulty scaling during runs.
- Win/loss session outcomes with pause overlay.
- Pause/resume/restart controls.
- Live score, best score, level, lives, timer, and special cooldown display.
- Best score tracking in-game.
- Boss wave encounter every 4 levels (defeat target before timer expires).
- Special Pulse ability with cooldown.
- Multiple power-up types: Shield, Freeze, and Rush.
