"use client";

import Hyperspeed from "@/components/Hyperspeed";
import ShinyText from "@/components/ShinyText";
import { ArrowRightIcon, Sparkle } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const { user, loading } = useAuth();

  const lightEffectOptions = useMemo(
    () => ({
      colors: {
        roadColor: 0xe5e7eb,
        islandColor: 0xf1f5f9,
        background: 0xf8fafc,
        shoulderLines: 0xcbd5e1,
        brokenLines: 0xcbd5e1,
        leftCars: [0xdb2777, 0xa855f7, 0xf472b6],
        rightCars: [0x0284c7, 0x0ea5e9, 0x38bdf8],
        sticks: 0x0284c7,
      },
    }),
    [],
  );
  const effectOptions = resolvedTheme === "light" ? lightEffectOptions : {};

  return (
    <div className="relative h-full w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Hyperspeed effectOptions={effectOptions} />
      <div className="flex flex-col items-center gap-4 sm:gap-6 z-10 -translate-y-10 xs:-translate-y-16 sm:-translate-y-24 lg:-translate-y-40">
        <div className="border dark:border-gray-700 rounded-full px-3 py-1 text-sm sm:text-base font-medium bg-white/70 dark:bg-black/80 text-gray-800 dark:text-gray-200 shadow-md shadow-gray-300 dark:shadow-gray-900 flex items-center justify-center">
          <Sparkle className="inline-block mr-2 h-4 w-4 dark:text-blue-400 text-blue-600 animate-float" />
          AI Course Creator
        </div>
        {resolvedTheme === "dark" ? <>
        <h1 className="text-center text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold max-w-88 xs:max-w-[28rem] sm:max-w-xl lg:max-w-none">
          Transform boring texts <br /> into <br /> engaging courses
        </h1>
        </> : <>
        <ShinyText
          text={"Transform boring texts\n into\n engaging courses"}
          speed={3}
          delay={1}
          color={"#474747"}
          shineColor="#ffffff"
          spread={50}
          direction="left"
          yoyo={false}
          pauseOnHover={false}
          disabled={false}
          className="text-center text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold max-w-88 xs:max-w-[28rem] sm:max-w-xl lg:max-w-none"
        />
        </>}
        <div>
          {loading ? (
            <div className="w-32 h-12 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          ) : user ? (
            <Link
              href="/courses"
              className="bg-slate-200/70 dark:bg-slate-800 no-underline group cursor-pointer relative shadow-xl shadow-slate-300/60 dark:shadow-zinc-900 rounded-full p-1 text-xs xs:text-sm font-semibold leading-6 text-slate-900 dark:text-white inline-flex mt-4 sm:mt-6"
            >
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[radial-gradient(75%_100%_at_50%_0%,rgba(14,165,233,0.35)_0%,rgba(14,165,233,0)_70%)] dark:bg-[radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative flex items-center justify-center gap-2 z-10 rounded-full bg-white/90 dark:bg-zinc-950 px-4 xs:px-5 sm:px-8 py-2.5 sm:py-3 ring-1 ring-slate-300/70 dark:ring-white/10">
                <span>Go to Courses</span>
                <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-900 dark:text-white" />
              </div>
              <span className="absolute bottom-0 left-4.5 h-px w-[calc(100%-2.25rem)] bg-linear-to-r from-emerald-400/0 via-emerald-500/80 to-emerald-400/0 dark:from-emerald-400/0 dark:via-emerald-400/90 dark:to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-50" />
            </Link>
          ) : (
            <Link
              href="/register"
              className="bg-slate-200/70 dark:bg-slate-800 no-underline group cursor-pointer relative shadow-xl shadow-slate-300/60 dark:shadow-zinc-900 rounded-full p-1 text-xs xs:text-sm font-semibold leading-6 text-slate-900 dark:text-white inline-flex mt-4 sm:mt-6"
            >
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[radial-gradient(75%_100%_at_50%_0%,rgba(14,165,233,0.35)_0%,rgba(14,165,233,0)_70%)] dark:bg-[radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative flex items-center justify-center gap-2 z-10 rounded-full bg-white/90 dark:bg-zinc-950 px-4 xs:px-5 sm:px-8 py-2.5 sm:py-3 ring-1 ring-slate-300/70 dark:ring-white/10">
                <span>Sign in</span>
                <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-900 dark:text-white" />
              </div>
              <span className="absolute bottom-0 left-4.5 h-px w-[calc(100%-2.25rem)] bg-linear-to-r from-emerald-400/0 via-emerald-500/80 to-emerald-400/0 dark:from-emerald-400/0 dark:via-emerald-400/90 dark:to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-50" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
