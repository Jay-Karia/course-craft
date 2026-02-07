import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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

export default async function CreateCourse() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    redirect("/");
  }

  const links = [];

  function handleAddLink(link: string) {
    links.push(link);
  }

  return (
    <div className="h-screen w-full overflow-x-hidden">
      <ScrollableFeed className="h-full w-full">
        <div className="container mx-auto max-w-8xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="space-y-10">
            <header className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                Turn raw materials into a video course
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                Upload text, PDFs, and links. We will analyze the content and
                generate a structured video course with chapters, summaries, and
                quizzes.
              </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
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
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                            Up to 5
                          </span>
                        </div>
                        <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300/80 bg-white/70 px-4 py-6 text-center text-xs text-slate-500 dark:border-slate-700/80 dark:bg-slate-950/40">
                          Drop PDFs here or
                          <UploadFileButton/>
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
                        <div className="mt-4 space-y-2">
                          <input
                            className="w-full rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-300 dark:border-slate-700/80 dark:bg-slate-950/60 dark:text-slate-200"
                            placeholder="https://"
                          />
                          <button className="w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" >
                            Add link
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

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
                      <Select>
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
                      <Select>
                        <SelectTrigger className="w-full rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/60 dark:text-slate-200">
                          <SelectValue placeholder="Select Audience" />
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
                      <Select>
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
                      <Select>
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
                      <Input type="number" min={0} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-200/70 bg-slate-50/70 px-3 py-2 dark:border-slate-800/80 dark:bg-slate-900/50">
                      <Label
                        htmlFor="include-quizzes"
                        className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        Include quizzes?
                      </Label>
                      <Checkbox id="include-quizzes" />
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
                      className="dark:bg-black bg-slate-100 text-black dark:text-white flex items-center space-x-2 w-full justify-center hover:-translate-y-0.5 transition-transform duration-300 hover:cursor-pointer"
                    >
                      <span className="flex gap-3 items-center">
                        <PiSparkleThin size={25} /> Generate
                      </span>
                    </HoverBorderGradient>
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
