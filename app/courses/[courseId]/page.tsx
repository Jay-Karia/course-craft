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

export default function CoursePage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId;
  const [course, setCourse] = useState<CourseDetails | null>(null);

  useEffect(() => {
    if (!courseId || typeof window === "undefined") return;
    const stored = sessionStorage.getItem(`course:${courseId}`);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as CourseDetails;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCourse(parsed);
    } catch {
      setCourse(null);
    }
  }, [courseId]);

  const modules = useMemo(() => course?.modules ?? [], [course]);

  if (!courseId) {
    return (
      <div className="min-h-screen bg-slate-50/70 px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
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
      <div className="min-h-screen bg-slate-50/70 px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
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
    <div className="min-h-screen bg-slate-50/70 px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Course overview
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{course.title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {course.description}
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-[0_8px_30px_-16px_rgba(15,23,42,0.35)] dark:border-slate-800/80 dark:bg-slate-900/70">
          <div className="aspect-[16/9] w-full overflow-hidden">
            <img
              alt={course.title}
              className="h-full w-full object-cover"
              src={course.thumbnailUrl}
            />
          </div>
          <div className="p-6">
            <h2 className="text-lg font-semibold">Modules & lessons</h2>
            <div className="mt-4 space-y-4">
              {modules.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  No modules available for this course yet.
                </p>
              ) : (
                modules.map((module) => (
                  <div
                    key={module.id}
                    className="rounded-xl border border-slate-200/70 bg-white/80 p-4 dark:border-slate-800/80 dark:bg-slate-950/40"
                  >
                    <h3 className="text-base font-semibold">{module.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {module.description}
                    </p>
                    <div className="mt-3 space-y-3">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="rounded-lg border border-slate-200/70 bg-white/90 p-3 text-sm dark:border-slate-800/80 dark:bg-slate-900/60"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{lesson.title}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {lesson.summary}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 rounded-lg border border-dashed border-slate-200/70 bg-slate-50/60 p-3 text-xs text-slate-600 dark:border-slate-800/80 dark:bg-slate-900/40 dark:text-slate-300">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                                {lesson.video.provider}
                              </span>
                              <span>Duration: {lesson.video.duration}</span>
                              <span>Status: {lesson.video.status}</span>
                            </div>
                            <p className="mt-2">Prompt: {lesson.video.prompt}</p>
                            <p className="mt-1">
                              Video URL: {lesson.video.url}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          <Link className="text-sm text-indigo-500 hover:underline" href="/new">
            Create another course
          </Link>
        </div>
      </div>
    </div>
  );
}
