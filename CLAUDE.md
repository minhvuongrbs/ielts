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
- **Reference PDFs:**
  - `docs/IELTS_Reading_and_Writing_General_ielts.pdf` — GT Reading & Writing practice tests
  - `docs/Mindset for IELTS Level 1 Student_s Book.pdf` — Mindset for IELTS Level 1 (Foundation/Band 5.5–6.0)

## Project Structure
```
index.html                          # Homepage — skill sections with lesson cards
reading/
  index.html                        # Reading lesson hub (card grid)
  happiness/
    index.html                      # Lesson page (tabs + interactive components)
    data.json                       # ALL lesson content (vocab, quizzes, phrases)
listening/
  index.html                        # Listening lesson hub (card grid)
  map-labeling/
    index.html                      # Lesson page
    data.json                       # ALL lesson content
writing/index.html                  # Coming soon placeholder
speaking/index.html                 # Coming soon placeholder
```

## Architecture — Follow When Creating New Lessons

### 1. Lesson = folder with `index.html` + `data.json`
- `data.json` holds ALL content (vocabulary, phrases, quizzes)
- `index.html` fetches `data.json` at runtime and renders client-side
- Never hardcode lesson content in HTML

### 2. Skill hub pages (`reading/index.html`, `listening/index.html`)
- Grid of lesson cards linking to individual lessons
- "Coming soon" cards for future lessons (`class="card soon"`)
- Follow pattern in `reading/index.html`

### 3. Homepage updates
- When adding a new lesson, update the skill section in `index.html`
- Change `<div class="card soon">` to `<a href="..." class="card">` with link

### 4. Navigation bar (present on ALL pages)
- Brand: links to root via relative path
- 5 links: Home, Reading, Writing, Listening, Speaking
- Active page: `.nav-link.active` class
- Relative paths based on page depth (e.g., `../../` from lesson pages)

## Data Format Conventions

### Reading lesson data.json
```json
{
  "sections": [{"id": "A", "en": "...", "vi": "..."}],
  "vocabulary": [{"w": "word", "p": "noun", "vi": "...", "en": "...", "ex": "...", "s": "A"}],
  "ieltsQuestions": [{"n": 28, "t": "...", "a": "A", "vi": "...", "en": "..."}],
  "fillBlanks": [{"s": "sentence with ___", "a": "answer", "h": "Vietnamese hint"}],
  "usefulPhrases": [{"phrase": "...", "vi": "...", "usage": "...", "example": "...", "section": "A"}]
}
```

### Listening lesson data.json
```json
{
  "intro": {"title": "...", "description": "...", "format": [], "tips": []},
  "visualVocab": [{"term": "...", "vi": "...", "example": "...", "svg": "svg-key"}],
  "vocabulary": [{"w": "word", "p": "noun", "vi": "...", "en": "...", "ex": "...", "cat": "place|movement|location|direction"}],
  "usefulPhrases": [{"phrase": "...", "vi": "...", "usage": "...", "example": "...", "cat": "..."}],
  "fillBlanks": [{"s": "sentence with ___", "a": "answer", "h": "Vietnamese hint"}]
}
```

### Vocabulary field key
- `w` = word, `p` = part of speech, `vi` = Vietnamese, `en` = English definition
- `ex` = example sentence, `s` = section letter (reading), `cat` = category (listening)

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

## Reusable JS Components (copy from existing lessons)
- `speak(text)` — Web Speech API TTS
- `fetchIPA(word)` / `getIPA(word)` / `stemWord(w)` — IPA with stem fallback
- `renderVocab(filter)` — filterable vocabulary card grid
- `renderFC()` / `flipCard()` / `fcNext()` / `fcPrev()` / `shuffleFC()` — flashcard system
- `renderFB2()` / `checkFB()` / `resetFB()` — fill-in-the-blank quiz
- `renderMatch()` / `hMatch()` / `resetMatch()` — word matching game
- `renderPhrases()` — useful phrases with tap-to-reveal

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
- **Cards:** white bg, `border-radius: 12px`, `box-shadow: 0 2px 16px rgba(44,36,22,0.08)`
- **Vietnamese text:** blue (`--vi`), italic, revealed on tap/toggle
- **SVG illustrations:** inline in JS template strings (small, no external files)

## Content Guidelines
- Vocabulary: English definition + Vietnamese translation + example sentence in context
- Phrases: show example sentence first, "when to use" revealed on tap
- For listening: include distractor awareness ("Actually, no, I meant...")
- Target phrases learners can reuse in IELTS Writing & Speaking
- IELTS target: 5.5–6.0 (General Training)
