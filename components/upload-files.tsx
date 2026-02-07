"use client";

import { UploadButton } from "@/lib/uploadthing";
import {twMerge} from "tailwind-merge";

export default function UploadFileButton() {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("Files: ", res);
        alert("Upload Completed");
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
      appearance={{
        button: "mt-2 rounded-full border border-slate-200 bg-white px-6 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
      }}
       config={{ cn: twMerge }}
    />
  );
}

// mt-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300
