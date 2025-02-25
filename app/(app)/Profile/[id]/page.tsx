import Course from "@/components/Course";
import Profile from "@/components/Profile";
import Room from "@/components/Room";
import React from "react";

interface IParams {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IParams) => {
  const userId = (await params).id;
  return <Profile userId={userId} />;
};

export default page;