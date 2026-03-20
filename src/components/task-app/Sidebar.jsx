import { CalendarIcon, GridIcon, InboxIcon } from "./Icons.jsx";

function sidebarIconFor(id) {
  if (id === "all") return <GridIcon />;
  if (id === "inbox") return <InboxIcon />;
  return <CalendarIcon />;
}

export default function Sidebar({
  appName,
  ownerName,
  items,
  navItems,
  section,
  onSectionChange,
  getCount,
  onOpenSettings,
}) {
  return (
    <aside className="flex h-screen flex-col overflow-y-auto bg-[linear-gradient(180deg,#0f1722_0%,#111b27_100%)] px-5 py-6 text-white">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,#4fa3ff_0%,#2b78ee_100%)] text-base font-bold text-white shadow-[0_10px_20px_rgba(43,120,238,0.28)]">
          ⚡
        </div>
        <h1 className="text-[1.5rem] font-semibold tracking-[-0.03em]">{appName}</h1>
      </div>

      <nav className="mt-8 space-y-1.5">
        {navItems.map((item) => {
          const active = item.id === section;
          const count = getCount(items, item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left transition ${
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-slate-400">{sidebarIconFor(item.id)}</span>
                <span className="text-[15px] font-medium">{item.label}</span>
              </span>
              {count > 0 ? (
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-200">
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-white/10 pt-5">
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <span className="text-slate-400">
            <CalendarIcon />
          </span>
          <span className="text-[15px] font-medium">Settings</span>
        </button>
      </div>

      <div className="mt-auto border-t border-white/10 pt-5">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#738692] text-sm font-semibold">
            {ownerName.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-[15px] font-medium text-white">{ownerName}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
