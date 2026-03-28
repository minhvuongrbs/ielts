# Section-Hub Architecture

**Status:** Done

## Goal
Each skill area (Reading, Listening, Writing, Speaking, Revision) should link to a **section hub** as its first-class entry point. Sections become the primary unit of organization.

## What was done

### 1. Created `sections/` folder — single source of truth for all lessons
All lessons moved from scattered locations into `sections/<skill>/<lesson>/`:
- `sections/listening/form-completion/` (was `lessons/`)
- `sections/listening/map-labeling/` (was `listening/`)
- `sections/listening/sentence-completion/` (was `lessons/`)
- `sections/reading/happiness/` (was `reading/`)
- `sections/reading/video-games/` (was `reading/`)

### 2. Created `hubs/` folder — all hub/index pages
Moved all hub folders from root into `hubs/`:
- `hubs/listening/`, `hubs/reading/`, `hubs/writing/`, `hubs/speaking/`, `hubs/quiz/`, `hubs/revision/`
- `hubs/reading/skills/` (reading skills guide stays with its hub)

### 3. Restructured hub pages by IELTS section
- **Listening hub**: Section 1 (social conversation), Section 2 (public announcement), Section 3 (academic discussion, coming soon), Section 4 (academic lecture, coming soon)
- **Reading hub**: Skills Guide, Section 1 (short texts, coming soon), Section 2 (work-related, coming soon), Section 3 (extended passage — happiness, video-games)

### 4. Updated nav.js with key-based active detection
Added `key` field to nav links (separate from `path`) so active detection works for both `hubs/listening/` URLs and `sections/listening/` URLs.

### 5. Updated all cross-references
Homepage, quiz, revision, and all lesson files updated with correct relative paths.

### 6. Removed `lessons/` folder
No longer needed — dissolved into `sections/`.
