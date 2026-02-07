"use server";

import { CourseCreationData } from "@/types/global";

export async function createCourse(data: CourseCreationData) {
  console.log("[createCourse] payload", JSON.stringify(data, null, 2));
  return { ok: true };
}
