"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type CourseVideo = {
  provider: string;
  status: string;
  duration: string;
  prompt: string;
  url: string;
};

type CourseLesson = {
  id: string;
  title: string;
  summary: string;
  video: CourseVideo;
};

type CourseModule = {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
};

type CourseDetails = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  modules?: CourseModule[];
};

const APPWRITE_VIDEO_URL =
  "https://sgp.cloud.appwrite.io/v1/storage/buckets/69872bd5002381c18915/files/698762350015908687a3/view?project=6985f4df000a987b6a15&mode=public";

const buildFallbackModules = (courseTitle: string): CourseModule[] => {
  const baseVideo: CourseVideo = {
    provider: "Sora AI",
    status: "queued",
    duration: "3-5 min",
    prompt: "Generate a concise explainer for this lesson.",
    url: APPWRITE_VIDEO_URL,
  };

  return [
    {
      id: "module-1",
      title: "Module 1 · Foundations",
      description: `Core concepts and context for ${courseTitle}.`,
      lessons: [
        {
          id: "lesson-1-1",
          title: "Lesson 1 · Course overview",
          summary: "Understand the course goals and outcomes.",
          video: baseVideo,
        },
        {
          id: "lesson-1-2",
          title: "Lesson 2 · Key terms",
          summary: "Define the essential vocabulary you will use.",
          video: baseVideo,
        },
        {
          id: "lesson-1-3",
          title: "Lesson 3 · Workflow setup",
          summary: "Prepare tools and resources for the course.",
          video: baseVideo,
        },
      ],
    },
    {
      id: "module-2",
      title: "Module 2 · Applied practice",
      description: "Hands-on walkthroughs and real examples.",
      lessons: [
        {
          id: "lesson-2-1",
          title: "Lesson 4 · Guided demo",
          summary: "Follow a step-by-step demonstration.",
          video: baseVideo,
        },
        {
          id: "lesson-2-2",
          title: "Lesson 5 · Common pitfalls",
          summary: "Avoid mistakes and learn best practices.",
          video: baseVideo,
        },
        {
          id: "lesson-2-3",
          title: "Lesson 6 · Quick exercise",
          summary: "Apply the concepts with a short task.",
          video: baseVideo,
        },
      ],
    },
    {
      id: "module-3",
      title: "Module 3 · Next steps",
      description: "Wrap up and plan what to learn next.",
      lessons: [
        {
          id: "lesson-3-1",
          title: "Lesson 7 · Recap",
          summary: "Summarize the most important takeaways.",
          video: baseVideo,
        },
        {
          id: "lesson-3-2",
          title: "Lesson 8 · Advanced tips",
          summary: "Explore optional enhancements and tips.",
          video: baseVideo,
        },
        {
          id: "lesson-3-3",
          title: "Lesson 9 · Graduation",
          summary: "Review your progress and completion checklist.",
          video: baseVideo,
        },
      ],
    },
    {
      id: "module-4",
      title: "Module 4 · Advanced workflows",
      description: "Speed, polish, and quality improvements.",
      lessons: [
        {
          id: "lesson-4-1",
          title: "Lesson 10 · Speed techniques",
          summary: "Accelerate delivery without sacrificing clarity.",
          video: baseVideo,
        },
        {
          id: "lesson-4-2",
          title: "Lesson 11 · Visual polish",
          summary: "Improve visuals, pacing, and clarity.",
          video: baseVideo,
        },
        {
          id: "lesson-4-3",
          title: "Lesson 12 · Quality checklist",
          summary: "Validate the final output before sharing.",
          video: baseVideo,
        },
      ],
    },
    {
      id: "module-5",
      title: "Module 5 · Capstone",
      description: "Bring everything together in a final project.",
      lessons: [
        {
          id: "lesson-5-1",
          title: "Lesson 13 · Capstone brief",
          summary: "Review the final project requirements.",
          video: baseVideo,
        },
        {
          id: "lesson-5-2",
          title: "Lesson 14 · Build the draft",
          summary: "Create the first version of your project.",
          video: baseVideo,
        },
        {
          id: "lesson-5-3",
          title: "Lesson 15 · Final review",
          summary: "Refine and polish your final submission.",
          video: baseVideo,
        },
      ],
    },
    {
      id: "module-6",
      title: "Module 6 · Optimization",
      description: "Refine, iterate, and optimize outputs.",
      lessons: [
        {
          id: "lesson-6-1",
          title: "Lesson 16 · Performance pass",
          summary: "Optimize for speed and clarity.",
          video: baseVideo,
        },
        {
          id: "lesson-6-2",
          title: "Lesson 17 · Quality benchmarks",
          summary: "Compare against quality targets.",
          video: baseVideo,
        },
        {
          id: "lesson-6-3",
          title: "Lesson 18 · Iteration loops",
          summary: "Use feedback cycles to improve results.",
          video: baseVideo,
        },
      ],
    },
    {
      id: "module-7",
      title: "Module 7 · Deployment",
      description: "Publish, share, and measure outcomes.",
      lessons: [
        {
          id: "lesson-7-1",
          title: "Lesson 19 · Release prep",
          summary: "Finalize assets before publishing.",
          video: baseVideo,
        },
        {
          id: "lesson-7-2",
          title: "Lesson 20 · Distribution",
          summary: "Plan where and how to share.",
          video: baseVideo,
        },
        {
          id: "lesson-7-3",
          title: "Lesson 21 · Measure impact",
          summary: "Track success metrics over time.",
          video: baseVideo,
        },
      ],
    },
  ];
};

export default function CoursePage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId;
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isDoubtOpen, setIsDoubtOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [doubtDraft, setDoubtDraft] = useState("");

  useEffect(() => {
    if (!courseId || typeof window === "undefined") return;
    const stored = sessionStorage.getItem(`course:${courseId}`);
    const fallbackStored = localStorage.getItem(`course:${courseId}`);
    console.log(stored);
    const resolved = stored || fallbackStored;
    if (!resolved) return;
    try {
      const parsed = JSON.parse(resolved) as CourseDetails;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCourse(parsed);
    } catch {
      setCourse(null);
    }
  }, [courseId]);

  const modules = useMemo(() => {
    if (!course) return [] as CourseModule[];
    if (course.modules?.length) return course.modules;
    return buildFallbackModules(course.title);
  }, [course]);

  const allLessons = useMemo(
    () => modules.flatMap((module) => module.lessons),
    [modules],
  );

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const effectiveSelectedLessonId =
    selectedLessonId ?? allLessons[0]?.id ?? null;

  const selectedLesson = useMemo(
    () =>
      allLessons.find((lesson) => lesson.id === effectiveSelectedLessonId) ??
      null,
    [allLessons, effectiveSelectedLessonId],
  );

  const completedLessonIds = useMemo(
    () =>
      new Set(
        allLessons
          .slice(0, Math.min(4, allLessons.length))
          .map((lesson) => lesson.id),
      ),
    [allLessons],
  );

  const isLessonCompleted = (lessonId?: string | null) =>
    Boolean(lessonId && completedLessonIds.has(lessonId));

  const videoSrc = APPWRITE_VIDEO_URL;

  const handleSubmitFeedback = () => {
    setFeedbackMessage("Thanks! Feedback saved locally for now (placeholder).");
  };

  if (!courseId) {
    return (
      <div className="h-screen overflow-y-auto bg-slate-50/70 px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <h1 className="text-2xl font-semibold">Course not found</h1>
          <Link className="text-sm text-indigo-500 hover:underline" href="/new">
            Create a new course
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-screen overflow-y-auto bg-slate-50/70 px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <h1 className="text-2xl font-semibold">Loading course…</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            If this page was refreshed, the course details may not be available.
          </p>
          <Link className="text-sm text-indigo-500 hover:underline" href="/new">
            Create a new course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-slate-50/70 px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100 mb-40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Course workspace
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                {course.title}
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {course.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200">
                {modules.length} modules
              </span>
              <span className="rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200">
                {allLessons.length} lessons
              </span>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] dark:border-slate-800/80 dark:bg-slate-900/70">
              <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <video
                  className="h-full w-full object-cover"
                  controls
                  preload="metadata"
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Now playing
                    </p>
                    <h2 className="text-lg font-semibold">
                      {selectedLesson?.title ?? "Pick a lesson"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {selectedLesson?.summary ??
                        "Choose a lesson from the syllabus to preview its video."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200/70 bg-white/80 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200">
                      {selectedLesson?.video.duration ?? "3-5 min"}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isLessonCompleted(selectedLesson?.id)
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
                      }`}
                    >
                      {isLessonCompleted(selectedLesson?.id)
                        ? "Completed"
                        : "Not started"}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Notes
                  </p>
                  <textarea
                    className="mt-2 w-full rounded-xl border border-slate-200/70 bg-white/80 px-3 py-2 text-xs text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-200"
                    placeholder="Write your notes for this lesson here..."
                    rows={4}
                  />
                </div>

                {/* Quiz placeholder */}
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-950/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Lesson quiz
                      </p>
                      <h3 className="text-sm font-semibold">Knowledge check</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsQuizOpen((prev) => !prev)}
                        className="rounded-full border border-slate-200/70 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-200"
                      >
                        {isQuizOpen ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    Multiple-choice checks tailored to{" "}
                    {selectedLesson?.title ?? "this lesson"}.
                  </p>
                  {isQuizOpen ? (
                    <div className="mt-3 grid gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <div className="rounded-xl border border-slate-200/70 bg-white/80 p-3 dark:border-slate-800/80 dark:bg-slate-950/40">
                        <p className="font-semibold text-slate-700 dark:text-slate-200">
                          Q1. What is the primary goal of this lesson?
                        </p>
                        <div className="mt-2 grid gap-2 text-[11px]">
                          {[
                            "Establish key outcomes and success criteria",
                            "Introduce unrelated background history",
                            "Skip setup and jump to advanced topics",
                            "Focus only on tool installation",
                          ].map((choice, index) => (
                            <label
                              key={choice}
                              className="flex items-center gap-2 rounded-lg border border-slate-200/70 bg-white/70 px-2 py-2 dark:border-slate-800/80 dark:bg-slate-950/40"
                            >
                              <input
                                type="radio"
                                name="quiz-q1"
                                disabled
                                className="h-3 w-3"
                              />
                              <span>{`${String.fromCharCode(65 + index)}. ${choice}`}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200/70 bg-white/80 p-3 dark:border-slate-800/80 dark:bg-slate-950/40">
                        <p className="font-semibold text-slate-700 dark:text-slate-200">
                          Q2. Which step should happen before applying the main
                          workflow?
                        </p>
                        <div className="mt-2 grid gap-2 text-[11px]">
                          {[
                            "Gather required assets and inputs",
                            "Publish final output immediately",
                            "Skip reviews entirely",
                            "Ignore the lesson summary",
                          ].map((choice, index) => (
                            <label
                              key={choice}
                              className="flex items-center gap-2 rounded-lg border border-slate-200/70 bg-white/70 px-2 py-2 dark:border-slate-800/80 dark:bg-slate-950/40"
                            >
                              <input
                                type="radio"
                                name="quiz-q2"
                                disabled
                                className="h-3 w-3"
                              />
                              <span>{`${String.fromCharCode(65 + index)}. ${choice}`}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200/70 bg-white/80 p-3 dark:border-slate-800/80 dark:bg-slate-950/40">
                        <p className="font-semibold text-slate-700 dark:text-slate-200">
                          Q3. Which outcome best indicates completion?
                        </p>
                        <div className="mt-2 grid gap-2 text-[11px]">
                          {[
                            "Checklist items confirmed and summary reviewed",
                            "Only the first step attempted",
                            "Notes left blank",
                            "No resources collected",
                          ].map((choice, index) => (
                            <label
                              key={choice}
                              className="flex items-center gap-2 rounded-lg border border-slate-200/70 bg-white/70 px-2 py-2 dark:border-slate-800/80 dark:bg-slate-950/40"
                            >
                              <input
                                type="radio"
                                name="quiz-q3"
                                disabled
                                className="h-3 w-3"
                              />
                              <span>{`${String.fromCharCode(65 + index)}. ${choice}`}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200/70 bg-white/80 p-3 dark:border-slate-800/80 dark:bg-slate-950/40">
                        <p className="font-semibold text-slate-700 dark:text-slate-200">
                          Q4. What should you do after completing the lesson?
                        </p>
                        <div className="mt-2 grid gap-2 text-[11px]">
                          {[
                            "Reflect, capture notes, and plan next steps",
                            "Discard the lesson resources",
                            "Avoid sharing feedback",
                            "Skip the recap",
                          ].map((choice, index) => (
                            <label
                              key={choice}
                              className="flex items-center gap-2 rounded-lg border border-slate-200/70 bg-white/70 px-2 py-2 dark:border-slate-800/80 dark:bg-slate-950/40"
                            >
                              <input
                                type="radio"
                                name="quiz-q4"
                                disabled
                                className="h-3 w-3"
                              />
                              <span>{`${String.fromCharCode(65 + index)}. ${choice}`}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-wrap items-end justify-end gap-2">
                  <button
                    className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200 flex items-center gap-1"
                    type="button"
                    onClick={() => setIsDoubtOpen(true)}
                  >
                    Open doubt solver
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_8px_30px_-16px_rgba(15,23,42,0.35)] dark:border-slate-800/80 dark:bg-slate-900/70">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Syllabus</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {allLessons.length} lessons
                </span>
              </div>
              <div className="mt-4 space-y-4">
                {modules.map((module, index) => (
                  <div key={module.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Module {index + 1}
                        </p>
                        <p className="text-sm font-semibold">{module.title}</p>
                      </div>
                      <span className="rounded-full border border-slate-200/70 bg-white/80 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200">
                        {module.lessons.length} lessons
                      </span>
                    </div>
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const isSelected =
                          lesson.id === effectiveSelectedLessonId;
                        const completed = isLessonCompleted(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            className={`flex w-full flex-col gap-1 rounded-xl border px-3 py-2 text-left text-xs transition ${
                              isSelected
                                ? "border-indigo-400 bg-indigo-50/80 text-indigo-900 dark:border-indigo-400/70 dark:bg-indigo-500/10 dark:text-indigo-100"
                                : "border-slate-200/70 bg-white/80 text-slate-700 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-200"
                            }`}
                            onClick={() => setSelectedLessonId(lesson.id)}
                            type="button"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">
                                {lessonIndex + 1}. {lesson.title}
                              </span>
                              <span className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                                <span>{lesson.video.duration}</span>
                                <span
                                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                                    completed
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200"
                                      : "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
                                  }`}
                                >
                                  {completed ? "Done" : "Todo"}
                                </span>
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              {lesson.summary}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 text-sm shadow-[0_8px_30px_-16px_rgba(15,23,42,0.35)] dark:border-slate-800/80 dark:bg-slate-900/70 mb-40">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Course feedback</h3>
                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen((prev) => !prev)}
                  className="rounded-full border border-slate-200/70 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-200"
                >
                  {isFeedbackOpen ? "Hide" : "Show"}
                </button>
              </div>
              {isFeedbackOpen ? (
                <>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    Rate this course and share comments to help improve the AI
                    outputs.
                  </p>
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Rating
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((value) => {
                        const isActive = (feedbackRating ?? 0) >= value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setFeedbackRating(value)}
                            aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                            className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                              isActive
                                ? "border-amber-300 bg-amber-50 text-amber-500 dark:border-amber-400/60 dark:bg-amber-500/10"
                                : "border-slate-200/70 bg-white/80 text-slate-400 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-500"
                            }`}
                          >
                            <svg
                              aria-hidden="true"
                              className="h-4 w-4"
                              fill={isActive ? "currentColor" : "none"}
                              stroke="currentColor"
                              strokeWidth={1.5}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.75.75 0 011.04 0l2.41 2.397 3.336.485a.75.75 0 01.415 1.279l-2.412 2.35.57 3.32a.75.75 0 01-1.088.79L12 12.75l-2.99 1.57a.75.75 0 01-1.09-.79l.57-3.32-2.41-2.35a.75.75 0 01.415-1.28l3.336-.484 2.41-2.397z"
                              />
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Comments
                    </p>
                    <textarea
                      className="mt-2 w-full rounded-xl border border-slate-200/70 bg-white/80 px-3 py-2 text-xs text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-200"
                      placeholder="Share what worked well or what should improve..."
                      rows={4}
                      value={feedbackComment}
                      onChange={(event) =>
                        setFeedbackComment(event.target.value)
                      }
                    />
                  </div>
                  <button
                    className="mt-4 w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
                    type="button"
                    onClick={handleSubmitFeedback}
                  >
                    Submit feedback
                  </button>
                  {feedbackMessage ? (
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      {feedbackMessage}
                    </p>
                  ) : null}
                </>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
      {isDoubtOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-8">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.45)] dark:border-slate-800/80 dark:bg-slate-950/95">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Doubt solver
                </p>
                <h3 className="text-lg font-semibold">
                  Ask about {selectedLesson?.title ?? "this lesson"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDoubtOpen(false)}
                className="rounded-full border border-slate-200/70 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-200"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-4 text-xs text-slate-600 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-300">
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  You
                </p>
                <p>Can you summarize the main takeaway in two sentences?</p>
              </div>
              <div className="rounded-xl border border-slate-200/70 bg-white/90 p-4 text-xs text-slate-600 dark:border-slate-800/80 dark:bg-slate-950/60 dark:text-slate-300">
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  AI Tutor
                </p>
                <p>
                  Placeholder response. The doubt solver will provide
                  lesson-aware guidance and citations when integrated.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <input
                className="w-full rounded-full border border-slate-200/70 bg-white/90 px-4 py-2 text-xs text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-200"
                placeholder="Ask a question about this lesson..."
                value={doubtDraft}
                onChange={(event) => setDoubtDraft(event.target.value)}
              />
              <button
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
                type="button"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
