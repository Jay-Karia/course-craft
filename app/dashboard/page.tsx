import CreateCourse from "@/components/create-course";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    redirect("/");
  }
  return (
    <div className="mt-20 mx-30 w-full">
      <CreateCourse />
      <div className="mt-20">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          My Courses
        </h4>
      </div>
    </div>
  );
}
