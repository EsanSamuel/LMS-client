"use client";
import ModuleCard from "@/components/ModuleCard";
import QuizCard from "@/components/QuizCard";
import RoomCard from "@/components/RoomCard";
import TrackQuizCard from "@/components/TrackQuizCard";
import { Button } from "@/components/ui/button";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Package } from "lucide-react";
import React, { CSSProperties, useMemo, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

interface User {
  username: string;
  profileImage: string;
}

interface ITrack {
  userId: string;
  moduleId: string;
  id: string;
  addedAt: Date;
  module: {
    userId: string;
    roomId: string;
    title: string;
    position: number;
    description: string | null;
    id: string;
    createdAt: Date;
    Content: any;
  };
}

interface ICourse {
  id: string;
  userId: string;
  contentId: string;
  addedAt: Date;
  content: {
    id: string;
    module: any;
  };
}

const page = () => {
  const { userId } = useAuth();
  const [showRoom, setShowRoom] = useState("two");
  const [show, setShow] = useState("two");
  const [answers, setAnswers] = useLocalStorage<any>("answers", {});
  async function fetchUser(): Promise<User | null> {
    if (!userId) return null;
    const response = await axios.get(
      `http://localhost:8080/v1/getUser/${userId}`
    );
    console.log(response.data.data, userId);
    return response.data.data;
  }

  const { data, error, isLoading } = useQuery({
    queryKey: [`user:${userId}`],
    queryFn: fetchUser,
    enabled: !!userId,
  });

  const getFirstName = useMemo(() => {
    if (data?.username.includes(" ")) {
      const [firstName, lastName] = data?.username.split(" ");
      return firstName;
    } else {
      return data?.username;
    }
  }, [data?.username]);

  const getDay = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  }, []);

  async function fetchUserTracks(): Promise<ITrack[]> {
    const response = await axios.get(
      `http://localhost:8080/v1/getTrackedModule/${userId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const {
    data: trackCourses,
    error: trackError,
    isLoading: trackLoading,
  } = useQuery({
    queryKey: [`tracks:${userId}`],
    queryFn: fetchUserTracks,
  });

  const getnumofModule = useMemo(() => {
    if (show === "two") {
      return trackCourses?.slice(0, 2);
    } else if (show === "all") {
      return trackCourses;
    } else {
      return trackCourses;
    }
  }, [show, trackCourses]);

  async function fetchUserTrackedCourses(): Promise<ICourse[]> {
    const response = await axios.get(
      `http://localhost:8080/v1/getTrackedCourse/${userId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const {
    data: tracked,
    error: isError,
    isLoading: loading,
  } = useQuery({
    queryKey: [`trackCourses:${userId}`],
    queryFn: fetchUserTrackedCourses,
  });

  async function fetchUserTrackRoooms(): Promise<any[]> {
    const response = await axios.get(
      `http://localhost:8080/v1/getTrackedRoom/${userId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const {
    data: trackedRoom,
    error: roomError,
    isLoading: roomIsloading,
  } = useQuery({
    queryKey: [`trackRooms:${userId}`],
    queryFn: fetchUserTrackRoooms,
  });

  const getnumofRooms = useMemo(() => {
    if (show === "two") {
      return trackedRoom?.slice(0, 2);
    } else if (show === "all") {
      return trackedRoom;
    } else {
      return trackedRoom;
    }
  }, [show, trackedRoom]);

  async function fetchUserTrackQuiz(): Promise<any[]> {
    const response = await axios.get(
      `http://localhost:8080/v1/getTrackedQuiz/${userId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const {
    data: trackedQuiz,
    error: quizError,
    isLoading: quizloading,
  } = useQuery({
    queryKey: [`trackQuiz:${userId}`],
    queryFn: fetchUserTrackQuiz,
  });

  const handleAnswerChange = (q_id: string, value: string) => {
    //answers.1234 = "Answer"
    setAnswers({ ...answers, [q_id]: value });
  };

  return (
    <div className="lg:px-[50px] px-5 py-10">
      <h1 className="font-bold text-[24px] text-gray-600">
        Good {getDay}, {getFirstName} 👋
      </h1>
      <p className="text-gray-600 text-[11px] mt-2">
        Welcome to lms app, check rooms, courses you've started learning!
      </p>

      <div className="mt-10">
        <div className="flex justify-between">
          <h1 className="font-bold text-[14px] text-gray-600">
            In progress learning modules
          </h1>
          {show === "two" ? (
            <button
              className="underline text-blue-400 text-[13px]"
              onClick={() => setShow("all")}
            >
              View All
            </button>
          ) : (
            <button
              className="underline text-blue-400 text-[13px]"
              onClick={() => setShow("two")}
            >
              View less
            </button>
          )}
        </div>
        {!trackLoading && (!trackCourses || trackCourses.length === 0) ? (
          <div className="flex flex-col items-center justify-center mt-5">
            <h1 className="text-center text-gray-600 font-bold text-[12px]">
              No Engaged Modules yet!
            </h1>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-5">
            {getnumofModule?.map((course) => (
              <div className="" key={course.id}>
                <ModuleCard
                  module={course.module}
                  isTracking
                  trackedCourses={tracked}
                  trackModules={trackCourses}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10">
          <div className="flex justify-between">
            <h1 className="font-bold text-[14px] text-gray-600">
              Engaged Rooms
            </h1>
            {showRoom === "two" ? (
              <button
                className="underline text-blue-400 text-[13px]"
                onClick={() => setShowRoom("all")}
              >
                View All
              </button>
            ) : (
              <button
                className="underline text-blue-400 text-[13px]"
                onClick={() => setShowRoom("two")}
              >
                View less
              </button>
            )}
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 mt-5">
            {trackedRoom?.map((content: any) => (
              <RoomCard content={content.room} key={content.id} />
            ))}
          </div>

          <div className="mt-10">
            <div className="flex justify-between mt-5">
              <h1 className="font-bold text-[14px] text-gray-600">
                Engaged Quiz
              </h1>
              {showRoom === "two" ? (
                <button
                  className="underline text-blue-400 text-[13px]"
                  onClick={() => setShowRoom("all")}
                >
                  View All
                </button>
              ) : (
                <button
                  className="underline text-blue-400 text-[13px]"
                  onClick={() => setShowRoom("two")}
                >
                  View less
                </button>
              )}
            </div>
            <div className=" mt-5 w-full">
              <Table>
                <TableCaption>Quizzes you've taken.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz Title</TableHead>
                    <TableHead>Date attempted</TableHead>
                    <TableHead className="">Score</TableHead>
                    <TableHead className="">Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trackedQuiz?.map((data: any) => (
                    <TrackQuizCard
                      quiz={data?.quiz}
                      handleAnswerChange={handleAnswerChange}
                      answers={answers}
                    />
                  ))}
                </TableBody>
              </Table>

              {/* {trackedQuiz?.map((data: any) => (
                <QuizCard
                  quiz={data.quiz}
                  handleAnswerChange={handleAnswerChange}
                  answers={answers}
                />
              ))}*/}
            </div>
          </div>
        </div>
      </div>

      {trackLoading && (
        <div className="flex items-center justify-center h-full mt-20">
          <BeatLoader
            color="#8c6dfd"
            loading={trackLoading}
            cssOverride={override}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
            className="justify-center"
          />
        </div>
      )}
    </div>
  );
};

export default page;
