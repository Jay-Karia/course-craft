"use server";

import { CourseCreationData } from "@/types/global";
import { auth } from "@clerk/nextjs/server";
import { extractPdfContent } from "@/lib/extractContent";
import {extractUrls} from "@/lib/extractUrls";

export async function createCourse(
	data: CourseCreationData,
) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return { ok: false, error: "You must be signed in to create a course." };
		}

		const trimmedText = data.text?.trim() ?? "";
		if (!trimmedText) {
			return { ok: false, error: "Raw text is required." };
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
			fileData,
			urlsData,
			config: {
				...data.config,
				maxChapters,
				includedQuizzes: Boolean(data.config?.includedQuizzes),
			},
		};

		console.log("[createCourse] payload", JSON.stringify(payload, null, 2));
	} catch (error) {
		console.error("[createCourse] failed", error);
		return { ok: false, error: "Failed to create course. Try again." };
	}
}
