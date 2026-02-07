export type CourseMeta = {
  id: string;
}

export type Config = {
  audience: string;
  tone: string;
  videoLength: string;
  narrationVoice: string;
  maxChapters: number;
  includedQuizzes: boolean;
}

export type CourseCreationData = {
  text: string;
  fileUrls: string[];
  links: string[];
  config: Config;
}
