import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function CreateCourse() {
  return (
    <div className="group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-300 bg-white/70 p-6 text-center shadow-[0_6px_30px_-12px_rgba(15,23,42,0.35)] backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-300/80 hover:shadow-[0_10px_40px_-16px_rgba(15,23,42,0.45)] dark:border-slate-600 dark:bg-linear-to-br dark:from-slate-900/95 dark:via-slate-900 dark:to-slate-950/70">
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-linear-to-br from-indigo-200/60 via-sky-200/50 to-transparent blur-2xl transition group-hover:scale-110 dark:from-indigo-400/35 dark:via-cyan-300/25" />
      <div className="pointer-events-none absolute -bottom-20 -left-14 h-40 w-40 rounded-full bg-linear-to-tr from-rose-200 via-amber-200 to-transparent blur-2xl transition group-hover:scale-110 dark:from-rose-400/30 dark:via-amber-300/25" />

      <div className="relative flex w-full flex-col items-center justify-center gap-4">
        <div className="space-y-2">
          <h4 className="scroll-m-20 text-xl font-bold tracking-tight">
            Create Course
          </h4>
        </div>

        <Link href="/new">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-700 shadow-sm transition group-hover:scale-105 group-hover:border-slate-300 group-hover:bg-white dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-200">
            <PlusIcon className="h-5 w-5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
