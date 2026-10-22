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
 *   - M10 copy-context  : a "Copy as Prompt Context" button that serializes the task + context.
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
export const TEAM = ['Joe Pocock', 'Alex Rivera', 'Sam Chen'];

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
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const IN_THREE_DAYS = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);

const MOCK_TASKS = [
  {
    id: 't1',
    title: 'Dark mode toggle',
    description: 'Users have asked for a dark variant. Tokens exist in tailwind.config.js — plumbing + persistence left.',
    type: 'feature',
    status: 'todo',
    assignee: 'Joe Pocock',
    dueDate: IN_THREE_DAYS,
    createdDate: TODAY,
    context: '',
    contextTool: null,
    contextUpdatedAt: null,
  },
  {
    id: 't2',
    title: 'Modal does not close on overlay click in Safari',
    description: 'Esc works, X works, clicking the dim overlay does nothing in Safari 17.',
    type: 'bug',
    status: 'todo',
    assignee: 'Alex Rivera',
    dueDate: YESTERDAY,
    createdDate: TODAY,
    context: `## Background
Overlay uses pointer-events-none on the wrapper and pointer-events-auto on the panel. Click handler on the wrapper doesn't fire in Safari.

## Constraints
Must still allow nested interactive content (select, textarea) inside the panel.

## Tried so far
- Moved onClick from wrapper to a sibling overlay div (worked in Chrome, same bug in Safari)
- stopPropagation on the panel's onClick (no change)

## Pick up where you left off
Try z-index layering: overlay z-40 with its own onClick, panel z-50 with its own stopPropagation. Confirm in Safari 17 on macOS.`,
    contextTool: 'Claude',
    contextUpdatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 't3',
    title: 'Drag-and-drop between columns',
    description: 'Native HTML5 drag API, native keyboard access via the modal\'s status dropdown as backup.',
    type: 'feature',
    status: 'in-progress',
    assignee: 'Joe Pocock',
    dueDate: TODAY,
    createdDate: TODAY,
    context: `## Background
M12 secret sauce. Native drag over @dnd-kit to avoid new deps for a hackathon demo.

## Constraints
Nested interactive elements (copy button, handoff select) must not start a card drag.

## Tried so far
draggable attribute on the card wrapper, draggable={false} on nested buttons and selects. stopPropagation retained as defence.

## Pick up where you left off
Drop zone highlight is wired with ring-brand-500. Consider a small drop animation if time permits.`,
    contextTool: 'Claude',
    contextUpdatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't4',
    title: 'Context field pre-fills Markdown template',
    description: 'New tasks start with Background / Constraints / Tried so far / Pick up headings.',
    type: 'feature',
    status: 'review',
    assignee: 'Sam Chen',
    dueDate: null,
    createdDate: TODAY,
    context: '',
    contextTool: null,
    contextUpdatedAt: null,
  },
  {
    id: 't5',
    title: 'Set up fork and link to Hackathon Portal',
    description: 'Fork, clone, webhook, register on the dashboard.',
    type: 'feature',
    status: 'done',
    assignee: 'Joe Pocock',
    dueDate: null,
    createdDate: TODAY,
    context: '',
    contextTool: null,
    contextUpdatedAt: null,
  },
  {
    id: 't6',
    title: 'Design system + Tailwind tokens',
    description: 'Indigo brand, Clachan-inspired pastel column tints, Geist font.',
    type: 'feature',
    status: 'done',
    assignee: 'Sam Chen',
    dueDate: null,
    createdDate: TODAY,
    context: '',
    contextTool: null,
    contextUpdatedAt: null,
  },
  {
    id: 't7',
    title: 'Build four-column Kanban board',
    description: 'STAGES locked, cards + localStorage persistence.',
    type: 'feature',
    status: 'done',
    assignee: 'Joe Pocock',
    dueDate: null,
    createdDate: TODAY,
    context: '',
    contextTool: null,
    contextUpdatedAt: null,
  },
  {
    id: 't8',
    title: 'Wire up Copy-Context button serialization',
    description: 'Markdown block with title, description, context, tool footer.',
    type: 'bug',
    status: 'done',
    assignee: 'Alex Rivera',
    dueDate: null,
    createdDate: TODAY,
    context: '',
    contextTool: null,
    contextUpdatedAt: null,
  },
];

const STAGE_BG = {
  'todo':        'bg-stage-todo',
  'in-progress': 'bg-stage-progress',
  'review':      'bg-stage-review',
  'done':        'bg-stage-done',
};

const TYPE_META = {
  feature: {
    label: 'Feature',
    icon: '✨',
    pillClass: 'bg-type-feature-tint text-type-feature',
    borderClass: 'border-type-feature',
  },
  bug: {
    label: 'Bug',
    icon: '🐛',
    pillClass: 'bg-type-bug-tint text-type-bug',
    borderClass: 'border-type-bug',
  },
};

const ANCHOR_SLOTS = [
  { id: 'presentation',  label: 'Presentation' },
  { id: 'demo',          label: 'Demo' },
  { id: 'report',        label: 'Report' },
  { id: 'documentation', label: 'Documentation' },
];

const INITIAL_ANCHORS = ANCHOR_SLOTS.map((s) => ({ ...s, url: null }));

const DUE_META = {
  calm:    { bgClass: 'bg-surface-raised', icon: null, label: null },
  warning: { bgClass: 'bg-due-warning',    icon: '⏰', label: 'Due today' },
  alarm:   { bgClass: 'bg-due-alarm',      icon: '🔥', label: 'Overdue' },
  done:    { bgClass: 'bg-due-done',       icon: null, label: null },
};

function getDueState(task) {
  if (task.status === 'done') return 'done';
  if (!task.dueDate) return 'calm';
  const today = new Date().toISOString().slice(0, 10);
  if (task.dueDate < today) return 'alarm';
  if (task.dueDate === today) return 'warning';
  return 'calm';
}

const AI_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'];

const CONTEXT_TEMPLATE = `## Background


## Constraints


## Tried so far


## Pick up where you left off
`;

function timeAgo(iso) {
  if (!iso) return null;
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} d ago`;
}

function serializeContext(task) {
  const parts = [];
  parts.push(`# ${task.title}`);
  if (task.description) {
    parts.push('', task.description);
  }
  if (task.context) {
    parts.push('', '---', '', task.context);
  }
  if (task.contextTool) {
    parts.push('', `_Previously worked on with: ${task.contextTool}_`);
  }
  return parts.join('\n');
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', MOCK_TASKS);

  const [editing, setEditing] = useState(null);
  // null = modal closed, 'new' = new-task form, Task object = edit mode.

  const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', INITIAL_ANCHORS);

  const updateAnchor = (id, url) => {
    setAnchors(anchors.map((a) =>
      a.id === id ? { ...a, url: url || null } : a
    ));
  };

  const openNew  = () => setEditing('new');
  const openEdit = (task) => setEditing(task);
  const closeModal = () => setEditing(null);

  const saveTask = (values) => {
    const now = new Date().toISOString();
    if (editing === 'new') {
      const task = {
        ...values,
        id: `t${Date.now()}`,
        createdDate: new Date().toISOString().slice(0, 10),
        contextUpdatedAt: values.context ? now : null,
      };
      setTasks([...tasks, task]);
    } else {
      const contextChanged = values.context !== (editing.context ?? '');
      setTasks(tasks.map((t) =>
        t.id === editing.id
          ? {
              ...editing,
              ...values,
              contextUpdatedAt: contextChanged ? now : (editing.contextUpdatedAt ?? null),
            }
          : t
      ));
    }
    closeModal();
  };

  const deleteTask = (id) => {
    if (window.confirm("Delete this task? There's no undo.")) {
      setTasks(tasks.filter(t => t.id !== id));
      closeModal();
    }
  };

  const handleHandoff = (taskId, newAssignee) => {
    setTasks(tasks.map((t) =>
      t.id === taskId ? { ...t, assignee: newAssignee } : t
    ));
  };

  const [toast, setToast] = useState(null);

  const handleCopyContext = async (task) => {
    const ok = await copyToClipboard(serializeContext(task));
    setToast(ok
      ? 'Context copied — paste it into your AI.'
      : 'Could not copy — try again.');
    setTimeout(() => setToast(null), 2000);
  };

  const [draggingId, setDraggingId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(taskId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (stageId) => {
    setDragOverStage(stageId);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    setDragOverStage(null);
    setDraggingId(null);
    if (!taskId) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100">
      <SidebarNav />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onNewTask={openNew} />
        <main className="flex-1 overflow-auto bg-zinc-950 p-6">
      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold text-text-primary">Deliverables</h2>
        <div className="grid grid-cols-4 gap-4">
          {anchors.map((anchor) => (
            <section key={anchor.id} className="rounded-lg bg-surface-raised p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    anchor.url ? 'bg-brand-500' : 'border border-text-muted'
                  }`}
                />
                <h3 className="text-sm font-semibold text-text-primary">{anchor.label}</h3>
                {anchor.url && (
                  <a
                    href={anchor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-xs font-medium text-brand-500 hover:text-brand-600"
                  >
                    Open ↗
                  </a>
                )}
                <span className="sr-only">
                  {anchor.url ? 'Link set' : 'No link set'}
                </span>
              </div>
              <label htmlFor={`anchor-${anchor.id}`} className="sr-only">
                {anchor.label} URL
              </label>
              <input
                id={`anchor-${anchor.id}`}
                type="url"
                value={anchor.url ?? ''}
                onChange={(e) => updateAnchor(anchor.id, e.target.value)}
                placeholder="Paste link"
                className="block w-full rounded-md border border-border-subtle bg-surface-base px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              />
            </section>
          ))}
        </div>
      </section>

      {/*
        TODO M4 data-model:
          Render a Kanban board with the four columns from STAGES.
          Each column should display the tasks whose status matches its id.
          Pre-populate 3-4 mock tasks so the board isn't empty on first load.

        TODO M5 crud-modal:
          Add a "+" button that opens a modal with every Task field.
          Clicking a card should open the same modal in edit mode.
      */}
      <section className="grid grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter((t) => t.status === stage.id);
          return (
            <section
              key={stage.id}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`rounded-lg bg-surface-muted p-3 transition ${
                dragOverStage === stage.id ? 'ring-2 ring-brand-500 ring-offset-2' : ''
              }`}
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
                  const typeMeta = TYPE_META[task.type];
                  const dueState = getDueState(task);
                  const dueMeta  = DUE_META[dueState];
                  return (
                    <li key={task.id}>
                      <div
                        role="button"
                        tabIndex={0}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => openEdit(task)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openEdit(task);
                          }
                        }}
                        className={`w-full cursor-pointer rounded-lg ${dueMeta.bgClass} p-3 shadow-sm border border-border-subtle border-l-4 ${typeMeta.borderClass} transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${draggingId === task.id ? 'opacity-50' : ''}`}
                      >
                        {dueMeta.icon && (
                          <div className="mb-2 flex justify-end">
                            <span className="inline-flex items-center gap-1 rounded-full bg-surface-raised/60 px-1.5 py-0.5 text-xs font-medium text-text-primary">
                              <span aria-hidden="true">{dueMeta.icon}</span>
                              <span>{dueMeta.label}</span>
                            </span>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <div
                            role="img"
                            title={task.assignee}
                            aria-label={task.assignee}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600"
                          >
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-2 text-sm font-semibold text-text-primary leading-tight">
                              {task.title}
                            </h3>
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  role="img"
                                  aria-label={typeMeta.label}
                                  title={typeMeta.label}
                                  className={`shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full text-xs ${typeMeta.pillClass}`}
                                >
                                  {typeMeta.icon}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  draggable={false}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyContext(task);
                                  }}
                                  aria-label="Copy context"
                                  title="Copy context"
                                  className="shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full border border-border-subtle bg-surface-raised text-xs text-text-muted hover:border-brand-500 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                                >
                                  📋
                                </button>

                                {TEAM.length <= 1 ? (
                                  <button
                                    type="button"
                                    draggable={false}
                                    disabled
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label="Hand off (solo build)"
                                    title="Hand off (solo build)"
                                    className="shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full border border-border-subtle bg-surface-muted text-xs text-text-muted opacity-70 cursor-not-allowed"
                                  >
                                    ↔
                                  </button>
                                ) : (
                                  <select
                                    value=""
                                    draggable={false}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      if (e.target.value) handleHandoff(task.id, e.target.value);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label="Hand off task"
                                    title="Hand off task"
                                    className="shrink-0 h-6 w-6 appearance-none rounded-full border border-border-subtle bg-surface-raised text-center text-xs leading-6 text-text-muted hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 cursor-pointer"
                                  >
                                    <option value="" disabled>↔</option>
                                    {TEAM.filter((name) => name !== task.assignee).map((name) => (
                                      <option key={name} value={name}>→ {name}</option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </section>
        </main>
      </div>

      {editing && (
        <TaskModal
          mode={editing === 'new' ? 'new' : 'edit'}
          initialTask={editing === 'new' ? null : editing}
          onSave={saveTask}
          onDelete={() => deleteTask(editing.id)}
          onCopy={() => editing && editing !== 'new' && handleCopyContext(editing)}
          onClose={closeModal}
        />
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 rounded-lg bg-text-primary px-4 py-2 text-sm text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

const ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'h-4 w-4',
  'aria-hidden': 'true',
};

const NAV_ICONS = {
  board: (
    <svg {...ICON_PROPS}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
  ),
  dashboard: (
    <svg {...ICON_PROPS}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  ),
  workItems: (
    <svg {...ICON_PROPS}><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="10" x2="17" y2="10"/><line x1="7" y1="15" x2="13" y2="15"/></svg>
  ),
  deliverables: (
    <svg {...ICON_PROPS}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  ),
  contextLibrary: (
    <svg {...ICON_PROPS}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  ),
  settings: (
    <svg {...ICON_PROPS}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ),
};

// Only Board is live; the rest are placeholders for future views.
const NAV_GROUPS = [
  {
    header: null,
    items: [
      { id: 'board',     label: 'Board',     active: true },
      { id: 'dashboard', label: 'Dashboard' },
    ],
  },
  {
    header: 'Overview',
    items: [
      { id: 'workItems',    label: 'Work Items' },
      { id: 'deliverables', label: 'Deliverables' },
    ],
  },
  {
    header: 'Project',
    items: [
      { id: 'contextLibrary', label: 'Context Library' },
      { id: 'settings',       label: 'Settings' },
    ],
  },
];

function SidebarNav() {
  return (
    <aside className="w-60 shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      <div className="px-3 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">v</div>
          <span className="text-sm font-semibold text-indigo-400">vibeline</span>
        </div>
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-2 py-3 space-y-5 text-sm">
        {NAV_GROUPS.map((group, i) => (
          <div key={group.header ?? i} className="space-y-1">
            {group.header && (
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 px-3">
                {group.header}
              </p>
            )}
            {group.items.map((item) => (
              <a
                key={item.id}
                aria-current={item.active ? 'page' : undefined}
                aria-disabled={item.active ? undefined : 'true'}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${
                  item.active
                    ? 'bg-zinc-800 text-zinc-50'
                    : 'text-zinc-400 hover:text-zinc-200 cursor-not-allowed opacity-70'
                }`}
              >
                {NAV_ICONS[item.id]}
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-zinc-800 p-3 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold">JP</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-100 truncate">Joe Pocock</p>
          <p className="text-xs text-zinc-500 truncate">joe@vibeline.local</p>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ onNewTask }) {
  return (
    <header className="h-14 shrink-0 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        <span className="text-zinc-500">vibeline</span>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-100 font-medium">Board</span>
      </nav>
      <button
        type="button"
        onClick={onNewTask}
        className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
      >
        + New task
      </button>
    </header>
  );
}

function TaskModal({ mode, initialTask, onSave, onDelete, onCopy, onClose }) {
  const [formValues, setFormValues] = useState(
    initialTask
      ? {
          title: initialTask.title ?? '',
          description: initialTask.description ?? '',
          type: initialTask.type ?? 'feature',
          status: initialTask.status ?? 'todo',
          assignee: initialTask.assignee ?? (TEAM[0] ?? ''),
          dueDate: initialTask.dueDate ?? '',
          context: initialTask.context ?? CONTEXT_TEMPLATE,
          contextTool: initialTask.contextTool ?? '',
        }
      : {
          title: '',
          description: '',
          type: 'feature',
          status: 'todo',
          assignee: TEAM[0] ?? '',
          dueDate: '',
          context: CONTEXT_TEMPLATE,
          contextTool: '',
        }
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleChange = (field) => (e) =>
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValues.title.trim()) return;
    onSave(formValues);
  };

  const labelClass = 'block text-xs font-medium text-text-muted mb-1';
  const fieldClass =
    'block w-full rounded-md border border-border-subtle bg-surface-raised px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2';

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-surface-raised p-6 shadow-lg space-y-4"
        >
          <h2 className="text-lg font-semibold text-text-primary">
            {mode === 'new' ? 'New task' : 'Edit task'}
          </h2>

          <div>
            <label className={labelClass} htmlFor="task-title">Title</label>
            <input
              id="task-title"
              type="text"
              required
              autoFocus
              value={formValues.title}
              onChange={handleChange('title')}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              rows={3}
              value={formValues.description}
              onChange={handleChange('description')}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="task-type">Type</label>
            <select
              id="task-type"
              value={formValues.type}
              onChange={handleChange('type')}
              className={fieldClass}
            >
              <option value="feature">Feature</option>
              <option value="bug">Bug</option>
            </select>
            <div className="mt-1">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_META[formValues.type].pillClass}`}>
                <span aria-hidden="true">{TYPE_META[formValues.type].icon}</span>
                <span>{TYPE_META[formValues.type].label}</span>
              </span>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="task-status">Status</label>
            <select
              id="task-status"
              value={formValues.status}
              onChange={handleChange('status')}
              className={fieldClass}
            >
              {STAGES.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="task-assignee">Assignee</label>
            <select
              id="task-assignee"
              value={formValues.assignee}
              onChange={handleChange('assignee')}
              className={fieldClass}
            >
              {TEAM.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="task-dueDate">Due date</label>
            <input
              id="task-dueDate"
              type="date"
              value={formValues.dueDate}
              onChange={handleChange('dueDate')}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="task-context" className="block text-xs font-medium text-text-muted mb-1">
              Context
            </label>
            <textarea
              id="task-context"
              value={formValues.context}
              onChange={(e) => setFormValues({ ...formValues, context: e.target.value })}
              rows={8}
              className="block w-full rounded-md border border-border-subtle bg-surface-raised px-3 py-2 font-mono text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              placeholder="Markdown briefing for the next AI session"
            />
            {initialTask?.contextUpdatedAt && (
              <p className="mt-1 text-xs text-text-muted">
                Last updated {timeAgo(initialTask.contextUpdatedAt)}
              </p>
            )}
            {initialTask && (
              <button
                type="button"
                onClick={onCopy}
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-raised px-3 py-1 text-xs font-medium text-text-primary hover:border-brand-500 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                <span aria-hidden="true">📋</span>
                <span>Copy Context</span>
              </button>
            )}
          </div>

          <div>
            <label htmlFor="task-context-tool" className="block text-xs font-medium text-text-muted mb-1">
              AI tool
            </label>
            <select
              id="task-context-tool"
              value={formValues.contextTool ?? ''}
              onChange={(e) => setFormValues({ ...formValues, contextTool: e.target.value || null })}
              className="block w-full rounded-md border border-border-subtle bg-surface-raised px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              <option value="">— None —</option>
              {AI_TOOLS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            {mode === 'edit' ? (
              <button
                type="button"
                onClick={onDelete}
                className="text-sm font-medium text-type-bug hover:underline"
              >
                Delete
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 text-sm font-medium text-text-muted hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
