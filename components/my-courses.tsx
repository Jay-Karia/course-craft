import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function MyCourses() {
  const myCourses = [
    {
      id: "product-design-foundations",
      status: "In progress",
      statusClasses:
        "bg-indigo-100/70 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200",
      updatedAt: "Updated 2d ago",
      title: "Product Design Foundations",
      description: "Build confident user flows and polish UX handoffs.",
      progress: 64,
      lessons: 12,
      quizzes: 4,
      timeLeft: "3h 20m left",
      glowClasses:
        "-right-10 -top-10 bg-linear-to-br from-indigo-200/70 via-sky-200/60 to-transparent dark:from-indigo-500/30 dark:via-cyan-400/20",
    },
    {
      id: "intro-motion-systems",
      status: "Completed",
      statusClasses:
        "bg-emerald-100/70 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
      updatedAt: "Finished Jan 28",
      title: "Intro to Motion Systems",
      description: "Understand timing curves and micro-interactions.",
      progress: null,
      lessons: 18,
      quizzes: 0,
      timeLeft: null,
      actionLabel: "View certificate",
      glowClasses:
        "-left-12 -bottom-12 bg-linear-to-tr from-rose-200/70 via-amber-200/60 to-transparent dark:from-rose-500/25 dark:via-amber-400/20",
    },
  ];

  const exploreCard = {
    title: "Need a new challenge?",
    description: "Browse the catalog and pick your next skill sprint.",
    actionLabel: "Explore courses",
    link: "/courses",
  };

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            My Courses
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Jump back in or keep learning.
          </p>
        </div>
        <button className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-200">
          View all
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {myCourses.map((course) => (
          <div
            key={course.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_6px_24px_-14px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_34px_-18px_rgba(15,23,42,0.45)] dark:border-slate-800/80 dark:bg-slate-900/70"
          >
            <div
              className={`absolute h-24 w-24 rounded-full blur-2xl ${course.glowClasses}`}
            />
            <div className="relative space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {course.title}
                  </h3>
                  <div className="hover:translate-x-0.5 transition-transform hover:border rounded-full p-2 hover:cursor-pointer border-gray-300 dark:border-gray-600">
                    <MdKeyboardArrowRight className="h-5 w-5 text-slate-400 transition group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" />
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {course.description}
                </p>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-xs text-slate-700 dark:text-slate-400">
                  {course.updatedAt}
                </span>
              </div>
              {course.progress !== null ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-yellow-300 via-green-300 to-cyan-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ) : null}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {course.lessons} lessons
                  {course.quizzes ? ` · ${course.quizzes} quizzes` : ""}
                </span>
                {course.timeLeft ? <span>{course.timeLeft}</span> : null}
                {course.actionLabel ? (
                  <button className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-200">
                    {course.actionLabel}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}

        <div className="group relative overflow-hidden rounded-2xl border border-dashed border-slate-300/80 bg-slate-50/70 p-6 text-center shadow-[0_6px_24px_-16px_rgba(15,23,42,0.25)] transition hover:-translate-y-1 hover:border-slate-400 hover:bg-white dark:border-slate-700/80 dark:bg-slate-900/40">
          <div className="relative flex h-full flex-col items-center justify-center gap-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {exploreCard.title}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {exploreCard.description}
            </p>
            <Link href={exploreCard.link}>
              <button className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                {exploreCard.actionLabel}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
