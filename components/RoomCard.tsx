import React from "react";
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
  };
}

const RoomCard = ({ content }: ContentRoomProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/Room/${content.id}`);
  };
  return (
    <Card
      className="p-2 flex flex-col gap-[-10px] rounded-[24px]"
      key={content.id}
      onClick={handleClick}
    >
      {content?.roomImage ? (
        <Image
          src={content?.roomImage || "/file.svg"}
          alt="room image"
          width={500}
          height={500}
          className="rounded-[18px] h-[150px]"
        />
      ) : null}
      <CardHeader>
        <CardTitle className="text-[18px]">{content.roomName}</CardTitle>
        <CardDescription>
          {content.roomDescription?.slice(0, 60) + "..."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <button className="bg-gray-200 rounded-full text-gray-500 py-1 px-3">
          {" "}
          <p className="text-[12px]">{content.category}</p>
        </button>
      </CardContent>
      <CardFooter>
        <p className="text-[12px] text-gray-500">
          {formatDistanceToNow(new Date(content.createdAt), {
            addSuffix: true,
          })}
        </p>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
