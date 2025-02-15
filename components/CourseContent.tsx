"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { ImageIcon, SquarePlay } from "lucide-react";
import Image from "next/image";

interface CoursePayload {
  userId: string;
  title: string;
  status: string;
  id: string;
  creator: {
    username: string;
  };
  updatedAt: Date;
  thumbnailUrl: string;
  textContent: string | null;
  videoUrls?: File[];
  imageUrls: File[];
  pdf: File[];
  isDiscussion: boolean;
  courseRoomId: string | null;
}

const CourseContent = ({ courseId }: { courseId: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentVideo, setCurrentVideo] = useState("");
  const router = useRouter();
  async function fetchCourse(): Promise<CoursePayload> {
    const response = await axios.get(
      `http://localhost:8080/v1/getCourse/${courseId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["course"],
    queryFn: fetchCourse,
  });

  const handleVideo = (index: number) => {
    console.log(data?.videoUrls?.[index] as any);
    const url = data?.videoUrls?.[index];
    setCurrentVideo(url as any);
  };

  return (
    <div className="lg:px-20 px-3">
      <h1 className="text-gray-600 font-bold py-5 text-[20px]">
        Chapter 1: {data?.title}
      </h1>
      <div className="">
        <div className="flex gap-2 pb-3">
          <div className="bg-[#eb4174] rounded-[5px] p-1 items-center flex gap-2">
            <SquarePlay size={14} color="#fff" />
          </div>
          <h1 className="font-bold text-gray-600 text-[14px]">Video</h1>
        </div>
        <div className="flex flex-col gap-7 bg-gray-100 w-[70%] rounded-[20px]">
          <video
            ref={videoRef}
            controls
            width="600"
            className="h-[400px] rounded-t-[20px] w-full object-contain"
            key={currentVideo || (data?.videoUrls?.[0] as any)}
          >
            <source
              className="object-cover"
              src={currentVideo || (data?.videoUrls?.[0] as any)}
              type="video/mp4"
            />
          </video>

          <div className="flex gap-2 px-5 pb-5">
            {data?.videoUrls?.map((video, index) => (
              <div onClick={() => handleVideo(index)}>
                <video
                  controls
                  width="600"
                  className={`h-[100px] w-[150px] rounded-[15px] object-contain 
                  ${
                    currentVideo === (data.videoUrls?.[index] as any) &&
                    "border-[#eb4174] border-[4px] rounded-[10px]"
                  }`}
                >
                  <source src={video as any} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <h1 className="text-[17px] font-bold text-gray-600">
            A course by {data?.creator?.username}
          </h1>
          <p className="text-gray-600 text-[13px]">{data?.textContent}</p>
        </div>
        <div className="mt-10">
          <div className="flex gap-2 pb-3">
            <div className="bg-[#39e75f] rounded-[5px] p-1 items-center flex gap-2">
              <ImageIcon size={14} color="#fff" />
            </div>
            <h1 className="font-bold text-gray-600 text-[14px]">Images</h1>
          </div>
          <div className="grid grid-cols-3 gap-2 px-5 pb-5 w-full">
            {data?.imageUrls?.map((image, index) => (
              <div>
                <Image
                  src={image
                  }
                  alt="image"
                  width={1500}
                  height={1500}
                  className="rounded-[10px] h-[300px] w-[1000px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
