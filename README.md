# PracticeFlow

**Coach-first practice orchestration for baseball and softball.**

PracticeFlow helps coaches go from constraints to a complete, editable practice plan in seconds. Enter your team's roster size, available coaches, time, equipment, and goals — get back a fully structured practice with drill sequences, timing, coach assignments, and AI coaching notes.

---

## Quick Start

```bash
cd practiceflow
npm install
npm run dev          # opens http://localhost:5173
npm run build        # production build → dist/
```

No API keys required. The app is fully demoable with mock data and mock AI out of the box.

---

## Features

- **AI Practice Generator** — 4-step wizard produces complete plans from team inputs
- **30+ Drill Library** — Filterable drills across baseball & softball with animated SVG diagrams
- **Practice Plan View** — Drill timeline, coach assignments, teaching points, AI notes
- **Diagram Studio** — Place players/coaches/cones on a field SVG; attach to any drill
- **Run Practice Mode** — Full-screen mobile timer for field-side use
- **Team & Roster Management** — Create teams, manage players/coaches, set active team
- **Templates** — 6 pre-built practice templates ready to customize
- **Dark Mode** — Full dark/light theme

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v3 |
| Components | Radix UI primitives |
| Animation | Framer Motion |
| State | Zustand (localStorage) |
| Routing | React Router v6 |
| Diagrams | Custom SVG engine |
| Deployment | Netlify + Netlify Functions |

---

## Routes

| Path | Description |
|------|-------------|
| `/app/dashboard` | Overview + quick actions |
| `/app/generate` | 4-step practice generator wizard |
| `/app/practices/:id` | Practice plan detail view |
| `/app/library` | Drill library with filters |
| `/app/diagram-studio` | Interactive diagram builder |
| `/app/teams` | Team & roster management |
| `/app/templates` | Pre-built practice templates |
| `/app/run/:id` | Field-side run practice mode |
| `/app/settings` | App settings |

---

## Netlify Deployment

1. Push this repo to GitHub
2. Connect repo at netlify.com → Build settings auto-detected from `netlify.toml`
3. (Optional) Add env vars in Netlify dashboard:
   - `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` for real AI generation
4. Deploy — live at `https://your-app.netlify.app`

---

## Adding Real AI

The AI layer (`src/services/aiService.ts` and `netlify/functions/generate-practice.ts`) is pre-wired for real API calls. When `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` is present in the Netlify environment, the functions will use real AI. Without a key, mock responses are returned automatically.

---

## Project Structure

```
src/
  components/layout/     # AppLayout, Sidebar, TopBar, MobileNav
  components/ui/         # Button, Card, Badge, Dialog, etc.
  data/                  # Seed data: drills, teams, templates, practices
  features/
    dashboard/           # Dashboard screen
    diagram-studio/      # SVG diagram engine
    drills/              # Drill library
    practice-generator/  # 4-step wizard
    practice-plan/       # Plan detail view
    run-practice/        # Timer mode
    teams/               # Roster management
    templates/           # Templates browser
  lib/utils.ts           # cn(), formatMinutes(), label maps
  services/
    aiService.ts         # AI abstraction (mock + real)
    practiceGenerator.ts # Local plan generation
  store/index.ts         # Zustand stores
  types/index.ts         # All TypeScript types
netlify/functions/       # Serverless AI endpoints
netlify.toml             # Build + redirect config
.env.example             # Environment variable template
```

---

## Assumptions

- Mock AI produces valid, logically-sequenced plans without any API key
- All state persists via localStorage (Zustand); no backend required for MVP
- SVG chosen for diagrams — 2D now, 3D upgrade path clear
- No authentication in MVP — auth hooks ready for Supabase/Clerk
