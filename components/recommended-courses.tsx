import {MdKeyboardArrowRight} from "react-icons/md";

export default function RecommendedCourses() {
  const recommendedCourses = [
    {
      id: "ux-research-methods",
      statusClasses:
        "bg-blue-100/70 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200",
      updatedAt: "Updated 1d ago",
      title: "UX Research Methods",
      description: "Master user interviews, surveys, and usability testing.",
      lessons: 10,
      quizzes: 3,
      glowClasses:
        "-right-10 -top-10 bg-linear-to-br from-blue-200/70 via-cyan-200/60 to-transparent dark:from-blue-500/30 dark:via-cyan-400/20",
    },
    {
      id: "advanced-animation",
      statusClasses:
        "bg-green-100/70 text-green-700 dark:bg-green-500/20 dark:text-green-200",
      updatedAt: "Finished Feb 2",
      title: "Advanced Animation Techniques",
      description: "Explore advanced motion design and prototyping.",
      lessons: 15,
      quizzes: 2,
      glowClasses:
        "-left-12 -bottom-12 bg-linear-to-tr from-pink-200/70 via-lime-200/60 to-transparent dark:from-pink-500/25 dark:via-lime-400/20",
    },
    {
      id: "responsive-ui-design",
      statusClasses:
        "bg-yellow-100/70 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-200",
      updatedAt: "Added today",
      title: "Responsive UI Design",
      description: "Learn to build interfaces that adapt to any device.",
      lessons: 8,
      quizzes: 1,
      glowClasses:
        "-right-8 -bottom-8 bg-linear-to-br from-yellow-200/70 via-orange-200/60 to-transparent dark:from-yellow-500/30 dark:via-orange-400/20",
    },
  ];

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Recommended Courses
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Based on your interests and activity.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {recommendedCourses.map((course) => (
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
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {course.lessons} lessons
                  {course.quizzes ? ` · ${course.quizzes} quizzes` : ""}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
