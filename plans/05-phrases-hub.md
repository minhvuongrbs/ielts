# Phrases Hub Page

## Status
Done

## Goal
Build a dedicated page where learners can study and practice useful phrases collected from all lessons in one place.

## Steps
- [x] Create `hubs/phrases/index.html` with data aggregation from all 5 lessons (78 phrases)
- [x] Add 2-level filter UI: lesson name, category — with cascading updates
- [x] Render phrase cards using shared `.ph-*` CSS classes with skill/lesson badges
- [x] Add flashcard mode: 3D flip card (front: phrase, back: Vietnamese + usage + example), self-grade (Know It / Still Learning), shuffle, prev/next navigation, end-of-deck results
- [x] Include `speak()` audio on phrase examples
- [x] Add "Phrases" nav link to `shared/nav.js`
- [x] Add Phrases section + "78 Phrases" stat to homepage `index.html`
- [x] Update `CLAUDE.md` project structure with `hubs/phrases/`

## Architecture
- Follows quiz hub aggregation pattern: `LESSONS` array → `Promise.all` fetch → flatten `usefulPhrases` with `_lesson`/`_skill` metadata
- Two modes: Browse (tap-to-reveal phrase cards) and Flashcards (3D flip with self-grading)
- Filters: lesson + category with AND logic and cascading updates
- Reuses all `.ph-*` card styles from `shared/styles.css`

## Design Decisions
- Removed skill filter (lesson filter is sufficient, skill badges shown on cards)
- Chose flashcards over fill-in-the-blank quiz — phrases contain templates (`X`, `Y`, `...`, `/alternatives`) that don't work well for typed answers. Flashcards are simpler and more effective for phrase memorization.