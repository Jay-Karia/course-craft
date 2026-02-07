type CourseEditPageProps = {
  params: { courseId: string };
};

export default function CourseEditPage({ params }: CourseEditPageProps) {
  return (
    <div className="min-h-screen bg-slate-50/70 px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Course editor
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Customize your course before publishing.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_8px_30px_-16px_rgba(15,23,42,0.35)] dark:border-slate-800/80 dark:bg-slate-900/70">
          <div className="flex flex-col gap-3 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Course ID
            </div>
            <div className="rounded-lg border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-slate-700 dark:border-slate-700/70 dark:bg-slate-950/40 dark:text-slate-200">
              {params.courseId}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This is a placeholder editor page. Add editing controls here.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
