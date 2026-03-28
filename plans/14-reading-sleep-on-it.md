# Reading Lesson: Sleep on It

## Status
DONE

## Goal
Create a new Section 3 reading lesson based on "Sleep on It" (p51-53, IELTS Reading & Writing General Training book). A long general-interest article about sleep deprivation and its consequences — covering disasters caused by drowsiness, cognitive effects, microsleeps, impact on mood and weight, and sleep research. Matching Headings questions.

## Source
- Book: `assets/books/IELTS_Reading_and_Writing_General_ielts.pdf`
- Pages: 51–53
- IELTS section: Section 3 (longer text — general interest article)
- Question types: Matching Headings (Q28–36) — match 11 headings to 9 sections
- Topic: Sleep deprivation — consequences of insufficient sleep including disasters, microsleeps, driving fatigue, mood/weight effects, and sleep research

## Answer Key
Source: Appendix 1, p162 — Practice activity 4.1, Text 1

| Q  | Answer          |
|----|-----------------|
| 28 | section 1–vii   |
| 29 | section 2–viii  |
| 30 | section 3–x    |
| 31 | section 4–ii   |
| 32 | section 5–iii  |
| 33 | section 6–iv   |
| 34 | section 7–ix   |
| 35 | section 8–vi   |
| 36 | section 9–xi   |

## Steps
- [x] Add 9 passage sections to `data/passages.json` (sections 1-9 with Vietnamese translations)
- [x] Add 9 questions + questionTypes meta to `data/questions.json` (Q28-36 matching headings)
- [x] Add 19 vocabulary entries to `data/vocabulary.json` (categories: sleep, health, cognitive)
- [x] Add 10 phrases to `data/phrases.json` (cause-effect, evidence, idiom, argument, advice, analysis)
- [x] Add 10 fill-in-the-blank exercises to `data/fill-blanks.json`
- [x] Add section registry entry to `data/sections.json`
- [x] Create lesson page at `sections/reading/sleep-on-it/index.html`
- [x] Update homepage (`index.html`) — add card + update stats (12 lessons, 273 vocab, 128 phrases)
- [x] Update reading hub (`hubs/reading/index.html`) — add sec-block card

## Design Notes
- First Matching Headings question type in the platform
- Used existing `IELTS_OPTIONS` with Roman numerals (i-xi) — zero changes to `shared/reading.js`
- Heading list displayed in `ieltsInstruction` HTML, matching real IELTS format
- `optsLayout: 'column'` for vertical heading buttons
- Distractors: headings i (Strange behaviour) and v (Making us overweight) are unused
- Summary cards include distractor alert explaining heading v vs ix for Section 7
