"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Book,
  Gamepad,
  ImageIcon,
  Pencil,
  Plus,
  SquarePlay,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@clerk/clerk-react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Question from "./Question";
import useLocalStorage from "@/hooks/useLocalStorage";
import QuizCard from "./QuizCard";

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

interface IQuiz {
  userId: string;
  title: string;
  id: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
  }[];
}
[];

interface UserAnswerPayload {
  userId: string;
  answer: string;
  isCorrect: boolean | null;
}

const CourseContent = ({ courseId }: { courseId: string }) => {
  const { userId } = useAuth();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentVideo, setCurrentVideo] = useState("");
  const [answers, setAnswers] = useLocalStorage<any>("answers", {});
  const [score, setScore] = useLocalStorage<any>("score", null);
  const [quizId, setQuizId] = useLocalStorage<string>("quizId", "");
  const [userQuiz, setUserQuiz] = useState<boolean>(false);
  const [isSubmitting, setisSubmitting] = useState<boolean>(false);

  const router = useRouter();
  async function fetchCourse(): Promise<CoursePayload> {
    const response = await axios.get(
      `http://localhost:8080/v1/getCourse/${courseId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const { data, error, isLoading } = useQuery({
    queryKey: [`course:${courseId}`],
    queryFn: fetchCourse,
  });

  const handleVideo = (index: number) => {
    console.log(data?.videoUrls?.[index] as any);
    const url = data?.videoUrls?.[index];
    setCurrentVideo(url as any);
  };

  const navigateQuiz = () => {
    router.push(`/create-quiz/${courseId}`);
  };

  async function fetchCourseQuiz(): Promise<IQuiz[]> {
    const response = await axios.get(
      `http://localhost:8080/v1/get-quiz/${courseId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const {
    data: quizzes,
    error: isError,
    isLoading: quizloading,
  } = useQuery({
    queryKey: [`quiz:${courseId}`],
    queryFn: fetchCourseQuiz,
  });

  const handleAnswerChange = (q_id: string, value: string) => {
    //answers.1234 = "Answer"
    setAnswers({ ...answers, [q_id]: value });
  };

  return (
    <div className="lg:px-20 px-3 pb-10">
      <div className="flex justify-between items-center">
        <>
          <h1 className="text-gray-600 font-bold py-5 text-[20px]">
            Chapter 1: {data?.title}
          </h1>
        </>
        <Button className="bg-[#8c6dfd] flex gap-1 font-bold items-center text-white py-2 px-4 rounded-md text-[14px]">
          <Pencil size={13} className="font-bold" />
          <span className="lg:block hidden font-bold">Edit Course</span>
        </Button>
      </div>
      <div className="">
        <div className="flex gap-2 pb-5">
          <div className="bg-[#eb4174] rounded-[5px] p-1 items-center flex gap-2">
            <SquarePlay size={14} color="#fff" />
          </div>
          <h1 className="font-bold text-gray-600 text-[16px]">Video</h1>
        </div>
        <div className="flex flex-col gap-7 bg-gray-100 lg:w-[70%] w-full rounded-[20px]">
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
            A course by{" "}
            <span className="text-[#8c6dfd] font-bold">
              {data?.creator?.username}
            </span>
          </h1>
          <p className="text-gray-600 text-[13px]">{data?.textContent}</p>
        </div>
        <div className="mt-10">
          <div className="flex gap-2 pb-3">
            <div className="bg-[#39e75f] rounded-[5px] p-1 items-center flex gap-2">
              <ImageIcon size={14} color="#fff" />
            </div>
            <h1 className="font-bold text-gray-600 text-[16px]">Images</h1>
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 lg:gap-4 gap-2 pb-5 w-full rounded-[20px] p-5 border border-gray-200 shadow-sm">
            {data?.imageUrls?.map((image, index) => (
              <div className="rounded-[10px]">
                <Image
                  src={image as any}
                  alt="image"
                  width={500}
                  height={500}
                  className="rounded-[10px] lg:h-[200px] h-[150px] w-full object-contain shadow-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex gap-2 pb-5">
            <div className="bg-[#d2d950] rounded-[5px] p-1 items-center flex gap-2">
              <ImageIcon size={14} color="#fff" />
            </div>
            <h1 className="font-bold text-gray-600 text-[16px]">PDFs</h1>
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 pb-5 w-full">
            {data?.pdf?.map((url, index) => {
              return (
                <div className="border p-4 rounded-xl flex items-center justify-between w-full">
                  <span className="text-lg font-semibold text-gray-700">
                    📄 PDF Document
                  </span>
                  <a
                    href={url as any}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-[13px]"
                  >
                    View PDF
                  </a>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 pb-5">
              <div className="bg-[#8c6dfd] rounded-[5px] p-1 items-center flex gap-2">
                <Gamepad size={14} color="#fff" />
              </div>
              <h1 className="font-bold text-gray-600 text-[16px]">Quiz</h1>
            </div>

            <Button
              onClick={navigateQuiz}
              className="bg-[#8c6dfd] flex gap-1 font-bold items-center text-white py-2 px-4 rounded-md text-[14px]"
            >
              <Plus className="font-bold" size={15} />
              Add Quiz
            </Button>
          </div>
          <div className="">
            {!quizloading && (!quizzes || quizzes.length === 0) ? (
              <div className="flex flex-col gap-2 justify-center text-gray-600 items-center mt-5">
                <Gamepad size={50} />
                <h1 className=" text-gray-600 font-bold text-center">
                  No Quiz
                </h1>
              </div>
            ) : (
              <div className="mt-5">
                {quizzes?.map((quiz, index) => (
                  <QuizCard
                    quiz={quiz}
                    handleAnswerChange={handleAnswerChange}
                    answers={answers}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
