function InsightCard({ title, rows, onRowClick }) {
  return (
    <section className="rounded-[14px] border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <h3 className="text-[1rem] font-semibold tracking-[-0.02em] text-slate-950">
        {title}
      </h3>
      <div className="mt-4 space-y-3 text-[14px]">
        {rows.map((row) => (
          <button
            key={row.label}
            type="button"
            onClick={() => onRowClick?.(row.label)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-slate-600">{row.label}</span>
            <strong className="text-slate-950">{row.value}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function InsightsPanel({
  totalCount,
  doneCount,
  openCount,
  overdueCount,
  streakDays,
  onOpenOverdue,
  onOpenCompleted,
}) {
  const completionRate = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  return (
    <aside className="sticky top-0 space-y-4">
      <InsightCard
        title="Analytics"
        rows={[
          { label: "Tasks", value: totalCount },
          { label: "Open", value: openCount },
          { label: "Done", value: doneCount },
          { label: "Completion", value: `${completionRate}%` },
          { label: "Streak", value: `${streakDays} days` },
        ]}
        onRowClick={(label) => {
          if (label === "Done") onOpenCompleted?.();
        }}
      />

      <InsightCard
        title="Quick Links"
        rows={[{ label: "Overdue Tasks", value: overdueCount }]}
        onRowClick={(label) => {
          if (label === "Overdue Tasks") onOpenOverdue?.();
        }}
      />
    </aside>
  );
}
