---
name: add-reading-lesson
description: Add a new reading lesson TODO from the IELTS Reading & Writing GT book
---

# Add Reading Lesson TODO

Add a new reading lesson TODO item from `docs/books/IELTS_Reading_and_Writing_General_ielts.pdf`.

The user will provide a page number and/or passage title. This skill reads the book pages, extracts the key info, and creates a well-structured plan file + README entry.

## Steps

1. **Read the book pages** — Use the Read tool with the `pages` parameter on `docs/books/IELTS_Reading_and_Writing_General_ielts.pdf` to read the passage and questions. Read 3-5 pages starting from the given page to capture the full text + questions.

1b. **Read the answer key** — Read `pages "158-168"` from the same book (Appendix 1: Answer Key). Find the matching Practice Activity and Text number to extract the correct answers for this lesson's questions.

2. **Extract lesson metadata** from the pages:
   - **Title**: the passage title (e.g., "On the City Doorstep")
   - **IELTS Section**: which GT Reading section it belongs to (Section 1 = short texts, Section 2 = workplace/general, Section 3 = long passage)
   - **Question types**: identify the IELTS question types used (Matching Information, True/False/Not Given, Multiple Choice, Short Answer, etc.)
   - **Question numbers**: the question range (e.g., Q1-5, Q6-10)
   - **Page range**: the pages in the book
   - **Topic/theme**: brief topic summary

3. **Determine the next plan number** by reading `plans/README.md` and finding the highest existing number prefix

4. **Create the plan file** at `plans/<NN>-reading-<slug>.md`:

```markdown
# Reading Lesson: <Title>

## Status
TODO

## Goal
Create a new Section <N> reading lesson based on "<Title>" (p<pages>, IELTS Reading & Writing General Training book). <Brief description of the passage content and question types>.

## Source
- Book: `docs/books/IELTS_Reading_and_Writing_General_ielts.pdf`
- Pages: <page range>
- IELTS section: Section <N> (<section description>)
- Question types: <list of question types with question numbers>
- Topic: <topic/theme>

## Answer Key
Source: Appendix 1, p<page> — Practice activity <X.Y>, Text <N>

| Q  | Answer |
|----|--------|
| <n> | <answer> |

## Steps
- [ ] (to be filled in when working on this item)
```

5. **Append** to `plans/README.md`:
   `- [ ] [Reading: <Title>](<NN>-reading-<slug>.md) — Section <N> reading lesson: <brief description>`

## Reading Lesson Architecture

Reading lessons use shared files: `shared/reading.css` (all CSS) + `shared/reading.js` (HTML template + JS logic) + `shared/lesson.js` (vocab, flashcard, etc.).

Each lesson's `index.html` is ~60 lines:
1. Set `CAT_LABELS` and `IELTS_OPTIONS` globals
2. Include `lesson.js` + `reading.js`
3. Call `renderReadingPage(config)` with lesson-specific config
4. Fetch `data.json` and call `initReading(data)`

**Reference template**: `sections/reading/bees-neez/index.html`

**Config options for `renderReadingPage()`**:
- `title`, `sub` — header text
- `passageRight`: `'ielts'` (T/F/NG or matching), `'summary-q'` (fill-in-blank), `'none'`
- `passageLabel`, `passageInstruction` — for passage-side quiz header
- `ieltsInstruction` — instruction text above the main IELTS quiz tab
- `optsLayout`: `'wrap'` (default, horizontal) or `'column'` (vertical, for multiple choice)
- `stPreline`: `true` for pre-formatted passage text
- `summaryCards` — HTML string for the Summary tab

**IELTS_OPTIONS values**:
- T/F/NG: `['TRUE','FALSE','NOT GIVEN']`
- Letter matching: `['A','B','C',...]`
- Multiple choice: `null` (uses per-question `q.options`)

## Section Content Patterns

When **implementing** a reading lesson (not just creating the TODO), follow these content patterns based on the IELTS section. Reference existing lessons for the exact data.json structure.

### Section 1 — Short texts (ads, notices, leaflets)
- **Passage**: Short, 1–3 paragraphs or structured info (no lettered sections typically, or short labeled items A–G for matching)
- **Vocabulary**: ~10–15 words, simpler, practical (everyday/functional English)
- **Question types**: Usually True/False/Not Given, Matching Information, or Sentence Completion
- **ieltsQuestions format** (T/F/NG): `{"n": 6, "t": "statement text", "a": "true|false|not given", "vi": "explanation", "en": "explanation"}`
- **ieltsQuestions format** (Matching): `{"n": 1, "t": "statement", "a": "B", "vi": "...", "en": "..."}`
- **Phrases**: ~8–12, practical/functional phrases from the text
- **Fill blanks**: ~8–10, from vocabulary
- Reference: `sections/reading/bees-neez/` (Section 1, T/F/NG)

### Section 2 — Workplace/education (medium-length texts)
- **Passage**: Medium length, often with lettered sections (A–G) covering advice, instructions, or information
- **Vocabulary**: ~15–20 words, workplace/education register
- **Question types**: Usually Matching Headings, T/F/NG, or Sentence Completion
- **ieltsQuestions format** (Matching Headings): `{"n": 15, "t": "heading text", "a": "A", "vi": "...", "en": "..."}`
  - Include the full list of heading options (i–ix etc.) in `questionTypes.active` description
- **Phrases**: ~10–15, useful for IELTS Writing/Speaking
- **Fill blanks**: ~10–12
- Reference: `sections/reading/happiness/` structure is similar (lettered sections + matching)

### Section 3 — Long passage (general interest article)
- **Passage**: Long article with lettered sections (A–M), academic/journalistic tone
- **Vocabulary**: ~20–25 words, more advanced, categorized (e.g., "research", "brain", "social")
- **Question types**: Multiple Choice, Matching Information, Summary Completion, Matching Headings
- **ieltsQuestions format** (Multiple Choice): `{"n": 35, "t": "question", "options": [{"v": "A", "t": "option"}...], "a": "C", "vi": "...", "en": "..."}`
- **summaryQuestions** (if applicable): grouped fill-in-the-blank summaries with `parts` array
- **Phrases**: ~15–18, more academic/formal
- **Fill blanks**: ~12–15
- **questionTypes**: Include `active` (types in this lesson) + `allTypes` (all 11 IELTS types checklist)
- Reference: `sections/reading/video-games/` (Section 3, Multiple Choice + Summary)