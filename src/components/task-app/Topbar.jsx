import { useEffect, useRef } from "react";
import { BellIcon, ChevronIcon, SearchIcon } from "./Icons.jsx";

function NotificationsMenu({ notifications }) {
  return (
    <div className="absolute right-0 top-10 z-20 w-60 rounded-[12px] border border-slate-200 bg-white p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.10)]">
      <p className="px-2 pb-2 text-sm font-semibold text-slate-900">Notifications</p>
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="rounded-[10px] bg-slate-50 px-3 py-3 text-sm text-slate-500">
            No notifications yet.
          </div>
        ) : null}
        {notifications.map((item) => (
          <div key={item.id} className="rounded-[10px] bg-slate-50 px-3 py-2">
            <p className="text-sm font-medium text-slate-800">{item.label}</p>
            <p className="mt-1 text-xs text-slate-500">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Topbar({
  ownerName,
  notifications,
  unreadCount,
  notificationsOpen,
  onToggleNotifications,
  onCloseNotifications,
  onOpenSettings,
  search,
  onSearchChange,
}) {
  const notificationsRef = useRef(null);

  useEffect(() => {
    if (!notificationsOpen) return undefined;

    function handlePointerDown(event) {
      if (!notificationsRef.current?.contains(event.target)) {
        onCloseNotifications();
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [notificationsOpen, onCloseNotifications]);

  return (
    <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
      <label className="flex w-full max-w-[480px] items-center gap-3 rounded-[12px] border border-slate-200 bg-[#f8fafc] px-3.5 py-2 text-slate-400">
        <SearchIcon />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
        />
      </label>

      <div className="flex items-center gap-3 self-end lg:self-auto">
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={onToggleNotifications}
            className="relative rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <BellIcon />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {Math.min(unreadCount, 9)}
              </span>
            ) : null}
          </button>
          {notificationsOpen ? <NotificationsMenu notifications={notifications} /> : null}
        </div>
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7d949e] text-sm font-semibold text-white"
        >
          {ownerName.slice(0, 1).toUpperCase()}
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
        >
          <ChevronIcon />
        </button>
      </div>
    </header>
  );
}
