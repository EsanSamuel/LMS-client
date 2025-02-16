"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Eye, Grid2x2, ImageIcon, Library } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateRoomPayload {
  clerkId: string;
  roomName: string;
  status: string;
  roomDescription: string;
  category: string;
  roomImage?: File | null;
}

const page = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [form, setForm] = React.useState({
    roomName: "",
    roomDescription: "",
    roomStatus: "",
    roomCategory: "",
  });
  const [roomImage, setRoomImage] = React.useState<File | null>();
  const [previewImage, setPreviewImage] = React.useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const handleFile = (e: any) => {
    const files = e.target.files?.[0];
    setRoomImage(files as File);
  };

  useEffect(() => {
    const previewImage = () => {
      if (roomImage) {
        const url = URL.createObjectURL(roomImage as any);
        setPreviewImage(url);
        return () => {
          url && URL.revokeObjectURL(url);
        };
      }
    };
    previewImage();
  }, [roomImage]);

  const mutation = useMutation<void, Error, CreateRoomPayload>({
    mutationFn: (data: CreateRoomPayload) => {
      return axios.post("http://localhost:8080/v1/createRoom", data);
    },
    onSuccess: () => {
      console.log("Room created successfully!");
      toast.success("Room created successfully!");
      router.push("/");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!form.roomName || !category) {
        console.error("Please fill in required fields");
        return;
      }
      const formData = new FormData();
      formData.append("clerkId", userId || ""); // Ensure string value
      formData.append("roomName", form.roomName);
      formData.append("status", status);
      formData.append("roomDescription", form.roomDescription);
      formData.append("category", category);

      if (roomImage) {
        formData.append("roomImage", roomImage);
      }

      mutation.mutate(formData as any);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <header className="flex justify-between items-center p-4 fixed w-full nav border-b">
        <div className="flex gap-2 items-center">
          <div className="bg-[#eb4174] rounded-[5px] p-2 items-center">
            <Library size={14} color="#fff" />
          </div>
          <span className="font-bold text-gray-600">Create learning room</span>
        </div>
        <Button>Continue</Button>
      </header>
      <Separator />
      <form className="lg:px-[20%] md:px-[10%] px-5 lg:py-20 py-20">
        {!roomImage ? (
          <div className="bg-red-400 rounded-md w-full h-[300px] p-10">
            <div className="justify-end flex">
              <label htmlFor="file-upload" className="cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFile}
                />
                <Button
                  asChild // Ensures full button acts like the label
                  className="flex gap-2 bg-white shadow-md rounded-full py-1 px-3 text-black bottom-3 justify-end hover:bg-gray-100 mt-[200px]"
                >
                  <span>
                    {" "}
                    {/* Wrapping content ensures full button triggers file picker */}
                    <ImageIcon />
                    Update Thumbnail
                  </span>
                </Button>
              </label>
            </div>
          </div>
        ) : (
          <div>
            <Image
              src={previewImage || ""}
              alt="roomImage"
              width={1000}
              height={1000}
              className="rounded-md w-full h-[300px]"
            />
          </div>
        )}
        <div className="mt-10 w-full">
          <input
            className="font-bold lg:text-[30px] text-[25px] text-gray-600 w-full outline-none"
            placeholder="What is the name of this room?"
            type="text"
            onChange={(e) => setForm({ ...form, roomName: e.target.value })}
          />
          <div className="lg:w-[400px] w-full">
            <div className="mt-5 flex items-center justify-between">
              <h1 className="text-gray-500 text-[16px] flex gap-2 items-center pb-2">
                <Eye className="text-gray-400" /> Visibility
              </h1>
              <Select onValueChange={setStatus} value={status}>
                <SelectTrigger className="w-[180px] flex gap-0 items-center">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public" className="text-gray-400">
                    Public
                  </SelectItem>
                  <SelectItem value="private" className="text-gray-400">
                    Private
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <h1 className="text-gray-500 text-[16px] flex gap-2 items-center pb-2">
                <Grid2x2 className="text-gray-400" /> Category
              </h1>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px] flex gap-0 items-center">
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tech" className="text-gray-400">
                    Tech
                  </SelectItem>
                  <SelectItem value="Others" className="text-gray-400">
                    Others
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <textarea
            placeholder="Description of room?"
            className="w-full h-auto outline-none mt-10 border-b border-gray-200 "
            onChange={(e) =>
              setForm({ ...form, roomDescription: e.target.value })
            }
          ></textarea>

          <div className="justify-end flex mt-5 ">
            <Button className="rounded-full" onClick={handleSubmit}>
              Create Room
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default page;
