import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FileText, SquareLibrary } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

interface ICourse {
  id: string;
  userId: string;
  contentId: string;
  addedAt: Date;
  content: {
    id: string;
  };
}

const CourseCard = ({ course, index }: { course: any; index: number }) => {
  const { userId } = useAuth();
  const router = useRouter();
  async function fetchUserTracks(): Promise<ICourse[]> {
    const response = await axios.get(
      `http://localhost:8080/v1/getTrackedCourse/${userId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const {
    data: trackCourses,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`trackCourses:${userId}`],
    queryFn: fetchUserTracks,
  });

  const checkIfTracked = useMemo(() => {
    const modules = trackCourses?.map((data) => data.content.id);
    return modules?.includes(module.id);
  }, [module.id, trackCourses]);

  const handleClick = async () => {
    try {
      const isTracked = trackCourses?.some(
        (data) => data.content.id === course.id
      );
      if (!isTracked) {
        const response = await axios.post(
          `http://localhost:8080/v1/trackCourse/${course.id}`,
          {
            userId: userId,
          }
        );
        if (response.status === 201) {
          router.push(`/Content/${course.id}`);
        }
      } else {
        alert("already tracked!");
        router.push(`/Content/${course.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      onClick={handleClick}
      className=" p-3 border border-gray-300 rounded-[10px] flex justify-between items-center hover:border-[#ec5fc4] cursor-pointer"
    >
      <>
        <div className="flex items-center gap-2">
          <div className="bg-[#ec5fc4] rounded-[5px] p-2 items-center">
            <SquareLibrary size={14} color="#fff" />
          </div>

          <div className="flex flex-col ">
            <h1 className="font-bold text-[14px] text-gray-600">
              Chapter {index + 1}: {course.title}
            </h1>
            <p className="text-[12px] text-gray-600">
              {course?.textContent?.slice(0, 60)}
            </p>
          </div>
        </div>
      </>
      <div className="lg:flex items-center gap-1 hidden">
        <FileText size={14} className="text-gray-600" />

        <h1 className="font-bold text-[14px] text-gray-600">
          Lesson {index + 1}
        </h1>
      </div>
    </div>
  );
};

export default CourseCard;
