"use client";

import Hyperspeed from "@/components/Hyperspeed";
import { ArrowRightIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <Hyperspeed />
      <div className="flex flex-col items-center gap-6 z-10 -translate-y-60">
        <h1 className="scroll-m-20 text-center text-5xl font-extrabold -tracking-normal text-balance">
          Transform boring texts into <br /> engaging <br />
          courses with AI
        </h1>
        <div>
          <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-1 text-sm font-semibold leading-6  text-white inline-block mt-6">
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 px-8 py-3 ring-1 ring-white/10 ">
              <span>Get Started</span>
              <ArrowRightIcon className="h-5 w-5 text-white" />
            </div>
            <span className="absolute bottom-0 left-4.5 h-px w-[calc(100%-2.25rem)] bg-linear-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
          </button>
        </div>
      </div>
    </div>
  );
}
