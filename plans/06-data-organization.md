# Data Organization

## Status
TODO

## Goal
Evaluate and reorganize data files into a domain-oriented structure. Currently each `data.json` lives alongside its lesson HTML. Consider isolating data into a dedicated `data/` folder (organized by domain/skill) to improve maintainability and enable cross-lesson features like shared vocabulary, phrase aggregation, and search.

## Context
Current data files:
- `lessons/form-completion/data.json`
- `lessons/sentence-completion/data.json`
- `listening/map-labeling/data.json`
- `reading/happiness/data.json`
- `reading/video-games/data.json`
- `reading/skills/data.json`

## Steps
- [ ] Decide on folder structure (e.g., `data/reading/`, `data/listening/`, `data/shared/`)
- [ ] Evaluate impact on existing `fetch('data.json')` calls in lesson pages
- [ ] Determine if shared data (cross-lesson vocab, phrase bank) justifies the move
- [ ] Migrate data files and update all fetch paths
- [ ] Update CLAUDE.md project structure docs