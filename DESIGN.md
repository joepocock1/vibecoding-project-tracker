> **Design update (28 Oct 2026).** The pastel light scaffold
> described below has been replaced with a dark Clachan-inspired
> system. Chrome is zinc-950, cards are white, column headers are
> saturated indigo-800 / violet-900 / amber-900 / emerald-900. Type
> is a pill chip combining a Lucide icon and a text label. Due
> states tint the card body — red-200 for overdue, amber-200 for
> due today, white calm, opacity-75 done — and each card carries a
> 4-px left border in its column colour. The original pastel
> description below is kept as history of the first iteration.

# Vibecoding Project Tracker — Design

**Status:** Hackathon starter design doc · fill in the **`<TODO>`** sections before you tag `design-done`.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

Calm desk tool with electric accents — a kanban that feels lightweight and current, built for someone iterating fast with AI.

## 2. Color palette

All values are hex and are mirrored in `tailwind.config.js` under `theme.extend.colors`.

**Brand**
- `--brand-500` **#6366f1** · indigo primary (buttons, active nav, focus ring)
- `--brand-600` **#4f46e5** · indigo hover/pressed
- `--brand-100` **#e0e7ff** · indigo tint for subtle fills

**Surface**
- `--surface-base` **#fafafa** · page background
- `--surface-raised` **#ffffff** · card and modal background
- `--surface-muted` **#f4f4f5** · section dividers, hover rows
- `--border-subtle` **#e4e4e7** · 1px borders
- `--text-primary` **#18181b** · body text
- `--text-muted` **#71717a** · metadata, timestamps

**Task type (M6 tag-style)**
- `--type-feature` **#8b5cf6** · violet accent (left border and icon)
- `--type-feature-tint` **#ede9fe** · violet-100 (pill fill)
- `--type-bug` **#ef4444** · red accent (left border and icon)
- `--type-bug-tint` **#fee2e2** · red-100 (pill fill)

**Stage tints (column headers, M4)**
- `--stage-todo` **#dbeafe** · blue-100
- `--stage-progress` **#ddd6fe** · violet-200
- `--stage-review` **#fed7aa** · orange-200
- `--stage-done` **#bbf7d0** · green-200

**Due-date states (M8 due-tint)**
- `--due-calm` **transparent** · >2 days out (no tint)
- `--due-warning` **#fef3c7** · amber-100 · under 24 h
- `--due-alarm` **#fecaca** · red-200 · overdue
- `--due-done` **#f4f4f5** · neutral · completed cards never alarm

## 3. Typography
- **Display and body:** Geist (loaded via Google Fonts) — a near-geometric sans that reads modern without being generic. Fallback: `ui-sans-serif, system-ui, sans-serif`.
- **Monospace:** Geist Mono — used in the Context textarea and any prompt-shaped UI. Fallback: `ui-monospace, "SF Mono", Menlo, monospace`.
- **Scale:** `text-3xl` for page headings, `text-base` for body, `text-sm` for card metadata, `text-xs` for pill labels.

## 4. Component principles
- Cards: `bg-surface-raised`, `rounded-lg` (8 px), `shadow-sm`, 16 px padding. One assignee avatar top-left, title main, metadata row bottom.
- Pills: pale fill (`bg-brand-100`-style tint), dark text, `rounded-full`, `px-2 py-0.5 text-xs font-medium`. Status, type, and assignee all use the pill shape.
- Primary action: filled indigo pill with icon + label. Secondary actions: ghost (text + icon, no fill).
- Focus ring: `ring-2 ring-brand-500 ring-offset-2` on every interactive element.
- Motion: Tailwind's default `transition` on hover and state changes; no custom keyframes except for the M7 handoff toast.

## 5. Voice / microcopy
- Empty board: *"Nothing in flight. Drop a task to get started."*
- Add-task button: **+ New task** (not "Add Item" — shorter beats formal)
- Copy-Context success toast: *"Context copied — paste it into your AI."*
- Overdue card tooltip: *"This one's past due."*
- Delete confirmation (if any): *"Delete this task? There's no undo."*

## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** `<TODO>` (match PRD §11 team identity)
- **Wordmark style:** `<TODO>` (e.g. "Just the name in the heading font, brand-primary color, no icon.")

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. Pick one mode and ship it.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*
