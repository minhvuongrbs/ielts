# IELTS Hub — Claude Context

## Project Overview
- **What:** Interactive IELTS General Training practice platform
- **Target:** Band 5.5–6.0
- **Bilingual:** English (primary UI) + Vietnamese (translations, revealed on tap)
- **Tech:** Vanilla HTML/CSS/JS — no frameworks, no build system
- **Hosting:** GitHub Pages (auto-deploys on push to `master`)
- **Live URL:** https://minhvuongrbs.github.io/ielts/

## Development
- **Local server:** `python3 -m http.server 8080` from project root
- **Preview config:** `.claude/launch.json` (server name: `ielts-hub`, port 8080)
- **CRITICAL:** All paths must be **relative** (not absolute `/`) for GitHub Pages compatibility
- **Reference materials** (organized by type):
  - `docs/books/IELTS_Reading_and_Writing_General_ielts.pdf` — GT Reading & Writing practice tests
  - `docs/books/Mindset for IELTS Level 1 Student_s Book.pdf` — Mindset for IELTS Level 1 (Foundation/Band 5.5–6.0)
  - `docs/audio/` — Listening test audio files (MP3)

## Project Structure
```
index.html                          # Homepage — skill sections + stats + lesson cards
shared/
  styles.css                        # ALL shared CSS: variables, fonts, nav, lesson components
  nav.js                            # Dynamic nav injection (single source of truth)
  data.js                           # Data access layer — abstracts all data fetching/caching
  lesson.js                         # Shared lesson JS: IPA, vocab, flashcard, fill-blank, match
  reading.css                       # Reading lesson CSS: passage, quiz, flashcard, match, phrases
  reading.js                        # Reading lesson JS: HTML template, IELTS quiz, passage, init
  listening.css                     # Listening lesson CSS: form, sentence, visual vocab practice types
  listening.js                      # Listening lesson JS: HTML template, normalize(), initListening()
data/                               # Flat table files (like database tables)
  sections.json                     # Lesson registry — all lessons with skill + section slug
  vocabulary.json                   # All vocabulary across all lessons
  phrases.json                      # All useful phrases
  fill-blanks.json                  # All fill-in-the-blank exercises
  passages.json                     # All reading passage sections
  questions.json                    # All IELTS questions + metadata
  intros.json                       # Listening lesson introductions
  visual-vocab.json                 # Listening visual/spatial vocabulary
  practice.json                     # Listening practice questions
docs/
  books/                            # Reference PDFs
  audio/                            # Listening test MP3s
sections/                           # ALL lessons — organized by skill (HTML only, data in data/)
  listening/
    form-completion/                # S1: Form completion (Furniture Ordering)
    map-labeling/                   # S2: Map & plan labeling
    sentence-completion/            # S2: Sentence completion (Marathon Tips)
  reading/
    happiness/                      # S3: What is Happiness?
    video-games/                    # S3: How Video Games Are Good for the Brain
hubs/                               # ALL hub/index pages — organized by skill
  listening/index.html              # Listening hub — section-organized (S1–S4)
  reading/
    index.html                      # Reading hub — section-organized (S1, S2, S3)
    skills/                         # Skills guide (not a section lesson)
  writing/index.html                # Coming soon placeholder
  speaking/index.html               # Coming soon placeholder
  quiz/index.html                   # Vocabulary quiz hub
  phrases/index.html                # Phrases hub — browse & practice all phrases
  revision/index.html               # Revision hub — mock tests
```

### Lesson location (`sections/`)
- ALL lessons live in `sections/<skill>/<lesson>/` — this is the single source of truth
- Skill hubs, revision hub, quiz, and homepage all link to `sections/<skill>/<lesson>/`
- Lessons at depth=3: use `../../../shared/` and `data-depth="3"` on `<body>`
- Exception: `hubs/reading/skills/` stays in the reading hub folder (it's a skills guide, not a section lesson)

### Revision structure (`hubs/revision/`)
- Revision = collection of mock tests (Revision 1, Revision 2, etc.)
- Each revision groups lesson cards by skill (e.g., Listening → Section 1, Section 2)
- Uses `.rev-block` container with `.rev-skill` sub-sections
- Cards link to `../../sections/<skill>/<lesson>/` — same lessons as skill hubs
- Color: `--revision: #7a6cc4` (purple)

## Architecture — Follow When Creating New Lessons

### 1. Lesson = folder with `index.html` (data lives in `data/`)
- All lesson content (vocabulary, phrases, passages, questions) lives in flat table files under `data/`
- Each record in a table file has `skill` + `section` fields to identify which lesson it belongs to
- `index.html` uses `DataLayer.getLesson(skill, section)` to fetch and assemble data
- Never hardcode lesson content in HTML

### 2. Skill hub pages (`hubs/reading/index.html`, `hubs/listening/index.html`)
- Grid of lesson cards linking to individual lessons
- "Coming soon" cards for future lessons (`class="card soon"`)
- Follow pattern in `reading/index.html`

### 3. Homepage updates — CHECKLIST (do ALL of these when adding a lesson)
When adding a new lesson, update `index.html`:
1. **Skill section card**: Add or activate a card in the relevant skill section (Reading, Listening, etc.)
2. **Revision section**: If the lesson is part of a revision test, update the revision card/section
3. **Stats bar**: Update the hero stats to reflect current totals:
   - **Lessons**: Count all lesson folders under `sections/listening/*/` and `sections/reading/*/`
   - **Vocabulary**: Sum `vocabulary` array lengths from ALL `data.json` files
   - Current stats location: `index.html` → `.stats` div inside `.hero`
4. Also update the **skill hub** page (e.g., `listening/index.html`) — add a card in the correct section block
5. **Data tables** (`data/`): Add records to the relevant table files — `vocabulary.json`, `phrases.json`, `fill-blanks.json`, `passages.json` (reading), `questions.json` (reading), `intros.json` (listening), `visual-vocab.json` (listening), `practice.json` (listening). Add a new entry to `sections.json` for the lesson registry. This feeds quiz hub, phrases hub, and all lesson pages automatically via `DataLayer`.

### 4. Shared files (included on ALL pages)
Every page includes:
```html
<link rel="stylesheet" href="[depth]shared/styles.css">
<nav id="nav"></nav>
<script src="[depth]shared/nav.js"></script>
```
Where `[depth]` = `./` (root), `../../` (hub pages in `hubs/`), `../../../` (skills guide + lesson pages in `sections/`).

**Navigation** is generated by `shared/nav.js` — edit once, applies everywhere:
- Brand + **6 links**: Home, Reading, Writing, Listening, Speaking, Revision
- Auto-detects active link from current URL
- Nav uses `key`-based matching (not path-based) — `data-active="listening"` matches the link with `key: 'listening'`
- For pages under `sections/` or `hubs/`, the URL contains the skill keyword so active nav is auto-detected
- Depth set via `data-depth="N"` on `<body>`: `0` = root, `2` = hub pages (in `hubs/`), `3` = skills guide + lesson pages (in `sections/`)

**Data layer** (`shared/data.js`) — included on all lesson and hub pages:
- Fetches and caches table files from `data/`
- Provides `DataLayer.getLesson()` for individual lessons, `DataLayer.getVocabulary()` etc. for cross-lesson queries
- Must be loaded before `lesson.js` and `reading.js`/`listening.js`

**Lesson JS** (`shared/lesson.js`) — included on all lesson pages:
- Contains all shared interactive components (IPA, vocab grid, flashcard, fill-blank, match)
- Each lesson page only needs page-specific code (CAT_LABELS, practice functions, init)

## Data Layer (`data/` + `shared/data.js`)

All lesson data lives in flat JSON table files under `data/`, like database tables. Each record has `skill` and `section` fields. The `shared/data.js` module provides the `DataLayer` API.

### Data Tables
- `data/sections.json` — lesson registry: `[{"section": "happiness", "name": "What is Happiness?", "skill": "reading"}]`
- `data/vocabulary.json` — `[{"word": "traits", "pos": "noun", "vietnamese": "...", "definition": "...", "example": "...", "category": "mindset", "skill": "reading", "section": "happiness"}]`
- `data/phrases.json` — `[{"phrase": "...", "vietnamese": "...", "usage": "...", "example": "...", "category": "...", "skill": "...", "section": "..."}]`
- `data/fill-blanks.json` — `[{"sentence": "... ___", "answer": "word", "hint": "Vietnamese hint", "skill": "...", "section": "..."}]`
- `data/passages.json` — `[{"id": "A", "text": "...", "vietnamese": "...", "skill": "reading", "section": "happiness"}]`
- `data/questions.json` — IELTS questions + meta records for questionTypes/summaryQuestions
- `data/intros.json` — listening intros with title, tips, format
- `data/visual-vocab.json` — listening spatial vocab with SVG keys
- `data/practice.json` — listening practice blocks (one per lesson)

### DataLayer API (`shared/data.js`)
```js
DataLayer.getLesson(skill, section)    // → assembled object like old data.json
DataLayer.getVocabulary(filter?)       // → all vocab (cross-lesson, with _lesson/_skill)
DataLayer.getPhrases(filter?)          // → all phrases
DataLayer.getFillBlanks(filter?)       // → all fill-blanks
DataLayer.getSections(filter?)         // → lesson registry
// filter: { skill?, section?, cat? }
```

### Adding a new lesson's data
1. Add a record to `data/sections.json`
2. Add vocabulary rows to `data/vocabulary.json` (each with `skill`, `section`, `cat`)
3. Add phrase rows to `data/phrases.json`
4. Add fill-blank rows to `data/fill-blanks.json`
5. For reading: add passages to `data/passages.json`, questions to `data/questions.json`
6. For listening: add intro to `data/intros.json`, practice to `data/practice.json`

### Vocabulary field key
- `word` = the English word, `pos` = part of speech, `vietnamese` = Vietnamese translation
- `definition` = English definition, `example` = example sentence, `category` = topic category
- `skill` = "reading" or "listening", `section` = lesson slug (e.g., "happiness")

## Vocabulary Card Features (standard for all lessons)

### IPA Pronunciation
- Fetched at runtime from Free Dictionary API: `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
- **Stemming fallback** for inflected words: "forgiving" → tries "forgive" if no IPA found
- Only stem single words — skip multi-word phrases (they rarely have IPA)
- Cached in memory (`ipaCache`) per page load

### Audio
- Browser Web Speech API (`speechSynthesis`), `lang: 'en-US'`, `rate: 0.85` (slower for learners)
- 🔊 button on vocab cards, flashcards, and phrase cards
- `event.stopPropagation()` prevents card toggle when clicking audio button

### Display Pattern
- **English first**, Vietnamese revealed on tap
- Phrases: show example first, "when to use" + Vietnamese on tap

## Reusable JS Components (`shared/lesson.js`)
All shared lesson interactivity lives in `shared/lesson.js` — do NOT copy-paste these into new lesson pages:
- `speak(text)` — Web Speech API TTS
- `fetchIPA(word)` / `getIPA(word)` / `stemWord(w)` — IPA with stem fallback + cache
- `renderVocab(filter)` — filterable vocabulary card grid
- `renderFC()` / `flipCard()` / `fcNext()` / `fcPrev()` / `shuffleFC()` — flashcard system
- `renderFB2()` / `checkFB()` / `resetFB()` — fill-in-the-blank quiz
- `renderMatch()` / `hMatch()` / `resetMatch()` — word matching game
- `renderPhrases()` — useful phrases with tap-to-reveal

Each listening lesson page must set `CAT_LABELS` (category label map) and call `renderVocab()` from `init()` after the data fetch.

**Reading lesson JS** (`shared/reading.js`) — included on all reading lesson pages alongside `lesson.js`:
- `renderReadingPage(config)` — generates entire HTML template (tabs, passage, quiz, vocab, etc.)
- `renderPassage()` / `toggleVI()` — passage display with Vietnamese toggle
- `renderIELTS()` / `selI()` / `checkIELTS()` / `resetIELTS()` — IELTS quiz (T/F/NG, matching, or multiple choice based on `IELTS_OPTIONS`)
- `renderPassageIELTS()` / `selPI()` / `checkPassageIELTS()` / `resetPassageIELTS()` — passage-side quiz
- `renderSummaryQ()` / `checkSummaryQ()` / `resetSummaryQ()` — summary fill-in-the-blank (for Section 3)
- `renderQTInfo()` — question type info cards
- `initReading(data)` — standard data-loading + render-all sequence

Each reading lesson page sets `CAT_LABELS`, `IELTS_OPTIONS` (array for fixed options, `null` for per-question multiple choice), calls `renderReadingPage(config)` then `DataLayer.getLesson('reading','slug').then(initReading)`. See `sections/reading/bees-neez/index.html` as reference (~60 lines).

**Listening lesson JS** (`shared/listening.js`) — included on all listening lesson pages alongside `lesson.js`:
- `renderListeningPage(config)` — generates entire HTML template (tabs, guide, practice/visual, vocab, phrases, quiz)
- `normalize(s)` — shared text normalization for answer checking
- `initListening(data)` — standard data-loading + render-all sequence (guide, vocab, phrases, flashcard, fill-blank, match, IPA)

Config options for `renderListeningPage()`:
- `title`, `sub` — header text
- `guideWhat` — inserted as "What is {guideWhat}?" in guide tab
- `practiceTab: { audioSrc }` — renders practice tab with audio player + `<div id="practice-content"></div>` hook
- `visualTab: true` — renders visual vocab tab with `<div id="vv-grid"></div>` hook (for map-labeling)
- `phrasesIntro` — intro text for phrases tab

Each listening lesson page sets `CAT_LABELS`, calls `renderListeningPage(config)`, defines practice-specific functions (`renderPractice()`, `checkPractice()`, `resetPractice()` or `renderVisualVocab()`), then fetches data.json and calls `initListening(data)` plus its own render functions. See `sections/listening/sentence-completion/index.html` as reference (~70 lines).

## Design System
- **Fonts:** Fraunces (serif, headings) + Source Sans 3 (sans, body)
- **Google Fonts URL:** `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,700&family=Source+Sans+3:wght@400;500;600&display=swap`
- **Colors:**
  - Background: `--bg: #faf6f0`
  - Text: `--text: #2c2416`
  - Accent: `--accent: #d4853b` (orange-brown)
  - Correct: `--correct: #3a8a5c` (green)
  - Wrong: `--wrong: #c44536` (red)
  - Vietnamese: `--vi: #6b8cce` (blue)
- **Skill colors** (used on homepage sections, hub pages, card borders):
  - Reading: `--reading: #3a8a5c` (green)
  - Writing: `--writing: #6b8cce` (blue)
  - Listening: `--listening: #c47a3b` (orange)
  - Speaking: `--speaking: #b05ca8` (purple-pink)
  - Revision: `--revision: #7a6cc4` (purple)
- **Cards:** white bg, `border-radius: 12px`, `box-shadow: 0 2px 16px rgba(44,36,22,0.08)`
- **Vietnamese text:** blue (`--vi`), italic, revealed on tap/toggle
- **SVG illustrations:** inline in JS template strings (small, no external files)

## Content Guidelines
- Vocabulary: English definition + Vietnamese translation + example sentence in context
- Phrases: show example sentence first, "when to use" revealed on tap
- For listening: include distractor awareness ("Actually, no, I meant...")
- Target phrases learners can reuse in IELTS Writing & Speaking
- IELTS target: 5.5–6.0 (General Training)

## Design Principles
- **Data-driven**: Structure around data and domain, not just HTML/CSS rendering. All content, question types, and metadata belong in `data.json` — HTML/JS reads and renders from data
- **Reading passage layout**: Show IELTS questions next to the passage (side-by-side on desktop, stacked on mobile) so learners can read and answer simultaneously
  - Use `.passage-split` flex container: `.passage-left` (flex:1) + `.passage-right` (sticky, 400px, scrollable)
  - Breakpoint at 900px: stacks vertically on mobile
  - Reference implementation: `sections/reading/video-games/index.html`
  - Hub page reference: `hubs/listening/index.html` (section-organized)
- **Question type metadata**: Each reading lesson includes `questionTypes` in `data.json` with active types (description, tips, Vietnamese) and a reference checklist of all 11 IELTS types

## IELTS Reading Question Types (reference)
When creating a new reading lesson, identify which question types it practices and include `questionTypes` in `data.json`:
1. Multiple Choice — Choose A/B/C/D
2. Matching Information — Match statements to paragraphs
3. Matching Headings — Match headings to paragraphs
4. Matching Features — Match features to a list
5. Matching Sentence Endings — Complete sentence from list
6. Sentence Completion — Fill in with words from text
7. Summary Completion — Fill blanks in a summary
8. Note / Table / Flow-chart Completion — Fill in structured info
9. Short Answer Questions — Answer with words from text
10. True / False / Not Given — Decide if statements match text
11. Yes / No / Not Given — Decide if statements match writer's views
