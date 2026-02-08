"use client";

import { useState } from "react";

type DoubtSolverProps = {
  lessonTitle?: string | null;
};

export default function DoubtSolver({ lessonTitle }: DoubtSolverProps) {
  const [draft, setDraft] = useState("");

  return (
    <div className="sticky top-24 rounded-2xl border border-slate-200/70 bg-white/90 p-5 text-sm shadow-[0_10px_40px_-20px_rgba(15,23,42,0.3)] dark:border-slate-800/80 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Doubt solver
          </p>
          <h3 className="text-base font-semibold">
            Ask about {lessonTitle ?? "this lesson"}
          </h3>
        </div>
        <span className="rounded-full border border-slate-200/70 bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-300">
          Placeholder
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 text-xs text-slate-600 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-300">
          <p className="font-semibold text-slate-700 dark:text-slate-200">
            You
          </p>
          <p>What is the main takeaway for this lesson?</p>
        </div>
        <div className="rounded-xl border border-slate-200/70 bg-white/90 p-3 text-xs text-slate-600 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-300">
          <p className="font-semibold text-slate-700 dark:text-slate-200">
            AI Tutor
          </p>
          <p>
            Placeholder response. The AI tutor will answer with lesson-specific
            guidance and references.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          className="w-full rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-xs text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-200"
          placeholder="Ask a question about this lesson..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
          type="button"
        >
          Send
        </button>
      </div>
    </div>
  );
}
