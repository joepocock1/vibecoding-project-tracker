import { useState, useEffect, useRef } from 'react';

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

// Display data for the Team page. Names match TEAM.
const TEAM_MEMBERS = [
  { id: 'joe',   name: 'Joe Pocock',   email: 'joe@vibeline.local',   role: 'Lead' },
  { id: 'alex',  name: 'Alex Rivera',  email: 'alex@vibeline.local',  role: 'Developer' },
  { id: 'sam',   name: 'Sam Chen',     email: 'sam@vibeline.local',   role: 'Designer' },
];

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
  'todo':        'bg-indigo-800',
  'in-progress': 'bg-violet-900',
  'review':      'bg-amber-900',
  'done':        'bg-emerald-900',
};

const STAGE_LEFT_BORDER = {
  'todo':        'border-l-indigo-500',
  'in-progress': 'border-l-violet-500',
  'review':      'border-l-amber-500',
  'done':        'border-l-emerald-500',
};

const TYPE_META = {
  feature: {
    label: 'Feature',
    borderClass: 'border-type-feature',
  },
  bug: {
    label: 'Bug',
    borderClass: 'border-type-bug',
  },
};

const DUE_META = {
  calm:    { bgClass: '',              label: null,        textClass: '' },
  warning: { bgClass: 'bg-amber-200',  label: 'Due today', textClass: 'text-amber-800' },
  alarm:   { bgClass: 'bg-red-200',    label: 'Overdue',   textClass: 'text-red-800' },
  done:    { bgClass: '',              label: null,        textClass: '' },
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

// Reusable context templates, after the prompt pattern catalogue
// (White et al., 2023).
const PROMPT_TEMPLATES = [
  {
    id: 'bug-repro',
    name: 'Bug reproduction',
    description: 'Structured template for reproducing a defect with environment, steps, expected vs actual behaviour.',
    body: '## Environment\n\n## Steps to reproduce\n1. \n2. \n3. \n\n## Expected\n\n## Actual\n\n## Hypothesis',
  },
  {
    id: 'feature-spec',
    name: 'Feature specification',
    description: 'User story + acceptance criteria + edge cases + out-of-scope.',
    body: '## User story\nAs a {user}, I want {goal}, so that {benefit}.\n\n## Acceptance criteria\n- [ ] \n- [ ] \n\n## Edge cases\n\n## Out of scope',
  },
  {
    id: 'debug-session',
    name: 'Debug session',
    description: 'Context for continuing a debugging thread with another AI session.',
    body: '## What I was debugging\n\n## What I tried\n- \n\n## What worked / didn\'t\n\n## Next hypothesis',
  },
  {
    id: 'refactor-plan',
    name: 'Refactor plan',
    description: 'Target code, intended change, risk assessment, verification steps.',
    body: '## Target\n\n## Goal\n\n## Risk\n\n## Verification',
  },
  {
    id: 'code-review',
    name: 'Code review request',
    description: 'Context block for asking another AI to review a specific change.',
    body: '## What changed\n\n## Why\n\n## Concerns\n\n## Reviewers please check',
  },
];

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

  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('vibetracker.sidebarCollapsed', false);

  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('vibetracker.auth', false);

  const [currentView, setCurrentView] = useLocalStorage('vibetracker.view', 'board');
  // Unknown stored values fall back to the board so <main> is never empty.
  const view = VIEW_LABELS[currentView] ? currentView : 'board';

  const [prefs, setPrefs] = useLocalStorage('vibetracker.prefs', {
    theme: 'dark',
    textSize: 'medium',
    reduceMotion: false,
    highContrast: false,
    accentColor: 'indigo',
  });

  // Percentages scale from the user's own browser font size (WCAG 1.4.4).
  useEffect(() => {
    const sizeMap = { small: '87.5%', medium: '100%', large: '112.5%' };
    document.documentElement.style.fontSize = sizeMap[prefs.textSize] || '100%';
  }, [prefs.textSize]);

  useEffect(() => {
    document.documentElement.classList.toggle(REDUCE_MOTION_CLASS, prefs.reduceMotion);
  }, [prefs.reduceMotion]);

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

  const handleCopyTemplate = async (template) => {
    const ok = await copyToClipboard(template.body);
    setToast(ok
      ? 'Template copied — paste into a task context field.'
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

  // Demo-only gate: any credentials work. Must stay below every hook above.
  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100">
      <SidebarNav
        collapsed={sidebarCollapsed}
        currentView={view}
        setCurrentView={setCurrentView}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
          viewLabel={VIEW_LABELS[view]}
          onNewTask={view === 'board' ? openNew : null}
        />
        <main className="flex-1 overflow-auto bg-zinc-950 p-6">
        {view === 'board' && (
        <>
      {/*
        TODO M4 data-model:
          Render a Kanban board with the four columns from STAGES.
          Each column should display the tasks whose status matches its id.
          Pre-populate 3-4 mock tasks so the board isn't empty on first load.

        TODO M5 crud-modal:
          Add a "+" button that opens a modal with every Task field.
          Clicking a card should open the same modal in edit mode.
      */}
      <section className="flex gap-4 overflow-x-auto pb-2">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter((t) => t.status === stage.id);
          return (
            <section
              key={stage.id}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`min-w-[280px] flex-1 rounded-lg bg-zinc-900/40 border border-zinc-800 p-3 transition ${
                dragOverStage === stage.id ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-zinc-950' : ''
              }`}
            >
              <header className={`mb-3 rounded-md px-3 py-2 ${STAGE_BG[stage.id]} border border-black/20`}>
                <h2 className="flex items-center justify-between text-sm font-semibold text-white">
                  <span>{stage.label}</span>
                  <span className="rounded-full bg-black/30 px-2 py-0.5 text-xs font-medium text-white/80">
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
                        aria-label={`${typeMeta.label} task. ${task.title}. Assigned to ${task.assignee}.${dueState === 'alarm' ? ' Overdue.' : dueState === 'warning' ? ' Due today.' : ''}`}
                        className={`w-full cursor-pointer rounded-lg ${dueMeta.bgClass || 'bg-white'} p-3 shadow-sm border border-white border-l-4 ${STAGE_LEFT_BORDER[stage.id]} ring-offset-zinc-950 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                          draggingId === task.id ? 'opacity-50' : dueState === 'done' ? 'opacity-75' : ''
                        }`}
                      >
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
                              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                <span className="inline-flex items-center gap-1 rounded-full bg-white border border-zinc-200 px-1.5 py-0.5">
                                  <TypeIcon type={task.type} className="h-3 w-3 text-zinc-700" />
                                  <span className="text-xs font-medium text-zinc-700">{typeMeta.label}</span>
                                </span>
                                {dueMeta.label && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-white border border-zinc-200 px-1.5 py-0.5">
                                    <span className={`text-xs font-semibold ${dueMeta.textClass}`}>{dueMeta.label}</span>
                                  </span>
                                )}
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
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                  </svg>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                      <circle cx="8.5" cy="7" r="4"/>
                                      <line x1="20" y1="8" x2="20" y2="14"/>
                                      <line x1="23" y1="11" x2="17" y2="11"/>
                                    </svg>
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
                                    <option value="" disabled>+</option>
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
        </>
        )}
        {view === 'dashboard' && <DashboardView tasks={tasks} />}
        {view === 'team' && <TeamView members={TEAM_MEMBERS} />}
        {view === 'contextLibrary' && (
          <ContextLibraryView templates={PROMPT_TEMPLATES} onCopy={handleCopyTemplate} />
        )}
        {view === 'settings' && (
          <SettingsView
            prefs={prefs}
            setPrefs={setPrefs}
            onSignOut={() => {
              setIsAuthenticated(false);
              setCurrentView('board');
            }}
          />
        )}
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
          className="fixed bottom-4 right-4 z-50 rounded-lg bg-white px-4 py-2 text-sm text-zinc-900 shadow-xl border border-zinc-200"
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
  team: (
    <svg {...ICON_PROPS}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  contextLibrary: (
    <svg {...ICON_PROPS}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  ),
  settings: (
    <svg {...ICON_PROPS}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ),
};

// Enabled items are live views; the rest are placeholders.
const NAV_ITEMS = [
  { id: 'board',          label: 'Board',           enabled: true },
  { id: 'dashboard',      label: 'Dashboard',       enabled: true },
  { id: 'team',           label: 'Team',            enabled: true },
  { id: 'contextLibrary', label: 'Context Library', enabled: true },
  { id: 'settings',       label: 'Settings',        enabled: true },
];

const VIEW_LABELS = {
  board:     'Board',
  dashboard: 'Dashboard',
  team:           'Team',
  contextLibrary: 'Context Library',
  settings:       'Settings',
};

// Arbitrary variant: kills transitions on every element under <html>.
const REDUCE_MOTION_CLASS = '[&_*]:!transition-none';

// Lucide sparkles (feature) and bug icons, sized by the caller.
function TypeIcon({ type, className }) {
  return type === 'feature' ? (
    <svg {...ICON_PROPS} className={className}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      <path d="M20 3v4"/>
      <path d="M22 5h-4"/>
      <path d="M4 17v2"/>
      <path d="M5 18H3"/>
    </svg>
  ) : (
    <svg {...ICON_PROPS} className={className}>
      <path d="m8 2 1.88 1.88"/>
      <path d="M14.12 3.88 16 2"/>
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/>
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/>
      <path d="M12 20v-9"/>
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5"/>
      <path d="M6 13H2"/>
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4"/>
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/>
      <path d="M22 13h-4"/>
      <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
    </svg>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-lg font-bold">v</div>
          <span className="text-xl font-semibold text-indigo-400">vibeline</span>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4 [color-scheme:dark]">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold text-zinc-100">Sign in</h1>
            <p className="text-xs text-zinc-400">Welcome back. This is a prototype build — sign in with any email and password, no account needed.</p>
          </div>

          <div>
            <label htmlFor="login-email" className="block text-xs font-medium text-zinc-400 mb-1">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
              required
              className="block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-medium text-zinc-400 mb-1">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
              <input type="checkbox" className="h-3.5 w-3.5 accent-brand-500" />
              Remember me
            </label>
            <button
              type="button"
              aria-disabled="true"
              title="Not available in this prototype"
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="block w-full rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            Sign in
          </button>

          <p className="text-center text-xs text-zinc-400 pt-1">
            New to vibeline?{' '}
            <button
              type="button"
              aria-disabled="true"
              title="Not available in this prototype"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Create account
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

// Settings building blocks live at module level so React keeps the same
// component identity across renders and keyboard focus isn't lost.
function SectionCard({ title, children }) {
  return (
    <section className="rounded-lg bg-zinc-900 border border-zinc-800 p-5 space-y-4">
      <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  );
}

function SettingsRow({ label, hint, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-t border-zinc-800 first:border-t-0 first:pt-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-100">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-zinc-400">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SegmentedButton({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-md border border-zinc-700 bg-zinc-800 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={`px-3 py-1 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-800 ${
            value === opt.value
              ? 'bg-brand-500 text-white'
              : 'text-zinc-300 hover:text-zinc-100'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
        className="h-4 w-4 accent-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
      />
    </label>
  );
}

const ACCENTS = [
  { value: 'indigo',  hex: '#6366f1' },
  { value: 'violet',  hex: '#8b5cf6' },
  { value: 'emerald', hex: '#10b981' },
  { value: 'amber',   hex: '#f59e0b' },
  { value: 'rose',    hex: '#f43f5e' },
];

// Text size and reduce motion apply live; theme, accent and high contrast
// only persist for now (future work).
function SettingsView({ prefs, setPrefs, onSignOut }) {
  const update = (key, value) => setPrefs({ ...prefs, [key]: value });

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">Customise your vibeline experience. Accessibility preferences follow WCAG 2.1 criteria.</p>
      </div>

      <SectionCard title="Appearance">
        <SettingsRow label="Theme" hint="Not yet active — light theme coming in a future release. WCAG 2.1 SC 1.4.11 (AA) — Non-text contrast.">
          <SegmentedButton
            label="Theme"
            options={[
              { value: 'dark', label: 'Dark' },
              { value: 'light', label: 'Light' },
            ]}
            value={prefs.theme}
            onChange={(v) => update('theme', v)}
          />
        </SettingsRow>
        <SettingsRow label="Accent colour" hint="Not yet active. Choose your brand highlight. Default: indigo.">
          <div role="group" aria-label="Accent colour" className="flex items-center gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => update('accentColor', a.value)}
                aria-label={`Accent ${a.value}`}
                aria-pressed={prefs.accentColor === a.value}
                title={a.value}
                className={`h-6 w-6 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                  prefs.accentColor === a.value ? 'border-zinc-100' : 'border-transparent'
                }`}
                style={{ backgroundColor: a.hex }}
              />
            ))}
          </div>
        </SettingsRow>
      </SectionCard>

      <SectionCard title="Reading">
        <SettingsRow label="Text size" hint="WCAG 2.1 SC 1.4.4 (AA) — Resize text up to 200% without loss of content or function.">
          <SegmentedButton
            label="Text size"
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
            ]}
            value={prefs.textSize}
            onChange={(v) => update('textSize', v)}
          />
        </SettingsRow>
        <SettingsRow label="High contrast mode" hint="Not yet active. WCAG 2.1 SC 1.4.6 (AAA) — Contrast (Enhanced). Minimum 7:1 for body text.">
          <Toggle label="High contrast mode" checked={prefs.highContrast} onChange={(v) => update('highContrast', v)} />
        </SettingsRow>
      </SectionCard>

      <SectionCard title="Motion">
        <SettingsRow label="Reduce motion" hint="WCAG 2.1 SC 2.3.3 (AAA) — Animation from interactions. Turns off transitions.">
          <Toggle label="Reduce motion" checked={prefs.reduceMotion} onChange={(v) => update('reduceMotion', v)} />
        </SettingsRow>
      </SectionCard>

      <SectionCard title="Account">
        <SettingsRow label="Signed in" hint="joe@vibeline.local">
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-full border border-red-500/50 bg-red-500/10 px-4 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            Sign out
          </button>
        </SettingsRow>
      </SectionCard>
    </div>
  );
}

function initialsOf(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function countBy(items, keyFn) {
  const counts = {};
  items.forEach((item) => {
    const key = keyFn(item);
    if (key) counts[key] = (counts[key] ?? 0) + 1;
  });
  return counts;
}

// Returns [key, count] for the largest bucket, or null when empty.
function topEntry(counts) {
  const entries = Object.entries(counts);
  if (entries.length === 0) return null;
  return entries.reduce((best, e) => (e[1] > best[1] ? e : best));
}

function taskOrder(t) {
  return Number(String(t.id).replace(/\D/g, '')) || 0;
}

function StatTile({ label, value, description, alert }) {
  return (
    <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${alert ? 'text-red-400' : 'text-zinc-100'}`}>{value}</p>
      <p className="mt-1 text-xs text-zinc-400">{description}</p>
    </div>
  );
}

function InsightTile({ label, primary, secondary }) {
  return (
    <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-lg font-semibold text-zinc-100">{primary}</p>
      <p className="text-xs text-zinc-400">{secondary}</p>
    </div>
  );
}

function DashboardView({ tasks }) {
  const overdueTasks = tasks
    .filter((t) => getDueState(t) === 'alarm')
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  const topAssignee = topEntry(countBy(tasks, (t) => t.assignee));
  const topTool = topEntry(countBy(tasks, (t) => t.contextTool));

  const closedBugs = tasks.filter((t) => t.type === 'bug' && t.status === 'done');
  const topCloser = topEntry(countBy(closedBugs, (t) => t.assignee));

  const activeTasks = tasks.filter((t) => t.status !== 'done');
  const withContext = activeTasks.filter(
    (t) => t.context && t.context.trim() && t.context.trim() !== CONTEXT_TEMPLATE.trim()
  );
  const contextPct = activeTasks.length
    ? Math.round((withContext.length / activeTasks.length) * 100)
    : 0;
  const reviewCount = tasks.filter((t) => t.status === 'review').length;

  const recent = [...tasks]
    .sort((a, b) =>
      (b.createdDate ?? '').localeCompare(a.createdDate ?? '') || taskOrder(b) - taskOrder(a)
    )
    .slice(0, 5);
  const stageLabel = Object.fromEntries(STAGES.map((s) => [s.id, s.label]));

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Welcome, Joe</h1>
        <p className="mt-1 text-sm text-zinc-400">Here's an overview of your project activity.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatTile label="Total tasks" value={tasks.length} description="Across all four columns" />
        <StatTile
          label="Overdue"
          value={overdueTasks.length}
          description="Past their due date"
          alert={overdueTasks.length > 0}
        />
        <StatTile label="Done this week" value={doneCount} description="Tasks currently in Done" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InsightTile
          label="Top assignee"
          primary={topAssignee ? topAssignee[0] : '—'}
          secondary={topAssignee ? `${topAssignee[1]} task${topAssignee[1] === 1 ? '' : 's'}` : 'No tasks yet'}
        />
        <InsightTile
          label="Most-used AI tool"
          primary={topTool ? topTool[0] : 'Claude'}
          secondary={topTool ? `${topTool[1]} context${topTool[1] === 1 ? '' : 's'}` : '0 contexts'}
        />
      </div>

      <section className="rounded-lg bg-zinc-900 border border-zinc-800 border-l-2 border-l-violet-500/50 p-4 space-y-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <TypeIcon type="feature" className="h-4 w-4 text-violet-400" />
            vibeline Insights
          </h2>
          <p className="text-xs text-zinc-400">Auto-generated · updated now</p>
        </div>
        <div className="space-y-3 text-sm text-zinc-300">
          <div>
            <p className="font-medium">This week:</p>
            <ul className="mt-1 list-disc pl-5 space-y-0.5">
              <li>
                {closedBugs.length} bug{closedBugs.length === 1 ? '' : 's'} closed
                {topCloser ? ` by ${topCloser[0]}` : ''}
              </li>
              <li>{overdueTasks.length} overdue {overdueTasks.length === 1 ? 'item needs' : 'items need'} attention</li>
              <li>Context field completeness: {contextPct}% of active tasks</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Suggested focus:</p>
            <ul className="mt-1 list-disc pl-5 space-y-0.5">
              <li>{overdueTasks[0] ? overdueTasks[0].title : 'No overdue tasks'}</li>
              <li>Review tasks in Review column ({reviewCount})</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Recent activity</h2>
        <ul className="rounded-lg bg-zinc-900 border border-zinc-800 divide-y divide-zinc-800">
          {recent.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-4 py-2.5">
              <div
                role="img"
                aria-label={t.assignee}
                title={t.assignee}
                className="h-7 w-7 shrink-0 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-semibold text-white"
              >
                {initialsOf(t.assignee)}
              </div>
              <p className="min-w-0 flex-1 truncate text-sm text-zinc-100">{t.title}</p>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-white ${STAGE_BG[t.status]}`}>
                {stageLabel[t.status]}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ContextLibraryView({ templates, onCopy }) {
  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Context Library</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Reusable prompt templates for your task context field. Based on the prompt pattern catalogue (White et al., 2023).
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((t) => (
          <li key={t.id} className="rounded-lg bg-zinc-900 border border-zinc-800 p-4 flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-zinc-100">{t.name}</h2>
            <p className="text-xs text-zinc-400">{t.description}</p>
            {/* Padding sits on the wrapper so the clamp doesn't leak a 5th line into it. */}
            <div className="rounded-md bg-zinc-950/60 border border-zinc-800 p-2">
              <pre className="line-clamp-4 whitespace-pre-wrap text-xs font-mono text-zinc-400">{t.body}</pre>
            </div>
            <div className="pt-1 mt-auto">
              <button
                type="button"
                onClick={() => onCopy(t)}
                aria-label={`Copy template: ${t.name}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-100 hover:border-brand-500 hover:text-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                <svg {...ICON_PROPS} className="h-3.5 w-3.5">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy template
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TeamView({ members }) {
  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Team</h1>
          <p className="mt-1 text-sm text-zinc-400">Members of your vibeline project.</p>
        </div>
        <button
          type="button"
          aria-disabled="true"
          title="Not yet implemented"
          className="shrink-0 rounded-full border border-zinc-700 px-4 py-1.5 text-xs font-medium text-zinc-300 cursor-not-allowed hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          + Invite member
        </button>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((m) => (
          <li key={m.id} className="rounded-lg bg-zinc-900 border border-zinc-800 p-4 flex items-start gap-3">
            <div
              aria-hidden="true"
              className="h-10 w-10 shrink-0 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-semibold text-white"
            >
              {initialsOf(m.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-100">{m.name}</p>
              <p className="text-xs text-zinc-400">{m.role}</p>
              <p className="text-xs text-zinc-400 mt-1 truncate">{m.email}</p>
            </div>
            <button
              type="button"
              aria-disabled="true"
              aria-label={`Remove ${m.name}`}
              title="Not yet implemented"
              className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 cursor-not-allowed hover:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Org / project switchers are an architectural mockup: only the active
// entry is real, the rest are placeholders.
const ACTIVE_ORG = 'Vibeline Labs';
const ACTIVE_PROJECT = 'vibeline';
const ORGS = [ACTIVE_ORG, 'Acme Studio'];
const PROJECTS = [ACTIVE_PROJECT, 'Marketing Site', 'Mobile App'];

function ChevronDown({ open }) {
  return (
    <svg
      {...ICON_PROPS}
      className={`h-3 w-3 shrink-0 motion-safe:transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

const SWITCHER_FOCUS = 'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900';

function SwitcherDisclosure({ kind, current, items, createLabel, collapsed, logo = false }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const panelId = `switcher-${kind.toLowerCase()}`;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        title={`${kind}: ${current}`}
        className={`flex w-full items-center gap-1 rounded-md py-1 text-left hover:bg-zinc-800 ${SWITCHER_FOCUS} ${
          collapsed ? 'justify-center px-0' : logo ? 'px-1' : 'pl-8 pr-1'
        }`}
      >
        {logo && (
          <span
            aria-hidden="true"
            className="h-6 w-6 shrink-0 rounded bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold"
          >
            v
          </span>
        )}
        <span className={collapsed ? 'sr-only' : `min-w-0 flex-1 truncate ${logo ? 'ml-1 text-sm font-semibold text-indigo-400' : 'text-sm text-zinc-300'}`}>
          <span className="sr-only">{kind}: </span>
          {current}
        </span>
        <span className="text-zinc-400">
          <ChevronDown open={open} />
        </span>
      </button>

      {open && (
        <ul
          id={panelId}
          aria-label={`${kind}s`}
          className="absolute left-0 top-full z-40 mt-1 w-52 rounded-md bg-zinc-800 border border-zinc-700 shadow-lg py-1"
        >
          {items.map((name) => (
            <li key={name}>
              {name === current ? (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-current="true"
                  className={`block w-full px-3 py-1.5 text-left text-sm text-zinc-100 bg-zinc-700/60 hover:bg-zinc-700 ${SWITCHER_FOCUS}`}
                >
                  {name}
                </button>
              ) : (
                <button
                  type="button"
                  aria-disabled="true"
                  title="Not yet implemented"
                  className={`block w-full px-3 py-1.5 text-left text-sm text-zinc-400 cursor-not-allowed ${SWITCHER_FOCUS}`}
                >
                  {name}
                </button>
              )}
            </li>
          ))}
          <li className="mt-1 border-t border-zinc-700 pt-1">
            <button
              type="button"
              aria-disabled="true"
              title="Not yet implemented"
              className={`block w-full px-3 py-1.5 text-left text-sm text-zinc-400 cursor-not-allowed ${SWITCHER_FOCUS}`}
            >
              {createLabel}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

function SidebarNav({ collapsed, currentView, setCurrentView }) {
  return (
    <aside
      id="sidebar"
      className={`${collapsed ? 'w-14' : 'w-60'} shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col`}
    >
      <div className={`${collapsed ? 'px-2' : 'px-3'} py-3 border-b border-zinc-800 space-y-1`}>
        <SwitcherDisclosure
          kind="Organisation"
          current={ACTIVE_ORG}
          items={ORGS}
          createLabel="+ Create organisation"
          collapsed={collapsed}
          logo
        />
        <SwitcherDisclosure
          kind="Project"
          current={ACTIVE_PROJECT}
          items={PROJECTS}
          createLabel="+ New project"
          collapsed={collapsed}
        />
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-2 py-3 space-y-1 text-sm">
        {NAV_ITEMS.map((item) => {
          const content = (
            <>
              {NAV_ICONS[item.id]}
              <span className={collapsed ? 'sr-only' : undefined}>{item.label}</span>
            </>
          );
          const base = `flex w-full items-center gap-2 px-3 py-1.5 rounded-md ${collapsed ? 'justify-center' : ''}`;
          if (!item.enabled) {
            return (
              <a
                key={item.id}
                aria-disabled="true"
                title={item.label}
                className={`${base} text-zinc-400 hover:text-zinc-200 cursor-not-allowed opacity-70`}
              >
                {content}
              </a>
            );
          }
          const selected = currentView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentView(item.id)}
              aria-current={selected ? 'page' : undefined}
              title={item.label}
              className={`${base} focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                selected
                  ? 'bg-zinc-800 text-zinc-50'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              {content}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
      <div className="border-t border-zinc-800 px-3 py-3 space-y-1.5 text-xs text-zinc-400">
        <p className="font-semibold text-zinc-500 uppercase tracking-wide text-[10px] mb-2">Legend</p>
        <div className="flex items-center gap-2">
          <TypeIcon type="feature" className="h-3 w-3 text-zinc-300" />
          <span>Feature</span>
        </div>
        <div className="flex items-center gap-2">
          <TypeIcon type="bug" className="h-3 w-3 text-zinc-300" />
          <span>Bug</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-4 rounded-sm bg-red-200 border border-white" />
          <span>Overdue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-4 rounded-sm bg-amber-200 border border-white" />
          <span>Due today</span>
        </div>
        <div className="flex items-center gap-2 opacity-75">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
          <span>Done</span>
        </div>
      </div>
      )}

      <div className={`border-t border-zinc-800 p-3 flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
        <div
          role="img"
          title="Joe Pocock"
          aria-label="Joe Pocock"
          className="h-8 w-8 shrink-0 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold"
        >
          JP
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-100 truncate">Joe Pocock</p>
            <p className="text-xs text-zinc-500 truncate">joe@vibeline.local</p>
          </div>
        )}
      </div>
    </aside>
  );
}

function Topbar({ collapsed, onToggle, viewLabel, onNewTask }) {
  const toggleLabel = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
  return (
    <header className="h-14 shrink-0 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label={toggleLabel}
          title={toggleLabel}
          aria-expanded={!collapsed}
          aria-controls="sidebar"
          className="h-8 w-8 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
          </svg>
        </button>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
          <span className="text-zinc-400">{ACTIVE_ORG}</span>
          <span className="text-zinc-700" aria-hidden="true">/</span>
          <span className="text-zinc-400">{ACTIVE_PROJECT}</span>
          <span className="text-zinc-700" aria-hidden="true">/</span>
          <span className="text-zinc-100 font-medium">{viewLabel}</span>
        </nav>
      </div>
      {onNewTask && (
        <button
          type="button"
          onClick={onNewTask}
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          + New task
        </button>
      )}
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

  const labelClass = 'block text-xs font-medium text-zinc-400 mb-1';
  const fieldClass =
    'block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900';

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto w-full max-w-lg rounded-lg bg-zinc-900 border border-zinc-800 p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto [color-scheme:dark]"
        >
          <h2 className="text-lg font-semibold text-zinc-100">
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
            <div className="mt-1 inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5">
              <TypeIcon type={formValues.type} className="h-3 w-3 text-zinc-300" />
              <span className="text-xs font-medium text-zinc-300">{TYPE_META[formValues.type].label}</span>
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
            <label htmlFor="task-context" className="block text-xs font-medium text-zinc-400 mb-1">
              Context
            </label>
            <textarea
              id="task-context"
              value={formValues.context}
              onChange={(e) => setFormValues({ ...formValues, context: e.target.value })}
              rows={8}
              className="block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
              placeholder="Markdown briefing for the next AI session"
            />
            {initialTask?.contextUpdatedAt && (
              <p className="mt-1 text-xs text-zinc-400">
                Last updated {timeAgo(initialTask.contextUpdatedAt)}
              </p>
            )}
            {initialTask && (
              <button
                type="button"
                onClick={onCopy}
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-100 hover:border-brand-500 hover:text-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                <span>Copy Context</span>
              </button>
            )}
          </div>

          <div>
            <label htmlFor="task-context-tool" className="block text-xs font-medium text-zinc-400 mb-1">
              AI tool
            </label>
            <select
              id="task-context-tool"
              value={formValues.contextTool ?? ''}
              onChange={(e) => setFormValues({ ...formValues, contextTool: e.target.value || null })}
              className="block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
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
                className="text-sm font-medium text-red-400 hover:text-red-300 hover:underline"
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
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
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
