"use client";

import { PiSparkleThin } from "react-icons/pi";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { CourseCreationData } from "@/types/global";
import { createCourse } from "@/actions/course";

export default function GenerateCourseButton({
  courseData,
}: {
  courseData: CourseCreationData;
}) {
  return (
    <HoverBorderGradient
      containerClassName="rounded-full w-full "
      as="button"
      className="dark:bg-black bg-slate-100 text-black dark:text-white flex items-center space-x-2 w-full justify-center hover:-translate-y-0.5 transition-transform duration-300 hover:cursor-pointer"
      onClick={() => {
        createCourse(courseData);
      }}
    >
      <span className="flex gap-3 items-center">
        <PiSparkleThin size={25} /> Generate
      </span>
    </HoverBorderGradient>
  );
}
