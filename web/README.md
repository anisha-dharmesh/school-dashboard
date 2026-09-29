# III F Notice Board — frontend

React + TypeScript + Vite app for the dashboard. Deployed to GitHub Pages by
`.github/workflows/scrape.yml`, which builds this app and copies `../docs/*.json`
(scraper output) plus `../docs/study/**/*.json` (hand-authored
study chapters) into `dist/data/` so the app can fetch them at runtime.

## Local development

```bash
npm install
npm run dev
```

`predev` copies `../docs/*.json` into `public/data/` first, so the dev
server serves real data without needing CI. Re-run `npm run predev` (or
just restart `npm run dev`) after the scraper updates `../docs/*.json`.

## Adding a study chapter

No code change needed — add `../docs/study/<subject-slug>/<chapter-slug>.json`
(`StudyChapter` in `src/study/types.ts`: plain-text sections, each with a
`type` such as `fib`, `trueFalse`, `mcq`, `qa`), add any images under
`public/`, then run `python3 build_study_index.py` from the repo root to
refresh `docs/study/index.json`. The `tests` array labels the exams a chapter
belongs to (e.g. `"Half Yearly"`, `"PT-1"`, `"Class Test"`); the Notes and
Upcoming tabs link to it from those labels and from the chapter name.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — typecheck + production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — oxlint
