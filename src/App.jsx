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
    context: '',
    contextTool: null,
    contextUpdatedAt: null,
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
    context: '',
    contextTool: null,
    contextUpdatedAt: null,
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
    context: `## Background
Starter repo already defines STAGES (4 columns) and the Task shape in PRD §5.

## Constraints
Static Tailwind class names only (JIT). Keep the useLocalStorage hook.

## Tried so far
Scaffolded columns via STAGES.map with the STAGE_BG lookup; cards show avatar + title + assignee.

## Pick up where you left off
Add the modal (M5) next: + New task button, click a card to edit, Delete inside the modal.`,
    contextTool: 'Claude',
    contextUpdatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't4',
    title: 'Wire up the "Copy Context" button',
    description: 'Serialize task + context to Markdown on clipboard.',
    type: 'bug',
    status: 'todo',
    assignee: 'Joe Pocock',
    dueDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
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

  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

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

  return (
    <div className="min-h-screen bg-surface-base p-6">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            vibeline
          </h1>
          <p className="text-sm text-text-muted">
            vibeline — Kanban that remembers your prompts.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          + New task
        </button>
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
                  const typeMeta = TYPE_META[task.type];
                  const dueState = getDueState(task);
                  const dueMeta  = DUE_META[dueState];
                  return (
                    <li key={task.id}>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => openEdit(task)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openEdit(task);
                          }
                        }}
                        className={`border-l-4 ${typeMeta.borderClass} w-full cursor-pointer rounded-lg ${dueMeta.bgClass} p-4 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2`}
                      >
                        {dueMeta.icon && (
                          <div className="mb-2 flex justify-end">
                            <span className="inline-flex items-center gap-1 rounded-full bg-surface-raised/60 px-2 py-0.5 text-xs font-medium text-text-primary">
                              <span aria-hidden="true">{dueMeta.icon}</span>
                              <span>{dueMeta.label}</span>
                            </span>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-medium text-text-primary">
                              {task.title}
                            </h3>
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="truncate text-xs text-text-muted">{task.assignee}</span>
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${typeMeta.pillClass}`}>
                                  <span aria-hidden="true">{typeMeta.icon}</span>
                                  <span>{typeMeta.label}</span>
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyContext(task);
                                  }}
                                  aria-label="Copy context"
                                  title="Copy context"
                                  className="shrink-0 rounded-full border border-border-subtle bg-surface-raised px-2 py-0.5 text-xs text-text-muted hover:border-brand-500 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                                >
                                  📋
                                </button>

                                {TEAM.length <= 1 ? (
                                  <select
                                    disabled
                                    onClick={(e) => e.stopPropagation()}
                                    className="shrink-0 rounded-full border border-border-subtle bg-surface-muted px-2 py-0.5 text-xs text-text-muted disabled:opacity-70 disabled:cursor-not-allowed"
                                    title="Only one assignee in the solo build"
                                  >
                                    <option>Hand off… (solo)</option>
                                  </select>
                                ) : (
                                  <select
                                    value=""
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      if (e.target.value) handleHandoff(task.id, e.target.value);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="shrink-0 rounded-full border border-border-subtle bg-surface-raised px-2 py-0.5 text-xs text-text-muted hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                                  >
                                    <option value="" disabled>Hand off to…</option>
                                    {TEAM.filter((name) => name !== task.assignee).map((name) => (
                                      <option key={name} value={name}>{name}</option>
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
      </main>

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
