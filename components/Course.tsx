"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { CSSProperties, useEffect, useState } from "react";
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
import { Button } from "./ui/button";
import {
  Eye,
  FileText,
  ImageIcon,
  Plus,
  SquareLibrary,
  Trash2,
} from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";
import { Separator } from "@radix-ui/react-separator";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import BeatLoader from "react-spinners/BeatLoader";
import CourseCard from "./CourseCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

interface IModule {
  userId: string;
  roomId: string;
  title: string;
  position: number;
  description: string | null;
  id: string;
  createdAt: Date;
  creator: {
    clerkId: string;
  };
}

interface CreateCoursePayload {
  userId: string;
  title: string;
  status: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  thumbnailUrl: string;
  textContent: string | null;
  videoUrls?: File[];
  imageUrls: File[];
  pdf: File[];
  isDiscussion: boolean;
  courseRoomId: string | null;
}

const Course = ({ moduleId }: { moduleId: string }) => {
  const { userId } = useAuth();
  const router = useRouter();
  const [form, setForm] = React.useState({
    title: "",
    textContent: "",
    thumbnailUrl: "",
  });
  const [status, setStatus] = React.useState("");
  const [isDiscussion, setIsDiscussion] = React.useState(true);
  const [imageUrls, setImageUrls] = React.useState<File[]>([]);
  const [videoUrls, setVideoUrls] = React.useState<File[]>([]);
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([""]);
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [videosMB, setVideosMB] = useState(0);
  const [imagesMB, setImagesMB] = useState(0);
  const [pdfsMB, setPDFsMB] = useState(0);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  async function fetchModule(): Promise<IModule> {
    const response = await axios.get(
      `http://localhost:8080/v1/get-module/${moduleId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["module"],
    queryFn: fetchModule,
  });

  useEffect(() => {
    const isAuthorized = async () => {
      const response = await axios.post(
        `http://localhost:8080/v1/authorize-role/${userId}/${data?.roomId}`
      );
      console.log(response.data.authorized);
      setIsAuthorized(response.data.authorized);
    };
    isAuthorized();
  }, [userId, data?.roomId]);

  const handleFile = (e: any) => {
    const files = e.target.files?.[0];
    setForm({ ...form, thumbnailUrl: files });
  };

  const handleImages = (e: any) => {
    const files = e.target.files;
    const imageArray = Array.from(files);
    setImageUrls(imageArray as File[]);
    console.log(files);
    let imageSize = 0;
    for (const file of files) {
      setImagesMB((imageSize += file.size));
    }
  };

  const handleVideos = (e: any) => {
    const files = e.target.files;
    const videoArray = Array.from(files);
    setVideoUrls(videoArray as File[]);
    console.log(files);
    let videoSize = 0;
    for (const file of files) {
      setVideosMB((videoSize += file.size));
    }
  };

  const handlePdf = (e: any) => {
    const files = e.target.files;
    const pdfArray = Array.from(files);
    setPdfs(pdfArray as File[]);
    console.log(files);
    let pdfSize = 0;
    for (const file of files) {
      setPDFsMB((pdfSize += file.size));
    }
  };

  useEffect(() => {
    const previewImage = () => {
      if (form.thumbnailUrl) {
        const url = URL.createObjectURL(form.thumbnailUrl as any);
        setPreviewThumbnail(url);
        return () => {
          url && URL.revokeObjectURL(url);
        };
      }
    };
    previewImage();
  }, [form.thumbnailUrl]);

  useEffect(() => {
    const previewImageUrls = () => {
      if (imageUrls) {
        const urls = imageUrls.map((image) =>
          URL.createObjectURL(image as any)
        );
        setPreviewImages(urls as any);
      }
    };
    previewImageUrls();
  }, [imageUrls]);

  const mutation = useMutation<void, Error, CreateCoursePayload>({
    mutationFn: (data: CreateCoursePayload) => {
      return axios.post("http://localhost:8080/v1/create-course", data);
    },
    onSuccess: () => {
      console.log("course created successfully!");
      toast.success("course created successfully!");
    },
  });

  const handleLinkChange = (linkId: number, value: string) => {
    const updatedLink = [...links];
    updatedLink[linkId] = value;
    setLinks(updatedLink);
    console.log(updatedLink);
  };

  const addLinkInput = () => {
    const updatedLink = [...links];
    updatedLink.push("");
    setLinks(updatedLink);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!form.title) {
        console.error("Please fill in required fields");
        return;
      }
      const formData = new FormData();
      formData.append("userId", userId || "");
      formData.append("moduleId", moduleId || ""); // Ensure string value
      formData.append("title", form.title);
      formData.append("status", status);
      formData.append("textContent", form.textContent);
      formData.append("isDiscussion", isDiscussion.toString());

      if (links) {
        links.forEach((link) => formData.append("links", link));
      }

      if (form.thumbnailUrl) {
        formData.append("thumbnailUrl", form.thumbnailUrl);
      }
      if (imageUrls) {
        imageUrls.forEach((image) => formData.append("imageUrls", image));
      }
      if (videoUrls) {
        videoUrls.forEach((video) => formData.append("videoUrls", video));
      }
      if (pdfs) {
        pdfs.forEach((pdf) => formData.append("pdfUrls", pdf));
      }
      mutation.mutate(formData as any);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  async function fetchCourses(): Promise<CreateCoursePayload[]> {
    const response = await axios.get(
      `http://localhost:8080/v1/getCourses/${moduleId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const {
    data: courses,
    error: coursesError,
    isLoading: loadingCourses,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const isAuthor = () => {
    if (data?.creator?.clerkId === userId) {
      return true;
    } else {
      return false;
    }
  };

  const delete_mutation = useMutation<void, Error>({
    mutationFn: () => {
      return axios.delete(`http://localhost:8080/v1/delete-module/${data?.id}`);
    },
    onSuccess: () => {
      console.log("Module deleted!");
      toast.success("Module deleted!");
    },
  });

  const handleDelete = async () => {
    try {
      delete_mutation.mutate();
      router.push(`/room/${data?.roomId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full lg:px-20 md:px-10 px-5 mt-5">
      <div className="flex justify-between lg:flex-row md:flex-row flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-[25px] text-gray-600">{data?.title}</h1>
          <p className="text-[13px] text-gray-600">{data?.description}</p>
        </div>

        {(isAuthor() === true || isAuthorized) && (
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-[#8c6dfd] flex gap-1 font-bold items-center text-white rounded-md text-[14px]">
                <Plus className="font-bold" size={15} />
                Create course
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Add course Chapter</SheetTitle>
                <SheetDescription className="text-[13px]"></SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {!form.thumbnailUrl ? (
                  <div className="bg-red-400 rounded-md w-full h-[200px] p-10">
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
                          className="flex gap-2 bg-white shadow-md rounded-full py-1 px-3 text-black bottom-3 justify-end hover:bg-gray-100 mt-[100px]"
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
                      src={previewThumbnail || ""}
                      alt="thumbnailImage"
                      width={1000}
                      height={1000}
                      className="rounded-md w-full h-[200px]"
                    />
                  </div>
                )}
                <div className="text-start flex flex-col  gap-2">
                  <Label htmlFor="name" className="text-left text-gray-600">
                    Course title
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3 text-[13px]"
                    placeholder="Module name"
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
                <div className="text-start flex flex-col  gap-2">
                  <Label
                    htmlFor="description"
                    className="text-left text-gray-600"
                  >
                    Course description
                  </Label>
                  <Input
                    id="username"
                    className="col-span-3 text-[13px]"
                    placeholder="Module description..."
                    onChange={(e) =>
                      setForm({ ...form, textContent: e.target.value })
                    }
                  />
                </div>
                <div className="text-start flex flex-col  gap-2">
                  <Label
                    htmlFor="description"
                    className="flex justify-between items-center gap-2 text-left text-gray-600"
                  >
                    Upload images
                    <>
                      {" "}
                      <span className="text-[13px]">
                        {(imagesMB / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </>
                  </Label>
                  <Input
                    id="username"
                    className="col-span-3 text-[13px]"
                    placeholder="Module description..."
                    onChange={handleImages}
                    type="file"
                    multiple
                  />
                  {previewImages && (
                    <div className="grid grid-cols-2 gap-2">
                      {previewImages.map((image, index) => (
                        <div key={index}>
                          <Image
                            src={image}
                            alt="image"
                            width={300}
                            height={300}
                            className="rounded-[10px] h-[80px]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-start flex flex-col  gap-2">
                  <Label
                    htmlFor="description"
                    className="flex justify-between items-center gap-2 text-left text-gray-600"
                  >
                    Upload videos
                    <>
                      {" "}
                      <span className="text-[13px]">
                        {(videosMB / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </>
                  </Label>
                  <Input
                    id="username"
                    className="col-span-3 text-[13px]"
                    placeholder="Module description..."
                    onChange={handleVideos}
                    type="file"
                    multiple
                  />
                </div>

                <div className="text-start flex flex-col  gap-2">
                  <Label
                    htmlFor="description"
                    className="flex justify-between items-center gap-2 text-left text-gray-600"
                  >
                    Upload PDFs
                    <>
                      {" "}
                      <span className="text-[13px]">
                        {(pdfsMB / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </>
                  </Label>
                  <Input
                    id="username"
                    className="col-span-3 text-[13px]"
                    placeholder="Module description..."
                    onChange={handlePdf}
                    type="file"
                    multiple
                  />
                </div>

                <div className="text-start flex flex-col  gap-2">
                  <Label
                    htmlFor="description"
                    className="flex justify-between items-center gap-2 text-left text-gray-600"
                  >
                    Add Links
                    <Plus className="text-[#8c6dfd]" onClick={addLinkInput} />
                  </Label>
                  {links.map((link, linkIndex) => (
                    <Input
                      key={linkIndex}
                      id="username"
                      className="col-span-3 text-[13px]"
                      placeholder="Module link..."
                      onChange={(e) =>
                        handleLinkChange(linkIndex, e.target.value)
                      }
                      type="text"
                      value={link}
                    />
                  ))}
                </div>

                <div className="flex gap-2 flex-col w-full">
                  <>
                    <Label className="text-gray-600">Visibility</Label>
                  </>
                  <Select onValueChange={setStatus} value={status}>
                    <SelectTrigger className="w-[180px] flex gap-0 items-center ext-[13px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem
                        value="public"
                        className="text-gray-400 ext-[13px]"
                      >
                        Public
                      </SelectItem>
                      <SelectItem
                        value="private"
                        className="text-gray-400 ext-[13px]"
                      >
                        Private
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-start flex justify-between  gap-2 mt-3">
                  <Label
                    htmlFor="description"
                    className="text-left text-gray-600"
                  >
                    Show comments
                  </Label>
                  <Switch
                    checked={isDiscussion}
                    onCheckedChange={(checked) => setIsDiscussion(checked)}
                  />
                </div>
              </div>

              <SheetFooter>
                <Separator />
                <SheetClose asChild>
                  <Button
                    type="submit"
                    // onClick={handleSubmit}
                    disabled={mutation.isPending}
                    onClick={handleSubmit}
                  >
                    {mutation.isPending ? "Creating..." : "Create"}
                  </Button>
                </SheetClose>
              </SheetFooter>
              <div className="mt-10 text-start flex flex-col  gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="submit"
                      className="w-full bg-red-400 hover:bg-red-500 flex gap-2 items-center"
                    >
                      <Trash2 />
                      {delete_mutation.isPending
                        ? "Deleting Module..."
                        : "Delete Module"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this room "{data?.title}" and remove the data
                        from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className=" bg-red-400 hover:bg-red-500"
                        onClick={handleDelete}
                        disabled={delete_mutation.isPending}
                      >
                        {delete_mutation.isPending ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </SheetContent>
            {/*Add room organizers */}
          </Sheet>
        )}
      </div>
      <div className="py-5">
        <h1 className="font-bold pb-3 text-gray-600">Courses</h1>
        <div className="flex flex-col gap-2">
          {!loadingCourses && (!courses || courses.length === 0) ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <SquareLibrary size={70} className="text-gray-600" />
              <h1 className="text-center text-gray-600 font-bold">
                No Courses
              </h1>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {courses?.map((course, index) => (
                <CourseCard course={course} index={index} />
              ))}
            </div>
          )}
        </div>
        {loadingCourses && (
          <div className="flex items-center justify-center h-full mt-20">
            <BeatLoader
              color="#8c6dfd"
              loading={loadingCourses}
              cssOverride={override}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
              className="justify-center"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;
