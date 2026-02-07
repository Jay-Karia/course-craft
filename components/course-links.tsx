"use client";

import { useMemo, useState } from "react";
import { Link2, X } from "lucide-react";

export default function CourseLinks() {
  const [linkInput, setLinkInput] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const normalizedLinks = useMemo(() => {
    return links.map((link) => ({
      raw: link,
      host: (() => {
        try {
          return new URL(link).hostname.replace(/^www\./, "");
        } catch {
          return "";
        }
      })(),
    }));
  }, [links]);

  const handleAddLink = () => {
    const trimmed = linkInput.trim();
    if (!trimmed) {
      setError("Add a URL to continue.");
      return;
    }

    try {
      const parsed = new URL(trimmed);
      if (!/^https?:$/.test(parsed.protocol)) {
        setError("Use a valid http(s) URL.");
        return;
      }

      const normalized = parsed.toString().replace(/\/$/, "");
      if (links.some((link) => link.toLowerCase() === normalized.toLowerCase())) {
        setError("That link is already added.");
        return;
      }

      setLinks((prev) => [normalized, ...prev]);
      setLinkInput("");
      setError(null);
    } catch {
      setError("Use a valid URL.");
    }
  };

  const handleRemove = (linkToRemove: string) => {
    setLinks((prev) => prev.filter((link) => link !== linkToRemove));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddLink();
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-lg border border-slate-200/70 bg-white/80 px-3 py-2 text-xs text-slate-600 dark:border-slate-700/80 dark:bg-slate-950/50 dark:text-slate-200">
        <p className="font-semibold text-slate-700 dark:text-slate-100">
          Added links
        </p>
        {normalizedLinks.length === 0 ? (
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            No links yet.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {normalizedLinks.map((link) => (
              <li
                key={link.raw}
                className="flex items-center justify-between rounded-md border border-slate-200/70 bg-white/80 px-2 py-1 text-[11px] dark:border-slate-700/80 dark:bg-slate-950/50"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700 dark:text-slate-100">
                    {link.host || "Link"}
                  </span>
                  <span className="truncate text-slate-500 dark:text-slate-400">
                    {link.raw}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(link.raw)}
                  className="rounded-full border border-transparent p-1 text-slate-400 transition hover:border-slate-200 hover:text-slate-600 dark:hover:border-slate-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Link2 className="h-4 w-4" />
        </span>
        <input
          className="w-full rounded-lg border border-slate-200/80 bg-white/80 pl-9 pr-3 py-2 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-300 dark:border-slate-700/80 dark:bg-slate-950/60 dark:text-slate-200"
          placeholder="https://"
          value={linkInput}
          onChange={(event) => setLinkInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button
        className="w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        type="button"
        onClick={handleAddLink}
      >
        Add link
      </button>
      {error ? (
        <p className="text-xs font-medium text-rose-500">{error}</p>
      ) : null}
    </div>
  );
}
