import { useEffect } from "react";
import TaskComposer from "./TaskComposer.jsx";

export default function NewTaskModal({
  isOpen,
  composer,
  categoryOptions,
  bucketOptions,
  onComposerChange,
  onClose,
  onSubmit,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(event) {
    onSubmit(event);
    if (composer.text.trim()) onClose();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/35 px-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <section className="relative z-10 w-full max-w-3xl rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[1.15rem] font-semibold text-slate-950">Add new task</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              Create a task with its project, due label, list, and priority flag.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] px-3 py-1.5 text-[13px] text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            Close
          </button>
        </div>

        <TaskComposer
          composer={composer}
          categoryOptions={categoryOptions}
          bucketOptions={bucketOptions}
          onComposerChange={onComposerChange}
          onSubmit={handleSubmit}
          compact={false}
        />
      </section>
    </div>
  );
}
