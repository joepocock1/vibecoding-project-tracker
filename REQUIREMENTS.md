# vibeline — Requirements Analysis
*Draft for CM6312 Assessment 1 · Part 1 · solo build*

## 1. Stakeholders

| # | Stakeholder | Description | Why they are a stakeholder |
|---|---|---|---|
| S1 | Solo student developer (primary user) | Final-year Software Engineering student using vibeline during the hackathon and across the rest of the module | Only user of the tool; every feature must justify itself against this person's workflow. |
| S2 | Dr. Fernando Loizides (module leader, assessor) | CM6312 Adopting Technologies module leader | Sets scope, deadlines and assessment criteria; marker of this report; provided client-side input during the open forum. |
| S3 | Dr. Ignacio Alvarez (hackathon client, PRD author) | Co-tutor who authored the starter PRD and ran the Intent-Coding session | Supplied the problem statement, locked data model, tech stack and milestone chain; all requirements derive from his PRD. |
| S4 | Future CM6312 cohorts (secondary users) | Students taking the module in subsequent years | Called out in PRD §2 as the secondary audience; justifies portability, maintainability and clear UX. |
| S5 | Hackathon Portal operators | The dashboard at vc-hackathon-hub.vercel.app that watches pushes and tags | Imposes technical requirements: public GitHub repo, webhook, specific tag names per milestone. |
| S6 | University IT (indirect) | Cardiff IT supporting managed devices | Imposes constraints such as PowerShell execution policy and no-admin install, which shaped the toolchain choice. |
| S7 | Software architect | Owns the system's structure in a real development environment | Concerned with scalability of the data model and the migration path from localStorage to a shared backend. |
| S8 | Senior developer | Maintains and extends the codebase day to day | Concerned with maintainability of the single-file React scaffold and the growth path for the codebase. |
| S9 | UX designer | Owns interaction design and accessibility | Concerned with accessibility and interaction patterns across the five view surfaces. |
| S10 | Database engineer | Owns the persistence layer once it leaves the browser | Concerned with the long-term data layer once persistence moves off the browser. |

## 2. Persona of the primary user

**Name:** Joe "J" Pocock
**Age:** 20
**Role:** Final-year Software Engineering student, Cardiff University
**Other context:** remote software-development intern
**Tech comfort:** high — daily VS Code, comfortable with React/TypeScript/Python; uses Claude, ChatGPT and Cursor interchangeably.

**Context of use.** Builds vibeline alone during the CM6312 hackathon on a university-managed laptop with PowerShell execution restrictions, then uses it across the remaining module weeks for the larger project. Deploys to Vercel.

**Goals.**
- Keep every open task visible at a glance without tab-switching.
- Preserve the prompt + context that produced each working piece of code, so AI collaboration can resume days later without starting over.
- Hit every hackathon milestone on time.

**Pains and frustrations.**
- Loses the prompt that produced a working output; wastes time re-prompting (PRD §1).
- Linear/Jira are overkill and prompt-blind; spreadsheets lack status flow.
- Locked-down university environments surface unexpected tooling restrictions.

**Scenario.** Mid-afternoon in the hackathon. He is fixing a regression the model introduced the day before. He opens vibeline, clicks the card, hits "Copy Context", pastes the Markdown briefing into Claude and continues the conversation with full context in one click. After the fix he updates the context field and moves the card to Review.

*Template informed by Cooper, A. (2004) The Inmates Are Running the Asylum.*

## 3. Functional requirements

| ID | Requirement | Source | MVP |
|---|---|---|---|
| FR01 | Render a Kanban board with four fixed columns in order: To Do / In Progress / Review / Done | PRD §7, slide 11 | ⭐ |
| FR02 | Pre-populate 3–4 mock tasks on first load | Slide 11 | |
| FR03 | Each card shows at minimum task title and assignee | Slide 11 | ⭐ |
| FR04 | "+" button opens a modal to add a new task with all Task fields | PRD §4, slide 12 | ⭐ |
| FR05 | Clicking a card opens the same modal in edit mode, pre-filled | Slide 12 | ⭐ |
| FR06 | A delete control on the modal removes the task | Slide 12 | ⭐ |
| FR07 | A status dropdown in the modal moves the task between columns | Slide 12 | ⭐ |
| FR08 | All task state persists in localStorage and survives reload | PRD §6, slide 12 | ⭐ |
| FR09 | Tasks of type feature and bug are visually distinguished by a pill chip combining a Lucide icon and a text label — not colour alone (supports NFR02). | Slide 13 | ⭐ |
| FR10 | Each card shows the assignee's initials or avatar prominently | Slide 14 | |
| FR11 | A "Hand off to…" dropdown on the card reassigns the task (trivial in the solo build; retained for data-model completeness) | Slide 14 | |
| FR12 | Cards tint by due-date proximity: calm (>2 days), warning (<24 h), alarm (overdue), neutral (done) | Slide 15 | |
| FR13 | A Markdown Context textarea in the modal captures a curated briefing for the next AI session | PRD §5, slide 16 | ⭐ |
| FR14 | An AI-tool dropdown (Claude, ChatGPT, Cursor, Lovable, Replit, Other) saves to `contextTool` | Slide 16 | |
| FR15 | `contextUpdatedAt` is set automatically on save; a "last updated N ago" hint appears near the field | Slide 16 | |
| FR16 | A "Copy Context" button on each card and in the modal copies a Markdown block (title, description, context) to the clipboard | PRD §4, slide 17 | ⭐ |
| FR17 | Login gate: an authentication screen protects the app; any credentials are accepted; the session persists in localStorage. Added after the 27 Oct module Q&A clarified that a login is required when the model implies more than one user. | Module Q&A, 27 Oct 2026 | ⭐ |
| FR18 | Settings surface: a dedicated page exposes text size, reduce motion, and sign out. | Design decision; NFR10, NFR11 | |
| FR19 | Team members surface: a dedicated page lists team members with name, role, email, and placeholder controls for invite and remove. | Design decision | |
| FR20 | Dashboard surface: a landing page shows total/overdue/in-Done stat tiles, insight tiles (top assignee, most-used AI tool), a templated AI insights block, and the five most recent tasks. | Design decision | |
| FR21 | Multi-tenant Org/Project selector: the sidebar exposes nested organisation and project switchers; non-active items are visibly muted placeholders. | Design decision (architectural mockup) | |
| FR22 | Context Library: a dedicated page offers five reusable Markdown prompt templates (bug reproduction, feature spec, debug session, refactor plan, code review request) with Copy-to-clipboard. | White et al. (2023); design decision | |
| FR23 | Board tabs: the board surface exposes Kanban / Backlog / Completed / Closed tabs; Kanban is active, the others are visibly muted placeholders. | Design decision | |
| FR24 | Type filter chips (Feature / Bug) fade and disable non-matching cards rather than hiding them, preserving spatial memory of the board. | Design decision | |
| FR25 | View routing: a persistent left sidebar switches between Board, Dashboard, Team, Context Library and Settings; the current view and sidebar collapsed-state persist in localStorage. | Design decision | |
| FR26 | *Secret-sauce feature* — TBD (candidates from slide 19: drag-drop between columns, collapsible card detail, sound cues, keyboard shortcuts) | Slide 19, design decision | |

## 4. Non-functional requirements

| ID | Requirement | Justification | MVP |
|---|---|---|---|
| NFR01 | Usability — a first-time user can add and move a task without instructions | PRD §2 (the demo is the first user test); Nielsen heuristic #6 (recognition over recall) | ⭐ |
| NFR02 | Accessibility — WCAG 2.1 AA for colour contrast, keyboard navigation and semantic markup; status cues must not rely on colour alone. Covers SC 1.4.1 Use of Color (AA), SC 1.4.11 Non-text Contrast (AA) and SC 2.4.3 Focus Order (A) | Confirmed by the module leader in the open forum; the feature/bug and due-date colour systems otherwise exclude colour-blind users | ⭐ |
| NFR03 | Performance — initial load under 2 seconds on Vercel free-tier | SPA bundle only; demo context demands snappy first paint | ⭐ |
| NFR04 | Persistence — task and anchor data survives reload and browser restart | localStorage per PRD §6; required for the "pick up where you left off" workflow | ⭐ |
| NFR05 | Privacy — all task data (including prompt text) stays in the browser; no network transmission | localStorage is per-origin; addresses the forum concern about code snippets in prompts | ⭐ |
| NFR06 | Portability — runs in evergreen browsers (Chrome, Edge, Firefox, Safari); designed desktop-first, with narrower viewports handled by the horizontal-scroll board (NFR12) | Desktop portability is required for the demo; PRD §12 scope update moved partial responsiveness in | |
| NFR07 | Maintainability — React + Tailwind single-file scaffold fits the hackathon time budget; locked data model prevents mid-build churn | PRD §5–6 and slide 11 define the scaffold explicitly | |
| NFR09 | Deployability — one-click deploy from the GitHub repo to Vercel | PRD §6 and slide 7; the tool must be shareable by URL for marking | |
| NFR10 | Reduce motion — a user preference disables transitions site-wide. Exposed via Settings | Satisfies WCAG 2.1 SC 2.3.3 Animation from Interactions (AAA) | |
| NFR11 | User-controlled text size — three discrete steps (small / medium / large) scale the root font-size via CSS percentages, so the user's own browser font-size setting still applies | Satisfies WCAG 2.1 SC 1.4.4 Resize Text (AA) | |
| NFR12 | Horizontal-scroll responsive kanban — columns maintain a minimum 280 px width and scroll horizontally below the viewport width at which all four fit | Keeps the fixed-column model usable on narrower screens | |

## 5. Data requirements

| ID | Data item | Source | MVP |
|---|---|---|---|
| DR01 | `Task` record: `id`, `title`, `description`, `type`, `status`, `assignee`, `dueDate`, `createdDate` | User input via the modal (FR04) | ⭐ |
| DR02 | `Task.context` — Markdown briefing | User input in the Context textarea (FR13) | ⭐ |
| DR03 | `Task.contextTool` — enum {Claude, ChatGPT, Cursor, Lovable, Replit, Other} | User selection from the dropdown (FR14) | |
| DR04 | `Task.contextUpdatedAt` — ISO 8601 timestamp | Set automatically on save (FR15) | |
| DR06 | Assignee list | Hardcoded `TEAM` constant in `src/App.jsx` (single entry) | ⭐ |
| DR07 | Stage IDs and labels | `STAGES` constant in `src/App.jsx` (locked per PRD §7) | ⭐ |
| DR08 | Clipboard payload for "Copy Context" | Derived from `Task` fields at button-press (FR16) | ⭐ |
| DR09 | Persistence key `vibetracker.tasks` | `localStorage`, written on every state change via the `useLocalStorage` hook | ⭐ |
| DR10 | Member record: `id`, `name`, `email`, `role` | Hardcoded `TEAM_MEMBERS` constant in `src/App.jsx` | |
| DR11 | Auth session: boolean held under `vibetracker.auth` | Set by the login gate (FR17), cleared by Sign out (FR18) | ⭐ |
| DR12 | UI preferences: one object under `vibetracker.prefs` — `textSize` and `reduceMotion` (applied live), plus `theme`, `highContrast` and `accentColor` (stored only, not yet applied) | Settings page (FR18) | |
| DR13 | Prompt template record: `id`, `name`, `description`, `body` (Markdown) | Hardcoded `PROMPT_TEMPLATES` constant in `src/App.jsx` (FR22) | |
| DR14 | Current view: `vibetracker.view`; one of `board`, `dashboard`, `team`, `contextLibrary`, `settings` | Sidebar navigation (FR25) | |
| DR15 | Board state: `boardTab` (`vibetracker.boardTab`) and `typeFilter` (`vibetracker.typeFilter`) | Board controls (FR23, FR24) | |

---

## Sources
- `PRD.md` (hackathon starter, Prof. Alvarez)
- `README.md` (hackathon starter)
- Intent Coding Hackathon slide deck (Prof. Alvarez, Oct 2026)
- CM6312 open-forum recording — Prof. Loizides and Prof. Alvarez, 20 Oct 2026
- Student-authored forum questions and notes
- CM6312 Assessment Proforma 2026-27
- Web Content Accessibility Guidelines (WCAG) 2.1 — W3C Recommendation
- White, J. et al. (2023) 'A Prompt Pattern Catalog to Enhance Prompt Engineering with ChatGPT'
