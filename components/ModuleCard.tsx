import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FileText, Package, SquareLibrary } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "./ui/button";

interface CoursePayload {
  userId: string;
  title: string;
  status: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  thumbnailUrl: string;
  textContent: string | null;
  videoUrls?: File[];
  imageUrls: File[];
  pdf: File[];
  isDiscussion: boolean;
  courseRoomId: string | null;
}

interface IModule {
  module: {
    userId: string;
    roomId: string;
    title: string;
    position: number;
    description: string | null;
    id: string;
    createdAt: Date;
    Content: {
      userId: string;
      title: string;
      status: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      thumbnailUrl: string;
      textContent: string | null;
      videoUrls?: File[];
      imageUrls: File[];
      pdf: File[];
      isDiscussion: boolean;
      courseRoomId: string | null;
    }[];
  };
  isTracking?: boolean;
  trackedCourses?: any;
  trackModules?: any;
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

const ModuleCard = ({
  module,
  isTracking,
  trackedCourses,
  trackModules,
}: IModule) => {
  const { userId } = useAuth();
  const router = useRouter();
  async function fetchCourses(): Promise<CoursePayload[]> {
    const response = await axios.get(
      `http://localhost:8080/v1/getCourses/${module.id}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const {
    data: courses,
    error: coursesError,
    isLoading: loadingCourses,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  async function fetchUserTracks(): Promise<ITrack[]> {
    const response = await axios.get(
      `http://localhost:8080/v1/getTrackedModule/${userId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const {
    data: trackedModules,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`tracks:${userId}`],
    queryFn: fetchUserTracks,
  });

  const checkIfTracked = useMemo(() => {
    const modules = trackedModules?.map((data) => data.module.id);
    return modules?.includes(module.id);
  }, [module.id, trackedModules]);

  const handleClick = async (moduleId: string) => {
    try {
      const isTracked = trackedModules?.some(
        (data) => data.module.id === module.id
      );
      if (!isTracked) {
        const response = await axios.post(
          `http://localhost:8080/v1/trackModule/${module.id}`,
          {
            userId: userId,
          }
        );
        alert("Tracked!");
        if (response.status === 201) {
          router.push(`/Courses/${moduleId}`);
        }
      } else {
        alert("already tracked!");
        router.push(`/Courses/${moduleId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filterCourseByModuleId = () => {
    const courses = trackedCourses?.filter(
      (data: any) => data.content.Module.id === module.id
    ).length as any;
    console.log("Filtered Courses:", courses);
    return courses;
  };

  const calculateProgress = useMemo(() => {
    const percentageViewed =
      (filterCourseByModuleId() / module.Content.length) * 100;
    console.log(percentageViewed);
    return percentageViewed;
  }, [filterCourseByModuleId(), module.Content.length]);

  return (
    <div
      onClick={() => handleClick(module.id)}
      className=" p-3 border border-gray-300 rounded-[10px] flex justify-between items-center hover:border-[#47f486] cursor-pointer"
    >
      <>
        <div className="flex items-center gap-2">
          <div className="bg-[#47f486] rounded-[5px] p-2 items-center">
            <Package size={14} color="#fff" />
          </div>

          <div className="flex flex-col ">
            <h1 className="font-bold text-[14px] text-gray-600">
              {module.title}
            </h1>
            <p className="text-[12px] text-gray-600">{module.description}</p>
          </div>
        </div>
      </>
      <div className={`flex gap-20 items-center justify-center ${isTracking && "justify-start lg:w-[40%]"} `}>
        {isTracking && (
          <div className="flex items-center flex-col">
            {module.Content.length === 0 ? (
              <>
                <div className="flex gap-1 items-center">
                  <div className="w-7">
                    <CircularProgressbar
                      value={0}
                      text={`${
                        CircularProgressbar === (NaN as any) && (0 as any)
                      }`}
                      strokeWidth={10}
                      styles={buildStyles({
                        textColor: "#47f486",
                        pathColor: "#47f486",
                        trailColor: "",
                        textSize: 0,
                      })}
                      className=""
                    />
                  </div>
                  <h1 className="text-gray-600 text-[12px] font-bold">0%</h1>
                </div>
              </>
            ) : (
              <div className="flex gap-1 items-center">
                <div className="w-7">
                  <CircularProgressbar
                    value={calculateProgress}
                    text={`${
                      CircularProgressbar === (NaN as any) && calculateProgress
                    }%`}
                    strokeWidth={10}
                    styles={buildStyles({
                      textColor: "#47f486",
                      pathColor: "#47f486",
                      trailColor: "",
                      textSize: 0,
                    })}
                    className=""
                  />
                </div>
                <h1 className="text-gray-600 text-[12px] font-bold">
                  {calculateProgress}%
                </h1>
              </div>
            )}
          </div>
        )}
        <div
          className={`lg:flex hidden items-center gap-1 ${
            isTracking && "lg:flex sm:flex  hidden"
          }`}
        >
          <FileText size={14} className="text-gray-600" />

          <h1 className="font-bold text-[14px] text-gray-600 flex gap-1">
            {module?.Content?.length}{" "}
            <span className="font-bold text-[14px] text-gray-600 flex">
              courses
            </span>
          </h1>
        </div>
        {isTracking && (
          <div
            className={`${
              isTracking &&
              "lg:flex sm:flex justify-end items-end lg:ml-10  hidden"
            }`}
          >
            {calculateProgress === 100 ? (
              <Button className="bg-[#8c6dfd] flex justify-end items-end ">
                Completed
              </Button>
            ) : (
              <Button className="bg-[#8c6dfd] ">
                {module.Content.length > 0 ? "Continue" : "Start"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleCard;
