"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Bookmark,
  BookOpen,
  BrainCircuit,
  ChartArea,
  Home,
  Inbox,
  Mail,
  Search,
  Settings,
  SquarePlus,
  User2,
} from "lucide-react";
import { Separator } from "./ui/separator";
import axios from "axios";
import { auth } from "@clerk/nextjs/server";
import { useQuery } from "@tanstack/react-query";
import { SignIn, SignInButton, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import Image from "next/image";

interface User {
  username: string;
  profileImage: string;
}

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "My courses",
    url: "/MyCourses",
    icon: BookOpen,
  },
  {
    title: "Explore courses",
    url: "#",
    icon: Search,
  },
  {
    title: "Saved Courses",
    url: "/Bookmarks",
    icon: Bookmark,
  },
];

const items2 = [
  {
    title: "Create",
    url: "#",
    icon: SquarePlus,
  },
  {
    title: "Message",
    url: "#",
    icon: Mail,
  },
];
export function AppSidebar() {
  const { userId } = useAuth();

  async function fetchUser(): Promise<User | null> {
    if (!userId) return null;
    const response = await axios.get(
      `http://localhost:8080/v1/getUser/${userId}`
    );
    console.log(response.data.data, userId);
    return response.data.data;
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: !!userId,
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#8c6dfd] text-sidebar-primary-foreground">
            <BrainCircuit
              className="font-bold text-white text-center"
              size={17}
            />
          </div>

          <span className=" font-bold">LMS System</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-screen justify-between">
        {/* Top Sections */}
        <div>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem className="" key={item.title}>
                    <SidebarMenuButton asChild className="text-[13px]">
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator className="mt-2" />

          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items2.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="text-[13px]">
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Bottom Section (Account) */}
        <div className="mt-auto">
          <Separator className="mb-2" />
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="text-[13px]">
                    <a href="#">
                      <Settings />

                      <span>Settings</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/*User profile*/}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="text-[13px]">
                    {userId ? (
                      <a href="#">
                        <Image
                          src={data?.profileImage!}
                          alt="profileimage"
                          width={25}
                          height={25}
                          className="rounded-[2px]"
                        />

                        <span>{data?.username}</span>
                      </a>
                    ) : (
                      <SignInButton />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
