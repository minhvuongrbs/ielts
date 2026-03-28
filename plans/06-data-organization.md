# Data Organization

## Status
In Progress

## Goal
Create a dedicated data layer with table-based storage (`data/` folder) and a unified access API (`shared/data.js`). Data is organized like database tables — one file per entity type, all records tagged with `skill` + `section`. The access layer abstracts fetching, caching, filtering, and assembly so the JSON backend can later be swapped for a database/API.

## Data Tables (`data/`)
- `sections.json` — 8 records — lesson registry
- `vocabulary.json` — 219 records — all vocab across all lessons
- `phrases.json` — 102 records — all useful phrases
- `fill-blanks.json` — 100 records — all fill-in-the-blank exercises
- `passages.json` — 33 records — all reading passage sections
- `questions.json` — 35 records — IELTS questions + metadata
- `intros.json` — 3 records — listening lesson introductions
- `visual-vocab.json` — 17 records — listening visual/spatial vocabulary
- `practice.json` — 2 records — listening practice questions

## Steps
- [x] Create `data/` folder with table files (split from 8 data.json files)
- [x] Create `shared/data.js` — IIFE with DataLayer API (getLesson, getVocabulary, getPhrases, etc.)
- [x] Migrate Quiz Hub to use DataLayer
- [x] Migrate Phrases Hub to use DataLayer
- [x] Migrate 5 reading lesson pages to use DataLayer.getLesson()
- [x] Migrate 3 listening lesson pages to use DataLayer.getLesson()
- [x] Update CLAUDE.md project structure docs
- [ ] Delete old `sections/{skill}/{lesson}/data.json` files
- [ ] Delete `shared/lessons.js`
- [ ] Test all pages end-to-end in browser
