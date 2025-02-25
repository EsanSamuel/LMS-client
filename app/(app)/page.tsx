"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { CSSProperties, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, Library, ListFilter, Search } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { format, formatDistanceToNow, getTime } from "date-fns";
import RoomCard from "@/components/RoomCard";
import useLocalStorage from "@/hooks/useLocalStorage";
import BeatLoader from "react-spinners/BeatLoader";
import { Skeleton } from "@/components/ui/skeleton";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

interface IRooms {
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
}

const page = () => {
  const [sortRooms, setSortRooms] = useLocalStorage<string>("Sort", "Random");
  const [searchRooms, setSearchRooms] = useState("");
  async function fetchUser(): Promise<IRooms[]> {
    const response = await axios.get(`http://localhost:8080/v1/getRooms`);
    console.log(response.data.data);
    return response.data.data;
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: fetchUser,
  });

  const getRooms = useMemo(() => {
    if (sortRooms === "Earliest") {
      return data?.sort(
        (a: any, b: any) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ) as IRooms[];
    } else if (sortRooms === "Newest") {
      return data?.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) as IRooms[];
    } else if (sortRooms === "Random") {
      return data as IRooms[];
    }
  }, [data, sortRooms]);

  const filterRooms = () => {
    if (!searchRooms.trim()) return getRooms;

    const searchTerm = searchRooms.trim().toLowerCase();

    const matchSearch = (room: IRooms) => {
      return [
        room.roomName.toLowerCase(),
        formatDistanceToNow(new Date(room.createdAt), {
          addSuffix: true,
        }),
      ].some((field) => field.includes(searchTerm));
    };

    return (getRooms as IRooms[]).filter(matchSearch);
  };

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

  return (
    <div className="">
      <div className="flex gap-8 text-[12px]  text-gray-600 lg:px-[50px] px-5 pb-3 cursor-pointer">
        <Breadcrumb className="text-[12px]">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-[12px]">
                Room
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components" className="text-[12px]">
                Module
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components" className="text-[12px]">
                Course
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components" className="text-[12px]">
                Content
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-gray-600 text-[12px]">
                Room
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Separator />
      <div className="flex justify-between lg:px-[50px] px-5 py-3">
        <div className="flex gap-5">
          <div className="bg-[#e9effa] border-[#83a4e4]  border py-1 px-3 rounded-sm text-[12px]">
            <h1 className="text-[#83a4e4] ">
              Category: <span className="font-bold">Technology</span>
            </h1>
          </div>
          <Separator orientation="vertical" className=" h-7" />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-2 items-center text-gray-600 text-[13px] outline-none font-bold">
              <Filter size={13} className="font-bold" />
              Add filter
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter By Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="lg:block hidden">
          {" "}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-2 items-center text-gray-600 text-[13px] outline-none font-bold">
              <ListFilter size={13} className="font-bold" />
              Sort: {sortRooms}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortRooms("Newest")}>
                Recently Created
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortRooms("Earliest")}>
                Earliest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortRooms("Random")}>
                Default
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="lg:px-[50px] px-5 py-3 w-full">
        <div className="flex gap-5 items-center w-full">
          <>
            {(filterRooms()?.length as number) > 0 ? (
              <span className="flex items-center gap-1 text-[12px] font-bold">
                {filterRooms()?.length} <span className="font-bold">rooms</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[12px] font-bold">
                0 <span className="font-bold">rooms</span>
              </span>
            )}
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
            <Library size={70} className="text-gray-600" />
            <h1 className="text-center text-gray-600 font-bold">No Rooms</h1>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
            {filterRooms()?.map((content: any) => (
              <RoomCard content={content} key={content.id} />
            ))}
          </div>
        )}
      </div>
      {isLoading && (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 lg:px-[50px] px-5 py-3 w-full">
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
  );
};

export default page;
