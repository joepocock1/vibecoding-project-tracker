import { useState, useEffect } from 'react';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate     ISO 'YYYY-MM-DD'
 * @property {string} createdDate      ISO 'YYYY-MM-DD'
 */

// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// Replace these placeholders with the three names from PRD §8 before M4.
// They become the only valid values for `Task.assignee`.
export const TEAM = ['Joe Pocock'];

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 *
 * Usage:
 *   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error — silently ignore for hackathon */
    }
  }, [key, value]);

  return [value, setValue];
}

const TODAY = new Date().toISOString().slice(0, 10);

const MOCK_TASKS = [
  {
    id: 't1',
    title: 'Set up fork and link to Hackathon Portal',
    description: 'Fork, clone, connect webhook, push git-linked tag.',
    type: 'feature',
    status: 'done',
    assignee: 'Joe Pocock',
    dueDate: null,
    createdDate: TODAY,
  },
  {
    id: 't2',
    title: 'Fill in PRD TODOs',
    description: 'Team, milestone ownership, team identity.',
    type: 'feature',
    status: 'done',
    assignee: 'Joe Pocock',
    dueDate: null,
    createdDate: TODAY,
  },
  {
    id: 't3',
    title: 'Build four-column Kanban board',
    description: 'Columns from STAGES, cards show title + assignee.',
    type: 'feature',
    status: 'in-progress',
    assignee: 'Joe Pocock',
    dueDate: TODAY,
    createdDate: TODAY,
  },
  {
    id: 't4',
    title: 'Wire up the "Copy Context" button',
    description: 'Serialize task + context to Markdown on clipboard.',
    type: 'feature',
    status: 'todo',
    assignee: 'Joe Pocock',
    dueDate: TODAY,
    createdDate: TODAY,
  },
];

const STAGE_BG = {
  'todo':        'bg-stage-todo',
  'in-progress': 'bg-stage-progress',
  'review':      'bg-stage-review',
  'done':        'bg-stage-done',
};

export default function App() {
  const [tasks] = useLocalStorage('vibetracker.tasks', MOCK_TASKS);

  // TODO M5 crud-modal:
  //   const [editing, setEditing] = useState(null);
  //
  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  return (
    <div className="min-h-screen bg-surface-base p-6">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-text-muted">
            vibeline — Kanban that remembers your prompts.
          </p>
        </div>
      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      {/*
        TODO M4 data-model:
          Render a Kanban board with the four columns from STAGES.
          Each column should display the tasks whose status matches its id.
          Pre-populate 3-4 mock tasks so the board isn't empty on first load.

        TODO M5 crud-modal:
          Add a "+" button that opens a modal with every Task field.
          Clicking a card should open the same modal in edit mode.
      */}
      <main className="grid grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter((t) => t.status === stage.id);
          return (
            <section
              key={stage.id}
              className="rounded-lg bg-surface-muted p-3"
            >
              <header
                className={`mb-3 rounded-md px-3 py-2 ${STAGE_BG[stage.id]}`}
              >
                <h2 className="text-sm font-semibold text-text-primary">
                  {stage.label}
                  <span className="ml-2 text-xs font-normal text-text-muted">
                    {stageTasks.length}
                  </span>
                </h2>
              </header>
              <ul className="space-y-2">
                {stageTasks.map((task) => {
                  const initials = task.assignee
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <li
                      key={task.id}
                      className="rounded-lg bg-surface-raised p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-medium text-text-primary">
                            {task.title}
                          </h3>
                          <p className="mt-1 text-xs text-text-muted">
                            {task.assignee}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </main>
    </div>
  );
}
