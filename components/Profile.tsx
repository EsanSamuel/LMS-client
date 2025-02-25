"use client";
import RoomCard from "@/components/RoomCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  username: string;
  profileImage: string | null;
  uniqueName: string;
  email: string;
  bio?: string;
  CourseRoom?: {
    id: string;
    roomName: string;
    roomDescription: string;
    category: string;
    status: string;
    createdAt: string;
    userId: string;
    userIds: string[];
  }[];
}

const Profile = ({ userId }: { userId: string }) => {
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

  return (
    <div className="lg:p-10 p-5">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {data?.profileImage && (
            <Image
              src={data?.profileImage!}
              alt="profileImage"
              width={500}
              height={500}
              className="w-[150px] h-[150px] rounded-md"
            />
          )}
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-gray-600 font-bold text-[17px]">
              {data?.username}{" "}
              <span className="text-[13px]">@{data?.uniqueName}</span>
            </p>
            <p className="text-[13px]">{data?.email}</p>
            <p className="text-[13px] lg:block hidden mt-3">{data?.bio}</p>
          </div>
        </div>
        <p className="text-[13px] lg:hidden block">{data?.bio}</p>
      </div>
      <Separator className="my-5" />
      <div className="">
        <h1 className="pb-5 text-gray-600 text-[13px] font-bold">{data?.username}'s Rooms</h1>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
          {data?.CourseRoom?.map((content: any) => (
            <RoomCard content={content} key={content.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
