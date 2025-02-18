"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { FileText, Package, Plus, SquareLibrary } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ModuleCard from "./ModuleCard";

import { CSSProperties } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

interface roomProps {
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
}

interface CreateModulePayload {
  userId: string;
  roomId: string;
  title: string;
  position: number;
  description: string | null;
  id: string;
  createdAt: Date;
}

const Room = ({ roomId }: { roomId: string }) => {
  const { userId } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    moduleTitle: "",
    moduleDescription: "",
    modulePosition: 0,
  });
  async function fetchUser(): Promise<roomProps> {
    const response = await axios.get(
      `http://localhost:8080/v1/getRoom/${roomId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }
  async function fetchModules(): Promise<CreateModulePayload[]> {
    const response = await axios.get(
      `http://localhost:8080/v1/get-allmodules/${roomId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const { data, error, isLoading } = useQuery({
    queryKey: [`room:${roomId}`],
    queryFn: fetchUser,
  });
  const {
    data: modules,
    error: moduleError,
    isLoading: moduleLoading,
  } = useQuery({
    queryKey: [`modules:${roomId}`],
    queryFn: fetchModules,
  });

  const mutation = useMutation<void, Error, CreateModulePayload>({
    mutationFn: (data: CreateModulePayload) => {
      return axios.post("http://localhost:8080/v1/create-course-module", data);
    },
    onSuccess: () => {
      console.log("Room created successfully!");
      toast.success("Room created successfully!");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!form.moduleTitle) {
        console.error("Please fill in required fields");
        return;
      }
      const formData = new FormData();
      formData.append("userId", userId || ""); // Ensure string value
      formData.append("title", form.moduleTitle);
      formData.append("description", form.moduleDescription);
      formData.append("position", form.modulePosition.toString());
      formData.append("roomId", roomId);

      mutation.mutate({
        userId: userId,
        title: form.moduleTitle,
        description: form.moduleDescription,
        position: form.modulePosition,
        roomId: roomId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full lg:px-20 md:px-10 px-5 mt-5">
      <div className="flex justify-between lg:flex-row md:flex-row flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-[25px] text-gray-600">
            {data?.roomName}
          </h1>
          <p className="text-[13px] text-gray-600">
            Welcome to {data?.roomName} learning room.{" "}
          </p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-[#8c6dfd] flex gap-1 font-bold items-center text-white py-2 px-4 rounded-md text-[14px]">
              <Plus className="font-bold" size={15} />
              Add Course Module
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create course module</SheetTitle>
              <SheetDescription className="text-[13px]">
                Create a course module in {data?.roomName} for users to explore
                and learn courses available in the modules.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="text-start flex flex-col  gap-2">
                <Label htmlFor="name" className="text-left">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  placeholder="Module name"
                  onChange={(e) =>
                    setForm({ ...form, moduleTitle: e.target.value })
                  }
                />
              </div>
              <div className="text-start flex flex-col  gap-2">
                <Label htmlFor="description" className="text-left">
                  Description
                </Label>
                <Input
                  id="username"
                  className="col-span-3"
                  placeholder="Module description..."
                  onChange={(e) =>
                    setForm({ ...form, moduleDescription: e.target.value })
                  }
                />
              </div>
              <div className="text-start flex flex-col  gap-2">
                <Label htmlFor="position" className="text-left">
                  Position
                </Label>
                <Input
                  id="position"
                  type="number"
                  className="col-span-3"
                  placeholder="1"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      modulePosition: e.target.valueAsNumber as number,
                    })
                  }
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create"}
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
          {/*Add room organizers */}
        </Sheet>
      </div>
      <div className="lg:py-10 py-5">
        <h1 className="font-bold pb-3 text-gray-600">Modules</h1>
        <div className="flex flex-col gap-2">
          {!moduleLoading && (!modules || modules.length === 0) ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <Package size={70} className="text-gray-600" />
              <h1 className="text-center text-gray-600 font-bold">
                No Modules
              </h1>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {modules?.map((module) => (
                <ModuleCard module={module} />
              ))}
            </div>
          )}
        </div>
      </div>
      {moduleLoading && (
        <div className="flex items-center justify-center h-full mt-20">
          <BeatLoader
            color="#8c6dfd"
            loading={moduleLoading}
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

export default Room;
