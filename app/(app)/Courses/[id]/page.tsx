import Course from "@/components/Course";
import Room from "@/components/Room";
import React from "react";

interface IParams {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IParams) => {
  const moduleId = (await params).id;
  return <Course moduleId={moduleId} />;
};

export default page;