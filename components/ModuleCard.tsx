import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FileText, Package, SquareLibrary } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

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
    Content: any;
  };
}

const ModuleCard = ({ module }: IModule) => {
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

  const handleClick = (moduleId: string) => {
    router.push(`/Courses/${moduleId}`);
  };
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
      <div className="lg:flex hidden items-center gap-1">
        <FileText size={14} className="text-gray-600" />

        <h1 className="font-bold text-[14px] text-gray-600">
          {module?.Content?.length} courses
        </h1>
      </div>
    </div>
  );
};

export default ModuleCard;
