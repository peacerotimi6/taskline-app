import { useEffect, useRef, useState } from "react";
import { createInputController } from "./input.js";
import { createRenderer } from "./renderer.js";
import { createGame } from "./game.js";
import { GAME_CONFIG } from "./config.js";
import { getAppConfig } from "./runtime-config.js";
import { loadRuns, saveRun, topRuns } from "./runs.js";

const APP = getAppConfig();

function StatCard({ label, value }) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white/72 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur">
      <span className="block text-[9px] font-medium uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <strong className="mt-1.5 block text-base font-semibold tracking-[-0.03em] text-slate-950">
        {value}
      </strong>
    </article>
  );
}

export default function App() {
  const cRef = useRef(null), gRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [runs, setRuns] = useState(() => loadRuns());
  const [hud, setHud] = useState({
    score: 0,
    level: 1,
    lives: 3,
    time: GAME_CONFIG.totalTimeSeconds,
    powerUp: "None",
    combo: 0,
    mode: "Normal",
    special: 0,
  });
  const best = topRuns(runs)[0]?.score || 0;
  const stats = [
    { label: "Score", value: hud.score },
    { label: "Best", value: best },
    { label: "Level", value: hud.level },
    { label: "Lives", value: hud.lives },
    { label: "Time", value: `${hud.time}s` },
    { label: "Special", value: hud.special > 0 ? `${hud.special}s` : "Ready" },
  ];

  useEffect(() => {
    const canvas = cRef.current;
    if (!canvas) return undefined;

    const game = createGame({
      input: createInputController(canvas),
      renderer: createRenderer(canvas),
      onHUDUpdate: setHud,
      onSessionEnd: (session) => setRuns(saveRun(session)),
    });

    gRef.current = game;
    game.start();

    return () => {
      game.stop();
      gRef.current = null;
    };
  }, []);

  useEffect(() => {
    document.title = APP.appTitle;
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#eef2f7_48%,_#dce4ee_100%)] px-3 py-4 text-slate-950 sm:px-5 lg:px-6">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-3 rounded-[26px] border border-slate-950/8 bg-white/80 p-3.5 shadow-[0_24px_72px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-4">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-medium tracking-[-0.07em] text-slate-950 sm:text-4xl">
            {APP.appTitle}
          </h1>
          <div className="rounded-full border border-slate-900/8 bg-slate-950/[0.03] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-sm">
            Arcade
          </div>
        </header>

        <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-[linear-gradient(180deg,#fafdff_0%,#ebf1f7_100%)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_16px_28px_rgba(15,23,42,0.05)]">
          <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-[linear-gradient(180deg,#fbfdff_0%,#edf3f8_100%)] shadow-[0_12px_24px_rgba(15,23,42,0.07)]">
          <canvas
            ref={cRef}
            id="game-canvas"
            width={GAME_CONFIG.width}
            height={GAME_CONFIG.height}
            aria-label="Game area"
            className="mx-auto block h-auto max-h-[58vh] w-full"
          />
          </div>
        </section>

        <section className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {stats.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              className="h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(15,23,42,0.22)] transition hover:bg-slate-800"
              onClick={() => {
                gRef.current?.restart();
                setPaused(false);
              }}
            >
              Restart
            </button>
            <button
              className="h-11 rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white"
              onClick={() => {
                const ok = paused ? gRef.current?.resume() : gRef.current?.pause();
                if (ok) setPaused((value) => !value);
              }}
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              className="h-11 rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white"
              onClick={() => {
                if (gRef.current?.abort()) setPaused(false);
              }}
            >
              Abort
            </button>
            <button
              className="h-11 rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              disabled={hud.special > 0 || paused}
              onClick={() => gRef.current?.triggerSpecial()}
            >
              Special
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
