/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Course } from "@/types/global";

export const runtime = "nodejs";

type AiCourseCopy = {
  title: string;
  description: string;
};

const MAX_AI_TEXT_CHARS = 4000;

const summarizeTextForAi = (text: string) => {
  if (text.length <= MAX_AI_TEXT_CHARS) return text;
  return `${text.slice(0, MAX_AI_TEXT_CHARS)}...`;
};

const extractJsonObject = (raw: string) => {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
};

const parseAiCopy = (value: unknown): AiCourseCopy | null => {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const description =
    typeof record.description === "string" ? record.description.trim() : "";
  if (!title || !description) return null;
  return { title, description };
};

const getGeminiText = (responseJson: any) => {
  const candidates = Array.isArray(responseJson?.candidates)
    ? responseJson.candidates
    : [];
  for (const candidate of candidates) {
    const parts = Array.isArray(candidate?.content?.parts)
      ? candidate.content.parts
      : [];
    const combined = parts
      .map((part: any) => (typeof part?.text === "string" ? part.text : ""))
      .join(" ")
      .trim();
    if (combined) return combined;
  }
  return "";
};

const parseGeminiJson = (responseJson: any) => {
  const candidates = Array.isArray(responseJson?.candidates)
    ? responseJson.candidates
    : [];
  for (const candidate of candidates) {
    const parts = Array.isArray(candidate?.content?.parts)
      ? candidate.content.parts
      : [];
    for (const part of parts) {
      if (typeof part?.text === "string") {
        const parsed = extractJsonObject(part.text) ?? null;
        if (parsed) return parsed;
      }
    }
  }
  return null;
};

const generateCourseCopy = async (input: {
  text: string;
  audience: string;
  tone: string;
  videoLength: string;
  narrationVoice: string;
  links: string[];
  fileUrls: string[];
}): Promise<AiCourseCopy | null> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";

  const context = {
    audience: input.audience,
    tone: input.tone,
    videoLength: input.videoLength,
    narrationVoice: input.narrationVoice,
    links: input.links,
    fileUrls: input.fileUrls,
    text: summarizeTextForAi(input.text),
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          role: "system",
          parts: [
            {
              text: "You are generating a course title and description for a single-video course. Return only valid JSON with keys title and description.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Create a concise, marketable title (max 8 words) and a 1-2 sentence description. Use the audience and tone if provided. Data: ${JSON.stringify(
                  context,
                )}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) return null;
  const json = await response.json().catch(() => null);
  if (!json) return null;

  const direct = parseAiCopy(json);
  if (direct) return direct;

  const geminiJson = parseGeminiJson(json);
  const geminiCopy = parseAiCopy(geminiJson);
  if (geminiCopy) return geminiCopy;

  const outputText = getGeminiText(json);
  if (!outputText) return null;
  const parsed = extractJsonObject(outputText);
  return parseAiCopy(parsed);
};

export async function POST(request: Request) {
  try {
    // const { userId } = await auth();
    // if (!userId) {
    //   return NextResponse.json(
    //     { ok: false, error: "You must be signed in to create a course." },
    //     { status: 401 },
    //   );
    // }

    const body = await request.json().catch(() => null);
    const rawText = typeof body?.text === "string" ? body.text : "";
    const trimmedText = rawText.trim();

    if (!trimmedText) {
      return NextResponse.json(
        { ok: false, error: "Raw text is required." },
        { status: 400 },
      );
    }

    const titleFromText = (() => {
      const firstLine = trimmedText
        .split(/\n+/)
        .find((line: string) => line.trim());
      if (!firstLine) return "Untitled Course";
      const sentence = firstLine.split(/[.!?]/)[0]?.trim() || firstLine.trim();
      return sentence.length > 80 ? `${sentence.slice(0, 77)}...` : sentence;
    })();

    const providedTitle =
      typeof body?.title === "string" ? body.title.trim() : "";
    const providedDescription =
      typeof body?.description === "string" ? body.description.trim() : "";
    const providedThumbnail =
      typeof body?.thumbnailUrl === "string" ? body.thumbnailUrl.trim() : "";

    const audience =
      typeof body?.config?.audience === "string" ? body.config.audience : "";
    const tone = typeof body?.config?.tone === "string" ? body.config.tone : "";
    const videoLength =
      typeof body?.config?.videoLength === "string"
        ? body.config.videoLength
        : "3-5 min";
    const narrationVoice =
      typeof body?.config?.narrationVoice === "string"
        ? body.config.narrationVoice
        : "";

    const aiCopy = await generateCourseCopy({
      text: trimmedText,
      audience,
      tone,
      videoLength,
      narrationVoice,
      links: Array.isArray(body?.links) ? body.links : [],
      fileUrls: Array.isArray(body?.fileUrls) ? body.fileUrls : [],
    });

    const courseTitle = aiCopy?.title || providedTitle || titleFromText;
    const courseDescription = (() => {
      if (aiCopy?.description) return aiCopy.description;
      if (providedDescription) return providedDescription;
      const suffixParts = [
        audience ? `for ${audience}` : "",
        tone ? `with a ${tone} tone` : "",
      ].filter(Boolean);
      return `A focused, single-video course${
        suffixParts.length ? ` ${suffixParts.join(" ")}` : ""
      }.`;
    })();

    const courseId = crypto.randomUUID();

    const baseCourse: Course = {
      id: courseId,
      title: courseTitle,
      description: courseDescription,
      thumbnailUrl:
        providedThumbnail ||
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      meta: { id: "123" },
    };

    const buildVideo = (prompt: string) => ({
      provider: "Sora AI",
      status: "generated",
      duration: videoLength,
      prompt,
      url: "https://example.com/sora-ai/preview.mp4",
    });

    const modules = [
      {
        id: crypto.randomUUID(),
        title: audience
          ? `Module 1 · Core Concepts for ${audience}`
          : "Module 1 · Core Concepts",
        description: tone
          ? `A single-module walkthrough delivered in a ${tone} tone.`
          : "A single-module walkthrough of the key ideas.",
        lessons: [
          {
            id: crypto.randomUUID(),
            title: "Lesson 1 · Sora AI Overview",
            summary: `A concise introduction with one generated video to explain the essentials${audience ? ` for ${audience}` : ""}.`,
            video: buildVideo(
              `Create a single video lesson in a ${tone || "clear"} tone${
                narrationVoice
                  ? ` with a ${narrationVoice} narration voice`
                  : ""
              }. Focus on the core ideas from the provided materials.`,
            ),
          },
          {
            id: crypto.randomUUID(),
            title: "Lesson 2 · Key Terminology",
            summary: "Define the essential vocabulary for the course.",
            video: buildVideo("Explain key terms with simple visuals."),
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        title: "Module 2 · Applied Practice",
        description: "Hands-on walkthroughs and real examples.",
        lessons: [
          {
            id: crypto.randomUUID(),
            title: "Lesson 3 · Guided Demo",
            summary: "Follow a step-by-step demonstration.",
            video: buildVideo("Walk through a practical example."),
          },
          {
            id: crypto.randomUUID(),
            title: "Lesson 4 · Common Pitfalls",
            summary: "Avoid mistakes and learn best practices.",
            video: buildVideo("Highlight common pitfalls and fixes."),
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        title: "Module 3 · Next Steps",
        description: "Wrap up and plan what to learn next.",
        lessons: [
          {
            id: crypto.randomUUID(),
            title: "Lesson 5 · Recap",
            summary: "Summarize the most important takeaways.",
            video: buildVideo("Summarize the key points and takeaways."),
          },
          {
            id: crypto.randomUUID(),
            title: "Lesson 6 · Next Actions",
            summary: "Outline the recommended next steps.",
            video: buildVideo("Provide a roadmap for continuing learning."),
          },
        ],
      },
    ];

    const course = {
      ...baseCourse,
      modules,
      source: {
        textLength: trimmedText.length,
        links: Array.isArray(body?.links) ? body.links : [],
        fileUrls: Array.isArray(body?.fileUrls) ? body.fileUrls : [],
      },
    };

    console.log(course);

    return NextResponse.json({ ok: true, course });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[POST /api/create] Critical Failure:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }
}
