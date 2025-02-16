import Quiz from "@/components/Quiz";
import Room from "@/components/Room";
import React from "react";

interface IParams {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IParams) => {
  const courseId = (await params).id;
  return <Quiz courseId={courseId} />;
};

export default page;
