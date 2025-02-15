import Room from "@/components/Room";
import React from "react";

interface IParams {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IParams) => {
  const roomId = (await params).id;
  return <Room roomId={roomId} />;
};

export default page;
