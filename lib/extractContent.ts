"use server";

import { pathToFileURL } from "url";
import { createRequire } from "module";
import {
  getDocument,
  GlobalWorkerOptions,
} from "pdfjs-dist/legacy/build/pdf.mjs";

type PdfExtractResult = {
  text: string;
  pages: number;
};

const normalizeText = (value: string) =>
  value
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export async function extractPdfContent(
  fileUrl: string,
): Promise<PdfExtractResult> {
  if (!fileUrl) {
    return { text: "", pages: 0 };
  }

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      return { text: "", pages: 0 };
    }

    const buffer = new Uint8Array(await response.arrayBuffer());

    if (!GlobalWorkerOptions.workerSrc) {
      const require = createRequire(import.meta.url);
      const workerPath =
        require.resolve("pdfjs-dist/legacy/build/pdf.worker.min.mjs");
      GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).toString();
    }

    const loadingTask = getDocument({ data: buffer });
    const pdf = await loadingTask.promise;

    let combinedText = "";
    for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
      const page = await pdf.getPage(pageIndex);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
      combinedText += `${pageText}\n\n`;
    }

    return {
      text: normalizeText(combinedText),
      pages: pdf.numPages,
    };
  } catch (error) {
    console.error("[extractPdfContent] failed", error);
    return { text: "", pages: 0 };
  }
}
