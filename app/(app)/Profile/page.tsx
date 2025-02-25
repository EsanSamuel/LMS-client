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

const page = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [uniqueName, setUniqueName] = useState("");
  const [previewImage, setPreviewImage] = useState("");

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

  const handleImageChange = (e: any) => {
    setProfileImage(e.target.files?.[0]);
  };

  const mutation = useMutation<void, Error, any>({
    mutationFn: (data: any) => {
      return axios.patch(`http://localhost:8080/v1/editUser/${userId}`, data);
    },
    onSuccess: () => {
      toast.success("Profile edited!");
    },
  });

  useEffect(() => {
    const updateValue = () => {
      setUsername(data?.username!);
      setUniqueName(data?.uniqueName!);
      setBio(data?.bio!);
    };
    updateValue();
  }, [data]);

  useEffect(() => {
    if (profileImage) {
      const url = URL.createObjectURL(profileImage as any);
      setPreviewImage(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [profileImage]);

  const handleEdit = () => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("uniqueName", uniqueName);
      mutation.mutate(formData);
      console.log(data);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const image_mutation = useMutation<void, Error, any>({
    mutationFn: (data: any) => {
      return axios.patch(`http://localhost:8080/v1/editImage/${userId}`, data);
    },
    onSuccess: () => {
      toast.success("Profile Image edited!");
    },
  });

  const updateImage = () => {
    try {
      const formData = new FormData();
      formData.append("profileImage", profileImage);
      image_mutation.mutate(formData);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-none">
                <Edit className="text-gray-600" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile Image</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
                {previewImage && (
                  <div className="flex justify-center items-center my-2">
                    <Image
                      src={previewImage}
                      alt="profileImage"
                      width={500}
                      height={500}
                      className="w-[150px] h-[150px] rounded-full object-contain"
                    />
                  </div>
                )}
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Image
                  </Label>
                  <Input
                    id="name"
                    type="file"
                    className="col-span-3"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-[#8c6dfd] "
                  onClick={updateImage}
                  disabled={image_mutation.isPending}
                >
                  {image_mutation.isPending ? "Editing..." : " Save changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#8c6dfd] hover:bg-[#8c6dfd] hover:text-white hover:opacity-50 text-white"
              >
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={username}
                    className="col-span-3"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={uniqueName}
                    className="col-span-3"
                    onChange={(e) => setUniqueName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Bio
                  </Label>
                  <Input
                    id="username"
                    value={bio}
                    className="col-span-3"
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-[#8c6dfd] "
                  onClick={handleEdit}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Editing..." : " Save changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-[13px] lg:hidden block">{data?.bio}</p>
      </div>
      <Separator className="my-5" />
      <div className="">
        <h1 className="pb-5 text-gray-600 text-[13px] font-bold">Your Rooms</h1>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
          {data?.CourseRoom?.map((content: any) => (
            <RoomCard content={content} key={content.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
