import { useEffect, useState } from "react";

const randomUUID = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
import Sidebar from "./components/task-app/Sidebar.jsx";
import Topbar from "./components/task-app/Topbar.jsx";
import TaskFilters from "./components/task-app/TaskFilters.jsx";
import TaskTable from "./components/task-app/TaskTable.jsx";
import InsightsPanel from "./components/task-app/InsightsPanel.jsx";
import SettingsPanel from "./components/task-app/SettingsPanel.jsx";
import NewTaskModal from "./components/task-app/NewTaskModal.jsx";
import {
  APP_NAME,
  BUCKET_OPTIONS,
  CATEGORY_OPTIONS,
  DEFAULT_SETTINGS,
  SECTION_META,
  SIDEBAR_ITEMS,
  SETTINGS_STORAGE_KEY,
  STARTER_TASKS,
  STORAGE_KEY,
  formatDateText,
  getSidebarCount,
} from "./components/task-app/data.js";

function makeNotification(label, value) {
  return {
    id: randomUUID(),
    label,
    value,
  };
}

function loadItems() {
  if (typeof window === "undefined") return STARTER_TASKS;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return STARTER_TASKS;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : STARTER_TASKS;
  } catch {
    return STARTER_TASKS;
  }
}

function loadSettings() {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function App() {
  const [items, setItems] = useState(() => loadItems());
  const [settings, setSettings] = useState(() => loadSettings());
  const [composer, setComposer] = useState({
    text: "",
    category: DEFAULT_SETTINGS.defaultCategory,
    due: DEFAULT_SETTINGS.defaultDue,
    bucket: DEFAULT_SETTINGS.defaultBucket,
    flagged: false,
  });
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("all");
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    bucket: "all",
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => [
    makeNotification("Welcome", "Your workspace is ready."),
  ]);
  const [unreadCount, setUnreadCount] = useState(1);

  useEffect(() => {
    document.title = settings.workspaceName || APP_NAME;
  }, [settings.workspaceName]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const visibleItems = items.filter((item) => {
    const matchesSection =
      section === "all"
        ? true
        : section === "done"
          ? item.done
          : item.bucket === section;
    const matchesStatus =
      filters.status === "flagged"
        ? item.flagged && !item.done
        : filters.status === "open"
          ? !item.done
          : filters.status === "done"
            ? item.done
            : true;
    const matchesCategory =
      filters.category === "all" ? true : item.category === filters.category;
    const matchesBucket =
      filters.bucket === "all" ? true : item.bucket === filters.bucket;
    const haystack = [item.text, item.category, item.due, item.bucket].join(" ").toLowerCase();
    const matchesSearch = haystack.includes(search.toLowerCase());
    return matchesSection && matchesStatus && matchesCategory && matchesBucket && matchesSearch;
  });

  const totalCount = items.length;
  const doneCount = items.filter((item) => item.done).length;
  const openCount = items.filter((item) => !item.done).length;
  const overdueCount = items.filter((item) => item.flagged && !item.done).length;
  const streakDays = 5;
  const activeSection = SECTION_META[section] || SECTION_META.all;
  useEffect(() => {
    setComposer((current) => ({
      ...current,
      category: current.text ? current.category : settings.defaultCategory,
      due: current.text ? current.due : settings.defaultDue,
      bucket: current.text ? current.bucket : settings.defaultBucket,
    }));
  }, [settings.defaultBucket, settings.defaultCategory, settings.defaultDue]);

  function pushNotification(label, value) {
    setNotifications((current) => [
      makeNotification(label, value),
      ...current,
    ].slice(0, 8));
    setUnreadCount((current) => current + 1);
  }

  function addItem(event) {
    event.preventDefault();
    const text = composer.text.trim();
    if (!text) return;

    setItems((current) => [
      {
        id: randomUUID(),
        text,
        done: false,
        category: composer.category,
        due: composer.due.trim() || "",
        flagged: composer.flagged,
        bucket: composer.bucket,
      },
      ...current,
    ]);
    pushNotification("Task created", `"${text}" was added to ${composer.bucket}.`);
    setComposer({
      text: "",
      category: settings.defaultCategory,
      due: settings.defaultDue,
      bucket: settings.defaultBucket,
      flagged: false,
    });
    setNewTaskOpen(false);
  }

  function toggleItem(id) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const nextDone = !item.done;
        pushNotification(
          nextDone ? "Task completed" : "Task reopened",
          `"${item.text}" is now ${nextDone ? "done" : "active"}.`,
        );
        return { ...item, done: nextDone };
      }),
    );
  }

  function toggleFlag(id) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const nextFlagged = !item.flagged;
        pushNotification(
          nextFlagged ? "Task flagged" : "Task unflagged",
          `"${item.text}" was ${nextFlagged ? "flagged" : "updated"}.`,
        );
        return { ...item, flagged: nextFlagged };
      }),
    );
  }

  function deleteItem(id) {
    setItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        pushNotification("Task deleted", `"${target.text}" was removed.`);
      }
      return current.filter((item) => item.id !== id);
    });
  }

  function updateItem(id, updates) {
    setItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        pushNotification("Task updated", `"${updates.text || target.text}" was updated.`);
      }
      return current.map((item) => (item.id === id ? { ...item, ...updates } : item));
    });
  }

  function clearCompleted() {
    setItems((current) => {
      const removedCount = current.filter((item) => item.done).length;
      if (removedCount > 0) {
        pushNotification("Completed cleared", `${removedCount} completed tasks were removed.`);
      }
      return current.filter((item) => !item.done);
    });
  }

  function restoreDemoTasks() {
    setItems(STARTER_TASKS);
    pushNotification("Demo restored", "Starter tasks were restored.");
  }

  function handleStartNewTask() {
    setSection("today");
    setFilters({ status: "all", category: "all", bucket: "all" });
    setSearch("");
    setNewTaskOpen(true);
  }

  return (
    <main className="h-screen overflow-hidden bg-[#eef3f7] text-slate-900">
      <section className="h-screen overflow-hidden bg-[#eef3f7]">
        <div className="grid h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
          <Sidebar
            appName={settings.workspaceName || APP_NAME}
            ownerName={settings.ownerName}
            items={items}
            navItems={SIDEBAR_ITEMS}
            section={section}
            onSectionChange={setSection}
            getCount={getSidebarCount}
            onOpenSettings={() => setSettingsOpen(true)}
          />

          <section className="flex h-screen min-h-0 flex-col bg-[#eef3f7]">
            <Topbar
              ownerName={settings.ownerName}
              notifications={notifications}
              unreadCount={unreadCount}
              notificationsOpen={notificationsOpen}
              onToggleNotifications={() => {
                setNotificationsOpen((value) => {
                  const next = !value;
                  if (next) setUnreadCount(0);
                  return next;
                });
              }}
              onCloseNotifications={() => setNotificationsOpen(false)}
              onOpenSettings={() => {
                setNotificationsOpen(false);
                setSettingsOpen(true);
              }}
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
              }}
            />

            <div className="min-h-0 flex-1 overflow-hidden">
              <div className="grid h-full gap-4 px-5 py-3 xl:grid-cols-[minmax(0,1fr)_220px]">
              <section className="flex min-h-0 flex-col">
                <div className="flex flex-col gap-2 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-slate-950 sm:text-[1.6rem]">
                      {activeSection.title}
                    </h2>
                    <p className="mt-0.5 text-[13px] text-slate-600">
                      {formatDateText()} | {activeSection.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartNewTask}
                    className="rounded-[10px] bg-[linear-gradient(180deg,#4492ff_0%,#2170eb_100%)] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-[0_6px_14px_rgba(32,112,235,0.16)] transition hover:brightness-105"
                  >
                    + Add New Task
                  </button>
                </div>

                <TaskFilters
                  filters={filters}
                  categoryOptions={CATEGORY_OPTIONS}
                  bucketOptions={BUCKET_OPTIONS}
                  onChange={setFilters}
                  onReset={() =>
                    setFilters({ status: "all", category: "all", bucket: "all" })
                  }
                />

                <TaskTable
                  items={visibleItems}
                  categoryOptions={CATEGORY_OPTIONS}
                  bucketOptions={BUCKET_OPTIONS}
                  onToggleItem={toggleItem}
                  onToggleFlag={toggleFlag}
                  onDeleteItem={deleteItem}
                  onUpdateItem={updateItem}
                  emptyTitle={activeSection.emptyTitle}
                  emptyDescription={activeSection.emptyDescription}
                />
              </section>

              <div className="min-h-0">
                <InsightsPanel
                  totalCount={totalCount}
                  doneCount={doneCount}
                  openCount={openCount}
                  overdueCount={overdueCount}
                  streakDays={streakDays}
                  onOpenCompleted={() => setSection("done")}
                onOpenOverdue={() => {
                  setSection("all");
                  setSearch("");
                  setFilters((current) => ({ ...current, status: "flagged" }));
                }}
              />
              </div>
              </div>
            </div>
          </section>
        </div>

        <SettingsPanel
          isOpen={settingsOpen}
          settings={settings}
          categoryOptions={CATEGORY_OPTIONS}
          bucketOptions={BUCKET_OPTIONS}
          onChange={setSettings}
          onClose={() => setSettingsOpen(false)}
          onResetDemo={restoreDemoTasks}
          onClearCompleted={clearCompleted}
        />

        <NewTaskModal
          isOpen={newTaskOpen}
          composer={composer}
          categoryOptions={CATEGORY_OPTIONS}
          bucketOptions={BUCKET_OPTIONS}
          onComposerChange={setComposer}
          onClose={() => setNewTaskOpen(false)}
          onSubmit={addItem}
        />
      </section>
    </main>
  );
}
