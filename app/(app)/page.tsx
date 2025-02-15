"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, Search } from "lucide-react";
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
import { format, formatDistanceToNow } from "date-fns";
import RoomCard from "@/components/RoomCard";

interface IRooms {
  roomName: string;
  roomDescription: string | null;
  category: string | null;
  status: "private" | "public";
  id: string;
  createdAt: Date;
  userId: string;
  roomImage: string | null;
  coverImage: string | null;
  userIds: string[];
  creator: {
    username: string;
  };
}

const page = () => {
  async function fetchUser(): Promise<IRooms[]> {
    const response = await axios.get(`http://localhost:8080/v1/getRooms`);
    console.log(response.data.data);
    return response.data.data;
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: fetchUser,
  });

  return (
    <div className="">
      <div className="flex gap-8 text-[12px]  text-gray-600 lg:px-[50px] px-5 pb-3 cursor-pointer">
        <Breadcrumb className="text-[12px]">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Room</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Course</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Quiz</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Path</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Room</BreadcrumbPage>
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
        <h1>Sort</h1>
      </div>
      <div className="lg:px-[50px] px-5 py-3 w-full">
        <div className="flex gap-5 items-center w-full">
          <>
            <span className="flex items-center gap-1 text-[12px] font-bold">
              {data?.length} <span className="font-bold">rooms</span>
            </span>
          </>
          <Separator orientation="vertical" className=" h-7" />
          <label className="flex gap-2 items-center w-full">
            <Search className="text-gray-500" size={14} />
            <input
              type="search"
              placeholder="Search..."
              className="border-none outline-none w-full text-[13px]"
            />
          </label>
        </div>
      </div>

      <div className="lg:px-[50px] px-5 py-3 w-full">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          {data?.map((content) => (
           <RoomCard content={content} key={content.id}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
