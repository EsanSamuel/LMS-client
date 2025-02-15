import Course from "@/components/Course";
import CourseContent from "@/components/CourseContent";
import Room from "@/components/Room";
import React from "react";

interface IParams {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IParams) => {
  const courseId = (await params).id;
  return <CourseContent courseId={courseId} />;
};
export default page;
