import { useState } from "react";
import { CATEGORY_STYLES } from "./data.js";
import { CheckMarkCircle, FlagIcon, PencilIcon, TrashIcon } from "./Icons.jsx";

function EmptyState({ title, description }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="text-2xl font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-slate-500">{description}</p>
    </div>
  );
}

function TaskRow({
  item,
  isLast,
  onToggleItem,
  onToggleFlag,
  onDeleteItem,
  onUpdateItem,
  categoryOptions,
  bucketOptions,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    text: item.text,
    category: item.category,
    due: item.due,
    bucket: item.bucket,
    flagged: item.flagged,
  });

  function submitEdit(event) {
    event.preventDefault();
    const text = draft.text.trim();
    if (!text) return;
    onUpdateItem(item.id, {
      text,
      category: draft.category,
      due: draft.due.trim(),
      bucket: draft.bucket,
      flagged: draft.flagged,
    });
    setIsEditing(false);
  }

  return (
    <article
      className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 ${
        isLast ? "" : "border-b border-slate-200"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggleItem(item.id)}
        className="text-slate-400 transition hover:text-sky-600"
        aria-label={item.done ? "Mark task as active" : "Mark task as done"}
      >
        <CheckMarkCircle checked={item.done} />
      </button>

      <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_180px_80px] xl:items-center">
        {isEditing ? (
          <form onSubmit={submitEdit}>
            <div className="grid gap-2 xl:grid-cols-[minmax(0,1fr)_180px_80px_120px]">
              <input
                type="text"
                value={draft.text}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, text: event.target.value }))
                }
                autoFocus
                className="w-full rounded-[10px] border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-slate-400"
              />
              <select
                value={draft.category}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, category: event.target.value }))
                }
                className="rounded-[10px] border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-slate-400"
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={draft.due}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, due: event.target.value }))
                }
                placeholder="Due"
                className="rounded-[10px] border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-slate-400"
              />
              <select
                value={draft.bucket}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, bucket: event.target.value }))
                }
                className="rounded-[10px] border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-slate-400"
              >
                {bucketOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </form>
        ) : (
          <p
            className={`min-w-0 truncate pr-2 text-[14px] font-medium ${
              item.done ? "text-slate-400 line-through" : "text-slate-950"
            }`}
          >
            {item.text}
          </p>
        )}

        <span
          className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            CATEGORY_STYLES[item.category] || CATEGORY_STYLES.General
          }`}
        >
          {item.category}
        </span>

        <span className="text-[14px] text-slate-700">{item.due || ""}</span>
      </div>

      <div className="flex items-center gap-3 text-slate-400">
        <button
          type="button"
          onClick={() => (isEditing ? setDraft((current) => ({ ...current, flagged: !current.flagged })) : onToggleFlag(item.id))}
          className="transition hover:text-red-500"
          aria-label="Toggle task flag"
        >
          <FlagIcon active={isEditing ? draft.flagged : item.flagged} />
        </button>
        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              submitEdit({ preventDefault() {} });
              return;
            }
            setDraft({
              text: item.text,
              category: item.category,
              due: item.due,
              bucket: item.bucket,
              flagged: item.flagged,
            });
            setIsEditing(true);
          }}
          className="transition hover:text-slate-700"
          aria-label={isEditing ? "Save task" : "Edit task"}
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          onClick={() => onDeleteItem(item.id)}
          className="transition hover:text-slate-700"
          aria-label="Delete task"
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  );
}

export default function TaskTable({
  items,
  onToggleItem,
  onToggleFlag,
  onDeleteItem,
  onUpdateItem,
  categoryOptions,
  bucketOptions,
  emptyTitle,
  emptyDescription,
}) {
  return (
    <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
      <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_180px_80px_112px] border-b border-slate-200 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        <span>Task</span>
        <span>Project</span>
        <span>Due</span>
        <span>Actions</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          items.map((item, index) => (
            <TaskRow
              key={item.id}
              item={item}
              isLast={index === items.length - 1}
              onToggleItem={onToggleItem}
              onToggleFlag={onToggleFlag}
              onDeleteItem={onDeleteItem}
              onUpdateItem={onUpdateItem}
              categoryOptions={categoryOptions}
              bucketOptions={bucketOptions}
            />
          ))
        )}
      </div>
    </div>
  );
}
