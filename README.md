# 🇻🇳 IELTS General Training — Luyện thi IELTS 6.0–6.5

Interactive IELTS General Training practice — all 4 skills with Vietnamese translations, vocabulary, quizzes, and exam tips. Completely free.

🌐 **Live:** `https://<your-username>.github.io/ielts/`

## Skills

| Skill | Content | Status |
|-------|---------|--------|
| 📖 **Reading** | Passages with vocab, translations, section-matching questions | ✅ 1 lesson |
| ✍️ **Writing** | Task 1 letters, Task 2 essays, structures & templates | 🔜 Coming |
| 🎧 **Listening** | Section strategies, form completion, vocab | 🔜 Coming |
| 🗣️ **Speaking** | Part 1/2/3 topics, cue card strategy, sample answers | 🔜 Coming |

## Features

- 🇻🇳 Vietnamese translations (toggle on/off)
- 🃏 Flashcard with shuffle
- ✏️ Fill-in-the-blank with Vietnamese hints
- 🔗 Word-matching game (EN ↔ VI)
- 📋 IELTS-style questions with bilingual explanations
- 💡 Tips & strategies per question type

## Project Structure

```
ielts/
├── index.html                    ← Homepage
├── reading/
│   ├── happiness/index.html      ← Lesson: What is Happiness?
│   └── lesson-2/index.html       ← (future)
├── writing/
│   ├── formal-letter/index.html  ← (future)
│   └── opinion-essay/index.html  ← (future)
├── listening/
│   └── section-1/index.html      ← (future)
├── speaking/
│   ├── part-1/index.html         ← (future)
│   └── part-2/index.html         ← (future)
├── README.md
└── LICENSE
```

## How to Add a New Lesson

1. Pick a skill folder: `reading/`, `writing/`, `listening/`, or `speaking/`
2. Create a subfolder: `mkdir reading/my-lesson`
3. Add `index.html` (copy from `reading/happiness/` as template)
4. Update content, vocab, and questions
5. Add a lesson card in root `index.html`
6. `git push` — auto-deploys

## Local Preview

```bash
git clone https://github.com/<your-username>/ielts.git
cd ielts
python3 -m http.server 8000
# Open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push to GitHub
2. **Settings → Pages → Branch: `main` / `/ (root)` → Save**
3. Live at `https://<your-username>.github.io/ielts/`

## Target

- **Exam:** IELTS General Training
- **Band:** 6.0–6.5
- **Language:** English + Vietnamese (🇻🇳)

## License

MIT — Free to use, share, and modify.
