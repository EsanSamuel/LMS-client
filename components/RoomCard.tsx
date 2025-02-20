import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Book, Bookmark, BookmarkPlus } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

interface ContentRoomProps {
  content: {
    roomImage: string | null;
    coverImage: string | null;
    roomName: string;
    roomDescription: string | null;
    category: string | null;
    status: string;
    id: string;
    createdAt: Date;
    userId: string;
    userIds: string[];
    Module: any;
  };
}

interface IBookmark {
  id: string;
  userId: string;
  roomId: string;
  bookMarkedAt: Date;
  user: {
    id: string;
    clerkId: string;
  };
}

const RoomCard = ({ content }: ContentRoomProps) => {
  const { userId } = useAuth();
  const router = useRouter();
  const [base64Image, setBase64Image] = useState("");
  const handleClick = () => {
    router.push(`/Room/${content.id}`);
  };

  const mutation = useMutation<void, Error>({
    mutationFn: () => {
      return axios.post(
        `http://localhost:8080/v1/save-room/${userId}/${content.id}`
      );
    },
    onSuccess: () => {
      console.log("Room created successfully!");
      toast.success("Room boolmarked successfully!");
      router.push("/");
    },
  });

  const handleBookmark = async () => {
    try {
      mutation.mutate();
    } catch (error) {
      console.log(error);
    }
  };

  async function fetchBookmarks(): Promise<IBookmark[]> {
    const response = await axios.get(
      `http://localhost:8080/v1/get-saved-room/${content.id}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const {
    data: bookmarks,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`bookmark:${content.id}`],
    queryFn: fetchBookmarks,
  });

  const hasBookmarked = useMemo(() => {
    const bookmark = bookmarks?.map((data) => data.user.clerkId);
    return bookmark?.includes(userId as any);
  }, [userId, bookmarks]);

  const unBookmark = async () => {
    try {
      await axios.delete(`http://localhost:8080/v1/get-bookmark/${content.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card
      className=" flex flex-col gap-[-10px] rounded-[10px]"
      key={content.id}
      //onClick={handleClick}
    >
      {content?.roomImage ? (
        <Image
          src={content?.roomImage || "/file.svg"}
          alt="room image"
          width={500}
          height={500}
          className="rounded-t-[10px] lg:h-[150px] h-[200px]"
          onClick={handleClick}
        />
      ) : null}
      <div className="p-1">
        <CardHeader>
          <CardTitle className="text-[18px] text-gray-600">
            {content.roomName}
          </CardTitle>
          {/*<CardDescription>
          {content.roomDescription?.slice(0, 60) + "..."}
        </CardDescription>*/}
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div className="flex gap-2">
            <button className="bg-gray-200 rounded-full text-gray-500 py-1 px-3">
              {" "}
              <p className="text-[12px]">{content.category}</p>
            </button>
            <button
              className="text-[#83a4e4] bg-[#e9effa]  rounded-full 
          py-1 px-2 flex gap-2 items-center text-[12px] font-bold"
            >
              {" "}
              <Book size={12} />
              {content?.Module?.length}{" "}
              {content?.Module?.length > 1 ? "Modules" : "Module"}
            </button>
          </div>
          {!hasBookmarked ? (
            <Bookmark
              size={15}
              className="cursor-pointer"
              onClick={handleBookmark}
            />
          ) : (
            <BookmarkPlus
              size={15}
              className="cursor-pointer text-[#8c6dfd]"
              onClick={unBookmark}
            />
          )}
        </CardContent>
        <CardFooter>
          <p className="text-[12px] text-gray-500">
            {formatDistanceToNow(new Date(content.createdAt), {
              addSuffix: true,
            })}
          </p>
        </CardFooter>
      </div>
    </Card>
  );
};

export default RoomCard;
