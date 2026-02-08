"use server";

import { CourseCreationData } from "@/types/global";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { extractPdfContent } from "@/lib/extractContent";
import { extractUrls } from "@/lib/extractUrls";

export async function createCourse(data: CourseCreationData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { ok: false, error: "You must be signed in to create a course." };
    }

    const trimmedText = data.prompt?.trim() ?? "";
    if (!trimmedText) {
      return { ok: false, error: "Prompt is required." };
    }

    const maxChapters = Number.isFinite(data.config?.maxChapters)
      ? data.config.maxChapters
      : 0;

    if (maxChapters < 0) {
      return { ok: false, error: "Maximum chapters cannot be negative." };
    }

    // Extract data from the file given
    const fileData = await extractPdfContent(data.fileUrls?.[0] || "");

    // Extract data from URLs
    const urlsData = await extractUrls(data.links ?? []);

    const payload = {
      ...data,
      text: trimmedText,
      prompt: data.prompt,
      fileData,
      urlsData,
      config: {
        ...data.config,
        maxChapters,
        includedQuizzes: Boolean(data.config?.includedQuizzes),
      },
    };

    const headerStore = await headers();
    const origin =
      headerStore.get("origin") ??
      `${headerStore.get("x-forwarded-proto") ?? "http"}://${
        headerStore.get("host") ?? "localhost:3000"
      }`;

    const response = await fetch(`${origin}/api/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("API response", {
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const message = await response.json().catch(() => ({}));
      return {
        ok: false,
        error: message?.error ?? "Failed to create course.",
      };
    }

    return response.json();
  } catch (error) {
    console.error("[createCourse] failed", error);
    return { ok: false, error: "Failed to create course. Try again." };
  }
}
