// app/api/create/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { Course } from "@/types/global";

export const runtime = "nodejs";

type AiCourseCopy = {
  title: string;
  description: string;
};

type AiLesson = {
  title: string;
  summary: string;
  topics: string[];
  videoScript?: string;
  keyPoints?: string[];
  duration?: string;
  quiz?: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }>;
  };
};

type AiModule = {
  title: string;
  description: string;
  estimatedTime?: string;
  lessons: AiLesson[];
};

type AiCourseOutline = {
  title: string;
  description: string;
  totalDuration?: string;
  modules: AiModule[];
};

const MAX_AI_TEXT_CHARS = 6000;

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
  const apiKey = process.env.GEMINI_AI_API;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL ?? "gemini-3-flash-preview";

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
              text: "You are generating a course title and description for a video course. Return only valid JSON with keys title and description.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Create a concise, marketable title (max 8 words) and a 2-3 sentence description. Use the audience and tone if provided. Data: ${JSON.stringify(
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

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("[Gemini course copy]", response.status, errorText);
    return null;
  }
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
  console.log(parsed)
  return parseAiCopy(parsed);
};

const parseAiOutline = (value: unknown): AiCourseOutline | null => {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const description =
    typeof record.description === "string" ? record.description.trim() : "";
  const totalDuration =
    typeof record.totalDuration === "string" ? record.totalDuration.trim() : "";
  const modules = Array.isArray(record.modules) ? record.modules : [];

  if (!title || !description || modules.length === 0) {
    console.error("[parseAiOutline] Missing required fields:", { title: !!title, description: !!description, modulesCount: modules.length });
    return null;
  }

  const cleanedModules: AiModule[] = modules
    .map((module: any, idx: number) => {
      const moduleTitle =
        typeof module?.title === "string" ? module.title.trim() : "";
      const moduleDescription =
        typeof module?.description === "string"
          ? module.description.trim()
          : "";
      const estimatedTime =
        typeof module?.estimatedTime === "string" ? module.estimatedTime.trim() : "";
      const lessons = Array.isArray(module?.lessons) ? module.lessons : [];

      if (!moduleTitle || !moduleDescription) {
        console.error(`[parseAiOutline] Module ${idx} missing title or description`);
        return null;
      }

      const cleanedLessons: AiLesson[] = lessons
        .map((lesson: any, lessonIdx: number) => {
          const lessonTitle =
            typeof lesson?.title === "string" ? lesson.title.trim() : "";
          const lessonSummary =
            typeof lesson?.summary === "string" ? lesson.summary.trim() : "";
          const videoScript =
            typeof lesson?.videoScript === "string" ? lesson.videoScript.trim() : "";
          const duration =
            typeof lesson?.duration === "string" ? lesson.duration.trim() : "";
          const topics = Array.isArray(lesson?.topics)
            ? lesson.topics.filter((topic: any) => typeof topic === "string")
            : [];
          const keyPoints = Array.isArray(lesson?.keyPoints)
            ? lesson.keyPoints.filter((point: any) => typeof point === "string")
            : [];

          if (!lessonTitle || !lessonSummary) {
            console.error(`[parseAiOutline] Lesson ${lessonIdx} in module ${idx} missing title or summary`);
            return null;
          }

          // Parse quiz if present
          let quiz = undefined;
          if (lesson?.quiz && Array.isArray(lesson.quiz.questions)) {
            quiz = {
              questions: lesson.quiz.questions.map((q: any) => ({
                question: typeof q?.question === "string" ? q.question : "",
                options: Array.isArray(q?.options) ? q.options : [],
                correctAnswer: typeof q?.correctAnswer === "string" ? q.correctAnswer : "",
                explanation: typeof q?.explanation === "string" ? q.explanation : "",
              })).filter((q: any) => q.question && q.correctAnswer),
            };
            if (quiz.questions.length === 0) quiz = undefined;
          }

          return {
            title: lessonTitle,
            summary: lessonSummary,
            topics,
            videoScript,
            keyPoints,
            duration,
            quiz,
          };
        })
        .filter(Boolean) as AiLesson[];

      if (cleanedLessons.length === 0) {
        console.error(`[parseAiOutline] Module ${idx} has no valid lessons`);
        return null;
      }

      return {
        title: moduleTitle,
        description: moduleDescription,
        estimatedTime,
        lessons: cleanedLessons,
      };
    })
    .filter(Boolean) as AiModule[];

  if (cleanedModules.length === 0) {
    console.error("[parseAiOutline] No valid modules parsed");
    return null;
  }

  console.log(`[parseAiOutline] Successfully parsed ${cleanedModules.length} modules with ${cleanedModules.reduce((sum, m) => sum + m.lessons.length, 0)} total lessons`);

  return {
    title,
    description,
    totalDuration,
    modules: cleanedModules
  };
};

const generateCourseOutline = async (input: {
  text: string;
  audience: string;
  tone: string;
  videoLength: string;
  narrationVoice: string;
  links: string[];
  fileUrls: string[];
  maxChapters: number;
  includeQuizzes: boolean;
}): Promise<AiCourseOutline | null> => {
  const apiKey = process.env.GEMINI_AI_API;
  if (!apiKey) {
    console.error("[generateCourseOutline] No GEMINI_AI_API key found");
    return null;
  }

  const model = "gemini-3-flash-preview";

  const quizSection = input.includeQuizzes
    ? `, "quiz": { "questions": [{"question": "string", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "explanation": "string"}] }`
    : ``;

  const promptText = `You are a professional course designer. Create a complete video course outline.

COURSE CONTENT:
${input.text}

CONFIGURATION:
- Target Audience: ${input.audience || "general learners"}
- Tone: ${input.tone || "professional"}
- Video Length per Lesson: ${input.videoLength || "10-15 minutes"}
- Narration Style: ${input.narrationVoice || "clear and engaging"}
- Include Quizzes: ${input.includeQuizzes}

REQUIREMENTS:
3. Each lesson MUST include a detailed videoScript (300-500 words)
4. Each lesson MUST include 4-6 keyPoints
5. Each lesson MUST include 3-5 topics
${input.includeQuizzes ? "6. Each lesson MUST include a quiz with 3-4 multiple choice questions" : ""}

RETURN THIS EXACT JSON STRUCTURE:
{
  "title": "Course Title Here",
  "description": "2-3 sentence course description",
  "totalDuration": "Total time estimate (e.g., '3 hours')",
  "modules": [
    {
      "title": "Module 1: Title",
      "description": "What this module covers",
      "estimatedTime": "Time estimate (e.g., '45 minutes')",
      "lessons": [
        {
          "title": "Lesson 1.1: Title",
          "summary": "What students will learn in this lesson",
          "duration": "10 minutes",
          "topics": ["Topic 1", "Topic 2", "Topic 3"],
          "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"],
          "videoScript": "DETAILED 300-500 WORD SCRIPT: Start with a hook to grab attention. Introduce the topic clearly. Explain the main concepts with specific examples. Include demonstrations or case studies. Use analogies to make complex ideas simple. Summarize key takeaways. End with a call to action or next steps."${quizSection}
        }
      ]
    }
  ]
}
`;


  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: promptText,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("[Gemini course outline] HTTP Error:", response.status, errorText);
    return null;
  }

  const json = await response.json().catch(() => null);
  if (!json) {
    console.error("[Gemini course outline] Failed to parse JSON response");
    return null;
  }

  // Try parsing the response
  const direct = parseAiOutline(json);
  if (direct) {
    console.log(`[generateCourseOutline] Successfully parsed direct response`);
    return direct;
  }

  const geminiJson = parseGeminiJson(json);
  if (geminiJson) {
    const geminiOutline = parseAiOutline(geminiJson);
    if (geminiOutline) {
      console.log(`[generateCourseOutline] Successfully parsed from Gemini JSON`);
      return geminiOutline;
    }
  }

  const outputText = getGeminiText(json);
  if (outputText) {
    const parsed = extractJsonObject(outputText);
    const result = parseAiOutline(parsed);
    if (result) {
      console.log(`[generateCourseOutline] Successfully parsed from output text`);
      return result;
    }
  }

  console.error("[generateCourseOutline] All parsing attempts failed");
  console.log("Raw response:", JSON.stringify(json, null, 2));
  return null;
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const rawText = typeof body?.text === "string" ? body.text : "";
    const trimmedText = rawText.trim();
    const generationErrors: string[] = [];

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
      typeof body?.config?.audience === "string" ? body.config.audience : "general learners";
    const tone = typeof body?.config?.tone === "string" ? body.config.tone : "professional";
    const videoLength =
      typeof body?.config?.videoLength === "string"
        ? body.config.videoLength
        : "10-15 min";
    const narrationVoice =
      typeof body?.config?.narrationVoice === "string"
        ? body.config.narrationVoice
        : "clear and engaging";
    const includeQuizzes =
      typeof body?.config?.includeQuizzes === "boolean"
        ? body.config.includeQuizzes
        : true;
    const maxChapters =
      typeof body?.config?.maxChapters === "number"
        ? body.config.maxChapters
        : 4; // Default to 4 modules

    // Generate course copy (title and description)
    console.log("[AI] Step 1: Generating course copy...");
    const aiCopy = await generateCourseCopy({
      text: trimmedText,
      audience,
      tone,
      videoLength,
      narrationVoice,
      links: Array.isArray(body?.links) ? body.links : [],
      fileUrls: Array.isArray(body?.fileUrls) ? body.fileUrls : [],
    });

    if (aiCopy) {
      console.log(`[AI] ✓ Generated title: "${aiCopy.title}"`);
    } else {
      generationErrors.push(
        "AI failed to generate the course title and description. Using fallback content.",
      );
    }

    // Generate detailed course outline with scripts
    console.log("[AI] Step 2: Generating detailed course outline...");
    const aiOutline = await generateCourseOutline({
      text: trimmedText,
      audience,
      tone,
      videoLength,
      narrationVoice,
      links: Array.isArray(body?.links) ? body.links : [],
      fileUrls: Array.isArray(body?.fileUrls) ? body.fileUrls : [],
      maxChapters,
      includeQuizzes,
    });

    if (!aiOutline) {
      console.error("[AI] Failed to generate course outline");
      generationErrors.push(
        "AI failed to generate the course outline. Modules and lessons are unavailable.",
      );
    } else {
      console.log(`[AI] ✓ Generated ${aiOutline.modules.length} modules`);
    }

    const courseTitle =
      aiOutline?.title || aiCopy?.title || providedTitle || titleFromText;
    const courseDescription = (() => {
      if (aiOutline?.description) return aiOutline.description;
      if (aiCopy?.description) return aiCopy.description;
      if (providedDescription) return providedDescription;
      return `A comprehensive video course for ${audience} with a ${tone} tone.`;
    })();

    const courseId = crypto.randomUUID();

    const baseCourse: Course = {
      id: courseId,
      title: courseTitle,
      description: courseDescription,
      thumbnailUrl:
        providedThumbnail ||
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      meta: {
        id: courseId,
        // totalDuration: aiOutline?.totalDuration || "N/A",
      },
    };

    const buildVideo = (prompt: string, script?: string, duration?: string) => ({
      provider: "AI Video Generator",
      status: "ready_for_generation",
      duration: duration || videoLength,
      prompt,
      script: script || prompt,
      url: null,
    });

    // Build modules from AI outline
    let modules: any[] = [];

    if (aiOutline?.modules && aiOutline.modules.length > 0) {
      modules = aiOutline.modules.map((module, moduleIndex) => ({
        id: crypto.randomUUID(),
        moduleNumber: moduleIndex + 1,
        title: module.title,
        description: module.description,
        estimatedTime: module.estimatedTime || "N/A",
        lessons: module.lessons.map((lesson, lessonIndex) => ({
          id: crypto.randomUUID(),
          lessonNumber: lessonIndex + 1,
          title: lesson.title,
          summary: lesson.summary,
          topics: lesson.topics ?? [],
          keyPoints: lesson.keyPoints ?? [],
          duration: lesson.duration || videoLength,
          videoScript: lesson.videoScript || `Script for ${lesson.title}: ${lesson.summary}`,
          video: buildVideo(
            `Create a ${lesson.duration || videoLength} video lesson: ${lesson.title}. ${lesson.summary}`,
            lesson.videoScript,
            lesson.duration,
          ),
          quiz: lesson.quiz || null,
        })),
      }));
    }

    const course = {
      ...baseCourse,
      modules,
      generationErrors,
      source: {
        textLength: trimmedText.length,
        links: Array.isArray(body?.links) ? body.links : [],
        fileUrls: Array.isArray(body?.fileUrls) ? body.fileUrls : [],
      },
      config: {
        audience,
        tone,
        videoLength,
        narrationVoice,
        includeQuizzes,
        maxChapters,
      },
    };

    const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
    console.log(`[SUCCESS] Course generated with ${modules.length} modules and ${totalLessons} lessons`);

    return NextResponse.json({ ok: true, course });

  } catch (error: any) {
    console.error("[POST /api/create] Critical Failure:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to create course" },
      { status: 500 },
    );
  }
}
