# IELTS General Training — Study for IELTS 5.5–6.0

Interactive IELTS General Training practice — all 4 skills with Vietnamese translations, vocabulary, quizzes, and exam tips. Completely free.

🌐 **Live:** https://minhvuongrbs.github.io/ielts/

## Skills

| Skill | Content | Status |
|-------|---------|--------|
| 📖 **Reading** | Passages with vocab, translations, section-matching questions | ✅ 1 lesson |
| 🎧 **Listening** | Question type guides, directional vocab, visual diagrams | ✅ 1 lesson |
| ✍️ **Writing** | Task 1 letters, Task 2 essays, structures & templates | 🔜 Coming |
| 🗣️ **Speaking** | Part 1/2/3 topics, cue card strategy, sample answers | 🔜 Coming |

## Lessons

- **Reading:** What is Happiness? (Section 3 — 28 vocab, 7 IELTS questions, 4 quiz types)
- **Listening:** Map & Plan Labeling (Section 2 — 49 vocab, 15 visual cards, 3 quiz types)

## Features

- 🇻🇳 Vietnamese translations (toggle on/off)
- 🔊 Audio pronunciation (Web Speech API) + IPA transcription
- 🗺️ Visual vocabulary with SVG diagrams (listening)
- 💬 Useful phrases with examples (tap to reveal usage)
- 🃏 Flashcard with shuffle
- ✏️ Fill-in-the-blank with Vietnamese hints
- 🔗 Word-matching game (EN ↔ VI)
- 📋 IELTS-style questions with bilingual explanations
- 💡 Tips & strategies per question type

## Project Structure

```
ielts-hub/
├── index.html                           ← Homepage
├── CLAUDE.md                            ← Claude Code context
├── reading/
│   ├── index.html                       ← Reading lesson hub
│   └── happiness/
│       ├── index.html                   ← Lesson: What is Happiness?
│       └── data.json                    ← Lesson content data
├── listening/
│   ├── index.html                       ← Listening lesson hub
│   └── map-labeling/
│       ├── index.html                   ← Lesson: Map & Plan Labeling
│       └── data.json                    ← Lesson content data
├── writing/
│   └── index.html                       ← Coming soon
├── speaking/
│   └── index.html                       ← Coming soon
├── assets/
│   ├── IELTS_Reading_and_Writing_General_ielts.pdf
│   └── Mindset for IELTS Level 1 Student_s Book.pdf
├── README.md
└── LICENSE
```

## How to Add a New Lesson

1. Pick a skill folder: `reading/`, `writing/`, `listening/`, or `speaking/`
2. Create a subfolder: `mkdir listening/new-lesson`
3. Create `data.json` with vocabulary, phrases, and quiz content
4. Create `index.html` (copy from an existing lesson as template)
5. Update the skill hub page (e.g., `listening/index.html`) — add a lesson card
6. Update root `index.html` — change "coming soon" card to active link
7. `git push` — auto-deploys to GitHub Pages

## Local Development

```bash
git clone https://github.com/<your-username>/ielts-hub.git
cd ielts-hub
python3 -m http.server 8080
# Open http://localhost:8080
```

## Deploy to GitHub Pages

1. Push to GitHub
2. **Settings → Pages → Branch: `master` / `/ (root)` → Save**
3. All paths are relative — works automatically on GitHub Pages

## Target

- **Exam:** IELTS General Training
- **Band:** 5.5–6.0
- **Language:** English (primary) + Vietnamese (🇻🇳)

## License

MIT — Free to use, share, and modify.
