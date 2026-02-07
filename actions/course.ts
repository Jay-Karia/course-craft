"use server";

import { CourseCreationData } from "@/types/global";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Client, Databases, ID } from "appwrite";

type CreateCourseResult =
	| {
			ok: true;
		}
	| {
			ok: false;
			error: string;
		};

type OutlineChapter = {
	id: string;
	order: number;
	title: string;
	summary: string;
	content: string;
	quizzes?: Array<{ question: string; answer: string }>;
};

const buildOutline = (
	text: string,
	maxChapters: number,
	includeQuizzes: boolean,
): OutlineChapter[] => {
	const paragraphs = text
		.split(/\n{2,}/)
		.map((chunk) => chunk.trim())
		.filter(Boolean);

	const fallbackSentences = text
		.split(/(?<=[.!?])\s+/)
		.map((sentence) => sentence.trim())
		.filter(Boolean);

	const chunks = paragraphs.length > 0 ? paragraphs : fallbackSentences;
	const limit = maxChapters > 0 ? maxChapters : Math.min(6, chunks.length || 1);

	return chunks.slice(0, limit).map((chunk, index) => {
		const firstSentence = chunk.split(/(?<=[.!?])\s+/)[0] || chunk;
		const title =
			firstSentence.length > 64
				? `${firstSentence.slice(0, 61)}...`
				: firstSentence;
		const summary =
			chunk.length > 160 ? `${chunk.slice(0, 157)}...` : chunk;
		const quizzes = includeQuizzes
			? [
					{
						question: `What is the key takeaway from chapter ${index + 1}?`,
						answer: "",
					},
			  ]
			: undefined;

		return {
			id: `chapter-${index + 1}`,
			order: index + 1,
			title: title || `Chapter ${index + 1}`,
			summary,
			content: chunk,
			quizzes,
		};
	});
};

const getAppwriteConfig = () => {
	const endpoint =
		process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
	const projectId =
		process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
	const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
	const coursesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_COURSES_ID;

  console.log(coursesCollectionId)

	return {
		endpoint,
		projectId,
		databaseId,
		coursesCollectionId,
	};
};

export async function createCourse(
	data: CourseCreationData,
): Promise<CreateCourseResult> {
	let courseId: string | null = null;

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

		const payload: CourseCreationData = {
			...data,
			text: trimmedText,
			fileUrls: (data.fileUrls ?? []).filter(Boolean),
			links: (data.links ?? []).filter(Boolean),
			config: {
				...data.config,
				maxChapters,
				includedQuizzes: Boolean(data.config?.includedQuizzes),
			},
		};

		const outline = buildOutline(
			payload.text,
			payload.config.maxChapters,
			payload.config.includedQuizzes,
		);

		const { endpoint, projectId, databaseId, coursesCollectionId } =
			getAppwriteConfig();

		if (!endpoint || !projectId || !databaseId || !coursesCollectionId) {
			return {
				ok: false,
				error:
					"Appwrite is not configured, APPWRITE_DATABASE_ID, and APPWRITE_COURSES_COLLECTION_ID.",
			};
		}

		const client = new Client()
			.setEndpoint(endpoint)
			.setProject(projectId)
		const databases = new Databases(client);

		const courseTitle =
			payload.text.split(/\n/).find((line) => line.trim())?.slice(0, 80) ||
			"Untitled course";

		const createdAt = new Date().toISOString();
		const created = await databases.createDocument(
			databaseId,
			coursesCollectionId,
			ID.unique(),
			{
				userId,
				title: courseTitle,
				status: "draft",
				sourceText: payload.text,
				fileUrls: payload.fileUrls,
				links: payload.links,
				config: payload.config,
				outline,
				createdAt,
				updatedAt: createdAt,
			},
		);

		courseId = created.$id;
		console.log("[createCourse] courseId", courseId);
		console.log("[createCourse] payload", JSON.stringify(payload, null, 2));
	} catch (error) {
		console.error("[createCourse] failed", error);
		return { ok: false, error: "Failed to create course. Try again." };
	}

	redirect(`/courses/${courseId}/edit`);
}
