import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseCreatorForm from "./course-creator-form";

export default async function CreateCourse() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    redirect("/");
  }

  return <CourseCreatorForm />;
}
