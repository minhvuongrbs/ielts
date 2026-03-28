# Vocab Category Audit

**Status:** Done

## Goal
Every vocabulary item across all `data.json` files should have a `cat` (category) field with semantic categories. Replace section-based `s` fields in reading lessons with meaningful `cat` values, matching the pattern used in listening lessons.

## Current State

**Already complete (no changes needed):**
- `listening/map-labeling/data.json` — 52 items, 100% have `cat`
- `lessons/form-completion/data.json` — 37 items, 100% have `cat`
- `lessons/sentence-completion/data.json` — 26 items, 100% have `cat`

**Needs work:**
- `reading/happiness/data.json` — 28 vocab items with `s`, 18 phrases with `section`
- `reading/video-games/data.json` — 25 vocab items with `s`, 18 phrases with `section`

## Checklist

### - [x] Step 1: Update `reading/happiness/data.json`
- Replace `s` with `cat` on all 28 vocab items using semantic categories:
  - `mindset` (9): traits, handle, attitude, interpret, grateful, forgiving, distinguishes, differentiates, voluntary
  - `research` (10): variables, contribution, necessarily, implications, determining, set-point, genes, equation, significant, proportion
  - `lifestyle` (9): whereas, physically attractive, gadgets, superficial, poverty line, unemployed, dramatic, circumstances, mansions
- Replace `section` with `cat` on all 18 usefulPhrases using categories:
  - `contrast` — phrases about comparing/contrasting
  - `evidence` — phrases citing research/facts
  - `analysis` — phrases for analyzing/distinguishing
  - `argument` — phrases for building arguments

### - [x] Step 2: Update `reading/video-games/data.json`
- Replace `s` with `cat` on all 25 vocab items:
  - `brain` (7): psychological, cognitive, malleable, cortex, integration, visual acuity, spatial perception
  - `learning` (10): boost, ideal, persist, adaptively, demanding, stunningly, potential, increasingly, efficient, multitasking
  - `research` (4): legitimate, emeritus, administered, subsequently
  - `social` (4): prosocial, antisocial, double-edged sword, virtuous, immense
- Replace `section` with `cat` on usefulPhrases with semantic categories

### - [x] Step 3: Update `reading/happiness/index.html`
- Add `CAT_LABELS` constant mapping cat values to emoji labels
- Update inline `renderVocab()` to filter by `v.cat` instead of `v.s`
- Update inline `renderVF()` to read `v.cat` and use `CAT_LABELS`
- Update vocab card template to show `CAT_LABELS[v.cat]` instead of `v.s`
- Update `renderPhrases()` to use `p.cat` instead of `p.section`

### - [x] Step 4: Update `reading/video-games/index.html`
- Same code changes as happiness page (CAT_LABELS, renderVocab, renderVF, renderPhrases)

## Files to modify
1. `reading/happiness/data.json`
2. `reading/video-games/data.json`
3. `reading/happiness/index.html`
4. `reading/video-games/index.html`

## Verification
- Run `python3 -m http.server 8080` and check both reading lessons
- Verify vocab filter buttons show category labels (not section letters)
- Verify vocab cards show category tags
- Verify phrase cards render correctly
- Verify flashcards, fill-blanks, and matching still work (they don't use `s` or `cat`)