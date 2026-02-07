"use client";

import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type UploadedFile = {
  name: string;
  url: string;
};

type UploadFileButtonProps = {
  onUploaded?: (files: UploadedFile[]) => void;
};

export default function UploadFileButton({ onUploaded }: UploadFileButtonProps) {
  const [uploadedNames, setUploadedNames] = useState<string[]>([]);

  return (
    <div className="space-y-2">
      {uploadedNames.length === 0 ? (
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res && res.length > 0) {
              const cleaned = res
                .map((file) => ({
                  name: file.name || file.key || "Untitled file",
                  url: file.url || file.ufsUrl || "",
                }))
                .filter((file) => Boolean(file.url));

              const limited = cleaned.slice(0, 1);
              setUploadedNames(limited.map((file) => file.name));
              onUploaded?.(limited);
            }
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
          appearance={{
            button:
              "mt-2 rounded-full border border-slate-200 bg-white px-6 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
          }}
          config={{ cn: twMerge }}
        />
      ) : null}
      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        Maximum 1 file per upload.
      </p>
      {uploadedNames.length > 0 ? (
        <div className="rounded-lg border border-slate-200/70 bg-white/80 px-3 py-2 text-xs text-slate-600 dark:border-slate-700/80 dark:bg-slate-950/50 dark:text-slate-300">
          <p className="font-semibold text-slate-700 dark:text-slate-200">
            Uploaded file
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {uploadedNames.map((name) => (
              <li key={name} className="truncate">
                {name}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
