import { PlusIcon } from "lucide-react";

export default function CreateCourse() {
  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-[0_6px_30px_-12px_rgba(15,23,42,0.35)] backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-300/80 hover:shadow-[0_10px_40px_-16px_rgba(15,23,42,0.45)] dark:border-slate-800/80 dark:bg-slate-950/60">
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-linear-to-br from-indigo-200/60 via-sky-200/50 to-transparent blur-2xl transition group-hover:scale-110 dark:from-indigo-500/20 dark:via-cyan-400/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-14 h-40 w-40 rounded-full bg-linear-to-tr from-rose-200/60 via-amber-200/40 to-transparent blur-2xl transition group-hover:scale-110 dark:from-rose-500/15 dark:via-amber-400/10" />

      <div className="relative flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h4 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Create Course
          </h4>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-700 shadow-sm transition group-hover:scale-105 group-hover:border-slate-300 group-hover:bg-white dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-200">
          <PlusIcon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
