"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { CSSProperties, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

interface IUsers {
  id: string;
  username: string;
  email: string;
  profileImage: string;
}

const page = () => {
  const router = useRouter();
  const [searchRooms, setSearchRooms] = useState("");
  async function fetchUsers(): Promise<IUsers[]> {
    const response = await axios.get(`http://localhost:8080/v1/getUsers`);
    console.log(response.data.data);
    return response.data.data;
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filterRooms = () => {
    if (!searchRooms.trim()) return data;

    const searchTerm = searchRooms.trim().toLowerCase();

    const matchSearch = (user: any) => {
      return [
        user.username.toLowerCase(),
        user.uniqueName.toLowerCase(),
        user.email.toLowerCase(),
      ].some((field) => field.includes(searchTerm));
    };

    return (data as any[]).filter(matchSearch);
  };

  const handleClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="lg:px-10 px-5 pt-10">
      <div className="w-full">
        <Input
          className=""
          placeholder="Search Users"
          onChange={(e) => setSearchRooms(e.target.value)}
        />
        <h1 className="font-bold text-gray-600 text-[15px] pt-5">Users</h1>
        <div className="grid lg:grid-cols-4 grid-cols-1 mt-5 gap-5">
          {filterRooms()?.map((user) => (
            <div className="border-[1px] flex flex-col gap-4 justify-center items-center p-5 rounded-lg">
              <Image
                src={user?.profileImage || "/avatar.png"}
                alt="profileImage"
                width={500}
                height={500}
                className="w-[150px] h-[150px] rounded-md object-contain"
              />
              <div>
                <h1 className="font-bold text-gray-600 text-[15px]">
                  {user.username}
                </h1>
              </div>
              <Button
                className="bg-[#8c6dfd] w-full"
                onClick={() => handleClick(user.clerkId)}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center">
          <BeatLoader
            color="#8c6dfd"
            loading={isLoading}
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
