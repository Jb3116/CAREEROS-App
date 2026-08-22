# CAREEROS

CAREEROS is an AI-powered career operating system for students. It brings skill assessment, adaptive daily planning, practice, opportunities, calendar events, resumes and interview preparation into one coherent student experience.

## Included MVP

- Student and admin sign-in entry points, followed by role-appropriate profile setup
- Year-aware initial assessment: first years receive Coding + Aptitude; second through fourth years also receive an optional camera/mic-assisted Interview round
- Premium responsive student dashboard with the immediate “what should I do next?” answer
- Five-step student onboarding for education, goals, language and availability
- Adaptive roadmap and daily task completion state
- Coding practice workspace with practice-mode guidance and a safe mock evaluation state
- Skill intelligence profile that separates demonstrated and self-reported skills
- Learning-resource, opportunity, calendar, interview-studio and resume/ATS views
- Separate college-scoped admin workspace with clearly labelled demo data
- Persisted Phase 1 Career Intelligence: evidence-based skill mastery, skill-gap detection, next-best actions, readiness estimates, and versioned adaptive roadmaps

This demo intentionally labels opportunity and price information as sample data. It does not claim live recruiting data, verified skills, live AI responses, or real code execution.

## Tech

React, TypeScript, Vite, CSS design system, Lucide icons, and a same-origin Node.js API backed by SQLite. SQLite is a relational database: accounts, profiles, progress, assessment attempts, individual answers, practice attempts, and interview responses are linked through user and attempt IDs.

## Run locally

Install Node.js 20+ first, then:

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`. `npm run dev` now starts the API and Vite interface together. Local development data lives in `data/careeros.sqlite`, which is intentionally ignored by Git.

Create the first college admin explicitly; public sign-up creates students only:

```bash
npm run create-admin -- placements@college.edu "use-a-strong-password" "Placement Team"
```

For a production build, run `npm run build` followed by `npm start`. Place the server behind HTTPS before exposing it outside the local machine.

## Persistent data and authentication

- Student sign-up and login are database-backed. Passwords use salted PBKDF2 hashes; plaintext passwords are never written to the database or exported.
- Account sessions are held in an HTTP-only, same-site cookie.
- New students begin with all progress values at `0%`. Their initial assessment, later coding submissions, and interview responses update the linked records.
- Coding and aptitude responses are verified by the server-side answer key. Interview responses are saved without a correct/incorrect label.
- College admins can download an Excel-compatible CSV at `/api/admin/exports/students.csv` after signing in. The CSV is a reporting export, not the database of record.

## Demo flow

The app opens at the login page. Create a **Student** account, complete the five-step career profile, then take the year-aware initial assessment. Sign in as an existing **Admin** account to open the college workspace.

In student mode, Practice includes a 20-question local queue, a resettable timer, editable code, compiler-language selection, safe mock test results and similar questions. Learn tabs open public YouTube search links. Profile is editable and accepts GitHub, LinkedIn and portfolio links.

The interview assessment and Interview Studio request camera/microphone permission only after the student selects **Allow access**. Access is optional, the browser stream is stopped immediately after permission is checked in this prototype, and text answers remain available.

## Career Intelligence (Phase 1)

The authenticated backend now calculates student intelligence from saved evidence, rather than from frontend demo values:

- assessment results and server-verified aptitude attempts create linked skill events;
- skill mastery uses a transparent cold-start and outcome-based estimator with an explicit confidence level;
- target-role requirements identify explainable skill gaps;
- a transparent ranking engine proposes the next best action;
- roadmap versions are saved only when the intelligence inputs change;
- the dashboard shows the estimate, top gaps, and the reason for the next action.

Run the deterministic service tests with:

```bash
npm.cmd run test:ai
```

For a developer-supplied labelled dataset, the evaluator reports measured metrics instead of claiming model accuracy:

```bash
npm.cmd run evaluate:ai -- path/to/labeled-events.json
```

See [AI architecture](docs/AI_ARCHITECTURE.md), [AI API](docs/API.md), and [model inventory](docs/MODELS.md). Advanced LLM, embedding, code-execution, DKT, and XGBoost integrations remain deliberately disabled until an evaluated provider/model and appropriate security controls are configured.

## Security notes

The local implementation provides hashed passwords, parameterized SQLite queries, foreign keys, short-lived server sessions, and admin-only reporting export. Before a public launch, add HTTPS termination, password-reset email delivery, rate limiting, CSRF protection, database backups, audit logging, and a managed database/authentication service with role- and college-scoped authorization. The current practice editor still does not execute user code.
