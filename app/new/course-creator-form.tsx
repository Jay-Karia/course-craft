"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ScrollableFeed from "@/components/scrollable-feed";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { PiSparkleThin } from "react-icons/pi";
import UploadFileButton from "@/components/upload-files";
import CourseLinks from "@/components/course-links";
import { createCourse } from "@/actions/course";
import type { CourseCreationData } from "@/types/global";

export default function CourseCreatorForm() {
  const router = useRouter();
  const [rawText, setRawText] = useState("");
  const [prompt, setPrompt] = useState("")
  const [textError, setTextError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [links, setLinks] = useState<string[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [videoLength, setVideoLength] = useState("");
  const [narrationVoice, setNarrationVoice] = useState("");
  const [maxChapters, setMaxChapters] = useState(0);
  const [includeQuizzes, setIncludeQuizzes] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    if (!prompt.trim()) {
      setTextError("Prompt is required.");
      return;
    }

    setTextError(null);
    setServerError(null);

    const payload: CourseCreationData = {
      text: rawText,
      fileUrls,
      prompt,
      links,
      config: {
        audience,
        tone,
        videoLength,
        narrationVoice,
        maxChapters,
        includedQuizzes: includeQuizzes,
      },
    };

    startTransition(async () => {
      try {
        const result = await createCourse(payload);
        if (result && !result.ok) {
          setServerError(result.error);
          return;
        }
        if (result?.course?.id) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(
              `course:${result.course.id}`,
              JSON.stringify(result.course),
            );
            localStorage.setItem(
              `course:${result.course.id}`,
              JSON.stringify(result.course),
            );
          }
          router.push(`/courses/${result.course.id}`);
        }
      } catch {
        setServerError("Failed to create course. Try again.");
      }
    });
  };

  return (
    <div className="h-screen w-full overflow-x-hidden">
      <ScrollableFeed className="h-full w-full">
        <div className="container mx-auto max-w-8xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="space-y-10">
            <header className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                Turn raw materials into a personalized video course
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                Upload text, PDFs, and links. We will analyze the content and
                generate a structured video course with chapters, summaries, and
                quizzes.
              </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="flex flex-col gap-6">
                {/* Course Prompt */}
                <section className="space-y-6">
                  <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_-16px_rgba(15,23,42,0.35)] dark:border-slate-800/80 dark:bg-slate-900/70">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          Write a prompt to generate your course
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          The more details you provide, the better the course
                          will be.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4">
                      <textarea
                        className="mt-4 h-32 w-full resize-none rounded-xl border border-slate-200/80 bg-white/80 p-3 text-sm text-slate-700 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 dark:border-slate-700/80 dark:bg-slate-950/60 dark:text-slate-200"
                        placeholder="Enter your prompt here."
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        required
                      />
                      {textError ? (
                        <p className="mt-2 text-xs font-medium text-rose-500">
                          {textError}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </section>

                {/* Course Material */}
                <section className="space-y-6">
                  <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_-16px_rgba(15,23,42,0.35)] dark:border-slate-800/80 dark:bg-slate-900/70">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          Add your source material
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Provide multiple sources to enrich the course.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4">
                      <div className="rounded-xl border border-dashed border-slate-300/70 bg-slate-50/70 p-5 dark:border-slate-700/80 dark:bg-slate-900/40">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              Raw text
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Paste notes, transcripts, or outlines.
                            </p>
                          </div>
                        </div>
                        <textarea
                          className="mt-4 h-32 w-full resize-none rounded-xl border border-slate-200/80 bg-white/80 p-3 text-sm text-slate-700 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 dark:border-slate-700/80 dark:bg-slate-950/60 dark:text-slate-200"
                          placeholder="Paste raw notes or lesson ideas here..."
                          value={rawText}
                          onChange={(event) => setRawText(event.target.value)}
                          required
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-dashed border-slate-300/70 bg-slate-50/70 p-5 dark:border-slate-700/80 dark:bg-slate-900/40">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                Files
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Upload files like PDFs, or docs.
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300/80 bg-white/70 px-4 py-6 text-center text-xs text-slate-500 dark:border-slate-700/80 dark:bg-slate-950/40">
                            Drop PDFs here or
                            <UploadFileButton
                              onUploaded={(files) =>
                                setFileUrls(files.map((file) => file.url))
                              }
                            />
                          </div>
                        </div>

                        <div className="rounded-xl border border-dashed border-slate-300/70 bg-slate-50/70 p-5 dark:border-slate-700/80 dark:bg-slate-900/40">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              Links & references
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Add articles, videos, or websites.
                            </p>
                          </div>
                          <CourseLinks links={links} onChange={setLinks} />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <aside className="space-y-6">
                <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_-16px_rgba(15,23,42,0.35)] dark:border-slate-800/80 dark:bg-slate-900/70">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Course configuration
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Optional
                    </span>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Audience
                      </Label>
                      <Select value={audience} onValueChange={setAudience}>
                        <SelectTrigger className="w-full rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/60 dark:text-slate-200">
                          <SelectValue placeholder="Select Audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="product-designers">
                              Product designers
                            </SelectItem>
                            <SelectItem value="engineers">Engineers</SelectItem>
                            <SelectItem value="marketing">
                              Marketing teams
                            </SelectItem>
                            <SelectItem value="founders">Founders</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Tone
                      </Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger className="w-full rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/60 dark:text-slate-200">
                          <SelectValue placeholder="Select Tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="professional">
                              Professional
                            </SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="energetic">Energetic</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Video length
                      </Label>
                      <Select
                        value={videoLength}
                        onValueChange={setVideoLength}
                      >
                        <SelectTrigger className="w-full rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/60 dark:text-slate-200">
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="3-5">
                              3-5 min / chapter
                            </SelectItem>
                            <SelectItem value="5-8">
                              5-8 min / chapter
                            </SelectItem>
                            <SelectItem value="10-12">
                              10-12 min / chapter
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Narration voice
                      </Label>
                      <Select
                        value={narrationVoice}
                        onValueChange={setNarrationVoice}
                      >
                        <SelectTrigger className="w-full rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/60 dark:text-slate-200">
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="studio-neutral">
                              Studio Neutral
                            </SelectItem>
                            <SelectItem value="warm-calm">
                              Warm & calm
                            </SelectItem>
                            <SelectItem value="bright-upbeat">
                              Bright & upbeat
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Maximum Chapters
                      </Label>
                      <Input
                        type="number"
                        value={maxChapters}
                        onChange={(event) =>
                          setMaxChapters(Number(event.target.value))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-200/70 bg-slate-50/70 px-3 py-2 dark:border-slate-800/80 dark:bg-slate-900/50">
                      <Label
                        htmlFor="include-quizzes"
                        className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        Include quizzes?
                      </Label>
                      <Checkbox
                        id="include-quizzes"
                        checked={includeQuizzes}
                        onCheckedChange={(value) =>
                          setIncludeQuizzes(Boolean(value))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_-16px_rgba(15,23,42,0.35)] dark:border-slate-800/80 dark:bg-slate-900/70">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Ready to generate?
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    We will stitch your inputs into a full course in minutes.
                  </p>
                  <div className="mt-6 space-y-3 w-full ">
                    <HoverBorderGradient
                      containerClassName="rounded-full w-full "
                      as="button"
                      className="dark:bg-black bg-slate-100 text-black dark:text-white flex items-center space-x-2 w-full justify-center hover:-translate-y-0.5 transition-transform duration-300 hover:cursor-pointer disabled:opacity-70"
                      onClick={handleGenerate}
                    >
                      <span className="flex gap-3 items-center">
                        <PiSparkleThin size={25} />
                        {isPending ? "Generating..." : "Generate"}
                      </span>
                    </HoverBorderGradient>
                    {serverError ? (
                      <p className="text-xs font-medium text-rose-500">
                        {serverError}
                      </p>
                    ) : null}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </ScrollableFeed>
    </div>
  );
}
