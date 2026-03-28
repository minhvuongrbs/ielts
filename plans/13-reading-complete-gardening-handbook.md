# Reading Lesson: The Complete Gardening Handbook

## Status
DONE

## Goal
Create a new Section 1 reading lesson based on "The Complete Gardening Handbook — How to Grow Strawberries" (p25–27, IELTS Reading & Writing General Training book). The passage is an instructional text about growing strawberries, covering planting, routine care, and propagating new plants from runners. Questions use sentence completion format.

## Source
- Book: `assets/books/IELTS_Reading_and_Writing_General_ielts.pdf`
- Pages: 25–27
- Practice activity: 2.3, text 3
- IELTS section: Section 1 (short texts)
- Question types: Sentence Completion — no more than 3 words (Q11–14)
- Topic: Gardening — how to grow strawberries (planting, soil prep, routine care, propagation from runners)

## Answer Key
Source: Appendix 1, p160 — Practice activity 2.3, Text 3

| Q  | Answer                       |
|----|------------------------------|
| 11 | free of disease/disease free |
| 12 | remove all weeds             |
| 13 | (the) fruit clean            |
| 14 | flowers                      |

## Steps
- [x] Create `sections/reading/complete-gardening-handbook/index.html` — lesson page with sentence completion config
- [x] Add passage to `data/passages.json` — full text (intro, planting, routine care, runners) + Vietnamese
- [x] Add `summaryQuestions` meta to `data/questions.json` — 4 sentence completion questions (Q11–14)
- [x] Add `questionTypes` meta to `data/questions.json` — Sentence Completion type info
- [x] Add 15 vocabulary items to `data/vocabulary.json` (planting, care, propagation categories)
- [x] Add 8 phrases to `data/phrases.json`
- [x] Add 10 fill-in-the-blank exercises to `data/fill-blanks.json`
- [x] Register lesson in `data/sections.json`
- [x] Update `shared/reading.js` — handle empty IQ + SQ case in IELTS tab (redirect to passage)
- [x] Add card to homepage `index.html` + update stats (14 lessons, 303 vocab, 144 phrases)
- [x] Add card to reading hub `hubs/reading/index.html`
