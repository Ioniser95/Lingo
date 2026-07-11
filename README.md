# Lingo — a Duolingo-style learning app
A functional Duolingo clone featuring a skill tree, lesson player with five exercise types, XP, streak, hearts, gems, leaderboard, profile, and shop. It features a playful UI faithful to Duolingo's visual language (Owl green, Macaw blue, chunky 4px-shadow buttons, Nunito display type) and includes full dark mode support.

## Tech stack

- **Frontend:** React 18 + TypeScript + Vite 5
- **Routing:** React Router v6
- **State Management:** Zustand (Synced with backend API)
- **Styling:** Tailwind CSS v3 (with CSS variables for dynamic Dark/Light modes)
- **Animation:** Framer Motion, canvas-confetti
- **Icons:** lucide-react
- **Backend:** FastAPI (Python)
- **Database:** SQLite (via SQLAlchemy)

## Features & Enhancements

- **Dark Mode:** Natively integrates with the operating system's color preferences using CSS variables and a custom `useTheme` hook, with a manual toggle in the sidebar.
- **Persistent Backend:** User progress, XP, streak, and heart generation are centrally managed by a Python FastAPI server and persisted permanently into an SQLite database.
- **Dynamic Heart Regeneration:** Hearts refill automatically based on real time passed. The backend securely computes generation time to ensure it works across browser sessions.
- **Five Exercise Types:** Multiple choice, translation via word bank, match pairs, fill in the blank, and type the answer.

## Architecture

```text
project/
├── backend/                  Python FastAPI server
│   ├── main.py               API Endpoints
│   ├── models.py             SQLAlchemy Database Models
│   ├── schemas.py            Pydantic Schemas for Validation
│   └── database.py           SQLite Database Connection
├── src/                      React Frontend
│   ├── routes/               Page routes (Index, Lesson, Shop, etc.)
│   ├── components/
│   │   ├── layout/           AppShell, Sidebar, TopBar, RightRail
│   │   └── lesson/           MultipleChoice, Translate, MatchPairs, etc.
│   ├── lib/
│   │   ├── course-data.ts    Seeded Spanish course data
│   │   └── store.ts          Zustand store connecting to FastAPI
│   └── styles.css            Design tokens + utilities
```

### Data model

```text
# Frontend Hardcoded (Course Content)
Course       (1) ── (n) Unit
Unit         (1) ── (n) Skill
Skill        (1) ── (n) Lesson
Lesson       (1) ── (n) Exercise   (5 discriminated types)

# Backend SQLite Database (User Progress)
User         { id, name, avatar, joined, xp, streak, gems, hearts, hearts_updated_at, last_active_date, today_xp }
User         (1) ── (n) SkillProgress { skill_id, lessons_completed, crown }
```

## Local development

You need two terminal windows to run the application locally.

**1. Start the Backend (FastAPI)**
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**2. Start the Frontend (Vite)**
```bash
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` and automatically proxy `/api` requests to the FastAPI server running on `http://localhost:8000`.

## Content seeding

Course content is seeded in `src/lib/course-data.ts` — one Spanish course, two units, six skills, varied lesson content. Editing that file is the only step required to seed more content; the frontend router and backend progress tracking will pick up new lessons automatically.

## Notes & assumptions

- **Single Default Learner:** For demo purposes, the backend automatically provisions a default user in SQLite when the app first loads. Multi-user support would require adding a real authentication surface (e.g., JWT).
- **Leaderboard:** Seeded from a fixed roster. The current learner is spliced in by XP so you can see yourself climb against simulated bots.
- **Hearts:** Regenerate in real wall-clock time (30 min per heart, max 5).
- **Daily streak:** Advances the first time a lesson completes on a new local date. Gaps of >1 day reset the streak to 1.
