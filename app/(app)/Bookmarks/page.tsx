"use client";
import RoomCard from "@/components/RoomCard";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, Search } from "lucide-react";
import React, { CSSProperties, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

interface IBookmark {
  id: string;
  userId: string;
  roomId: string;
  bookMarkedAt: Date;
  user: {
    id: string;
    clerkId: string;
  };
  room: {
    roomName: string;
    roomDescription: string | null;
    category: string | null;
    status: "private" | "public";
    id: string;
    createdAt: any;
    userId: string;
    roomImage: string | null;
    coverImage: string | null;
    userIds: string[];
    creator: {
      username: string;
    };
  };
}
const page = () => {
  const { userId } = useAuth();
  const [searchRooms, setSearchRooms] = useState("");
  async function fetchUser(): Promise<IBookmark[]> {
    const response = await axios.get(
      `http://localhost:8080/v1/get-user-bookmarks/${userId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const {
    data: bookmarks,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`bookmarks:${userId}`],
    queryFn: fetchUser,
  });

  const skeletondata = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
    {
      id: 6,
    },
    {
      id: 7,
    },
    {
      id: 8,
    },
  ];

  const filterRooms = () => {
    if (!searchRooms.trim()) return bookmarks;

    const searchTerm = searchRooms.trim().toLowerCase();

    const matchSearch = (bookmark: IBookmark) => {
      return [
        bookmark?.room?.roomName.toLowerCase(),
        formatDistanceToNow(new Date(bookmark?.room?.createdAt), {
          addSuffix: true,
        }),
      ].some((field) => field.includes(searchTerm));
    };

    return (bookmarks as any).filter(matchSearch);
  };

  const unBookmark = async () => {
    try {
      await axios(``);
    } catch (error) {}
  };
  return (
    <>
      <div className="flex gap-2 lg:px-10 px-5">
        <button className="rounded-[5px] border-[1px] py-1 px-3 text-gray-600 text-[12px]">
          Rooms
        </button>
        <button className="rounded-[5px] border-[1px] py-1 px-3 text-gray-600 text-[12px]">
          Modules
        </button>
        <button className="rounded-[5px] border-[1px] py-1 px-3 text-gray-600 text-[12px]">
          Courses
        </button>
        <button className="rounded-[5px] border-[1px] py-1 px-3 text-gray-600 text-[12px]">
          Quizzes
        </button>
      </div>
      <div className="lg:px-[50px] px-5 py-3 w-full">
        <div className="flex gap-5 items-center w-full">
          <>
            <span className="flex items-center gap-1 text-[12px] font-bold">
              {bookmarks?.length} <span className="font-bold">rooms</span>
            </span>
          </>
          <Separator orientation="vertical" className=" h-7" />
          <label className="flex gap-2 items-center w-full">
            <Search className="text-gray-500" size={14} />
            <input
              type="search"
              placeholder="Search..."
              className="border-none outline-none w-full text-[13px]"
              onChange={(e) => setSearchRooms(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="lg:px-[50px] px-3 py-3 w-full">
        {!isLoading && (!filterRooms() || filterRooms() === (0 as any)) ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <Bookmark size={70} className="text-gray-600" />
            <h1 className="text-center text-gray-600 font-bold">
              No Bookmarks
            </h1>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
            {filterRooms()?.map((content: any) => (
              <RoomCard
                content={content.room}
                key={content.id}
                bookmarkId={content.id}
              />
            ))}
          </div>
        )}

        {isLoading && (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5  w-full">
            {/*  <BeatLoader
            color="#8c6dfd"
            loading={isLoading}
            cssOverride={override}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
            className="justify-center"
          />*/}
            {skeletondata.map((data) => (
              <div className="flex flex-col space-y-3 " key={data.id}>
                <Skeleton className="h-[125px]  w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 l w-full" />
                  <div className="flex justify-between gap-3">
                    <Skeleton className="h-4 l w-full" />
                    <Skeleton className="h-4  w-full" />
                  </div>
                  <Skeleton className="h-4  w-[100px]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default page;
