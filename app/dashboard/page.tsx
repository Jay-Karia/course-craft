import CreateCourse from "@/components/create-course";
import MyCourses from "@/components/my-courses";
import RecommendedCourses from "@/components/recommended-courses";
import ScrollableFeed from "@/components/scrollable-feed";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <div className="h-screen w-full overflow-x-hidden">
      <ScrollableFeed className="h-full w-full">
        <div className="container mx-auto max-w-8xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <CreateCourse />
            <MyCourses />
            <RecommendedCourses />
          </div>
        </div>
      </ScrollableFeed>
    </div>
  );
}
