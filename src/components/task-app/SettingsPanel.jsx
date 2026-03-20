export default function SettingsPanel({
  isOpen,
  settings,
  categoryOptions,
  bucketOptions,
  onChange,
  onClose,
  onResetDemo,
  onClearCompleted,
}) {
  if (!isOpen) return null;

  function update(field, value) {
    onChange((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/30 backdrop-blur-[2px]">
      <section className="flex h-full w-full max-w-md flex-col bg-white shadow-[0_12px_40px_rgba(15,23,42,0.18)]">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Settings</h3>
            <p className="mt-1 text-sm text-slate-500">
              Workspace preferences and defaults
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            Close
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Workspace name</span>
            <input
              type="text"
              value={settings.workspaceName}
              onChange={(event) => update("workspaceName", event.target.value)}
              className="w-full rounded-[12px] border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-300"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Owner name</span>
            <input
              type="text"
              value={settings.ownerName}
              onChange={(event) => update("ownerName", event.target.value)}
              className="w-full rounded-[12px] border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-300"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Default category</span>
            <select
              value={settings.defaultCategory}
              onChange={(event) => update("defaultCategory", event.target.value)}
              className="w-full rounded-[12px] border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-300"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Default list</span>
            <select
              value={settings.defaultBucket}
              onChange={(event) => update("defaultBucket", event.target.value)}
              className="w-full rounded-[12px] border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-300"
            >
              {bucketOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Default due</span>
            <input
              type="text"
              value={settings.defaultDue}
              onChange={(event) => update("defaultDue", event.target.value)}
              className="w-full rounded-[12px] border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-300"
            />
          </label>

          <div className="rounded-[14px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-800">Utilities</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onClearCompleted}
                className="rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Clear completed
              </button>
              <button
                type="button"
                onClick={onResetDemo}
                className="rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Restore demo tasks
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
