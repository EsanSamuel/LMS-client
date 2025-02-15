"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Book,
  BookOpen,
  Gamepad,
  Home,
  Library,
  Package,
  Plus,
  SquareLibrary,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";

//text-[#c651cd]
//text-[#39e75f]
//text-[#8a2eff]
//text-[#83a4e4]

const contents = [
  {
    id: 1,
    title: "Room",
    color: "bg-[#c651cd]",
    icon: Library,
    description: "Create a room to upload courses or learning materials.",
    link: "/create-room",
  },
  {
    id: 2,
    title: "Course",
    color: "bg-[#39e75f]",
    icon: BookOpen,
    description: "Create a course in an existing learning room.",
    link: "/create-course",
  },
  {
    id: 3,
    title: "Quiz",
    color: "bg-[#eb4174]",
    icon: Gamepad,
    description: "Create a quiz in an existing learning room to test learners.",
    link: "/create-course",
  },
  {
    id: 4,
    title: "Room",
    color: "bg-[#83a4e4]",
    icon: Library,
    description: "Create a room to upload courses or learning materials.",
    link: "/create-course",
  },
];
const Navbar = () => {
  const [path, setPath] = useState("");
  const pathname = usePathname();
  useEffect(() => {
    const getPathname = () => {
      if (pathname !== "/") {
        if (pathname.includes("/")) {
          const [, params] = pathname.split("/");
          const [pathName] = params.split("/");
          setPath(pathName);
        } else {
          setPath(pathname);
        }
      } else {
        setPath("Home");
      }
    };
    getPathname();
  }, [pathname]);

  const showIcon = () => {
    if (path === "Home") {
      return (
        <div className="bg-[#eb4174] rounded-[5px] p-2 items-center">
          <Home size={14} color="#fff" />
        </div>
      );
    } else if (path === "Room") {
      return (
        <div className="bg-[#39e75f] rounded-[5px] p-2 items-center">
          <Package size={14} color="#fff" />
        </div>
      );
    } else if (path === "Courses") {
      return (
        <div className="bg-[#ec5fc4] rounded-[5px] p-2 items-center">
          <SquareLibrary size={14} color="#fff" />
        </div>
      );
    }else if (path === "Content") {
      return (
        <div className="bg-[#ebe243] rounded-[5px] p-2 items-center">
          <Book size={14} color="#fff" />
        </div>
      );
    }
  };

  return (
    <div className="w-[100%] flex justify-between items-center p-4">
      <div className="flex gap-2 items-center">
        {showIcon()}
        <span className="font-bold">{path}</span>
      </div>

      {path === "Home" && (
        <Dialog>
          <DialogTrigger className="bg-[#8c6dfd] flex gap-1 font-bold items-center text-white py-2 px-4 rounded-md text-[14px]">
            <Plus className="font-bold" size={15} />
            New Content
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="pb-2">Create new content</DialogTitle>
              <Separator className="" />
              <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-3 w-full pt-5">
                {contents.map((content) => (
                  <Link
                    key={content.id}
                    className="border-gray-200 border rounded-md flex flex-col gap-2 p-4 shadow-sm cursor-pointer"
                    href={content.link}
                  >
                    <div className="flex gap-2 items-center">
                      <div className={`${content.color} rounded-sm h-auto p-1`}>
                        <content.icon className="text-white" size={17} />
                      </div>
                      <span className="text-[14px]">{content.title}</span>
                    </div>
                    <h1 className="text-[12px]">{content.description}</h1>
                  </Link>
                ))}
              </div>
            </DialogHeader>
            <Separator className="" />
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="font-light bg-white border border-gray-200"
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Navbar;
