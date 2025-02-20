"use client";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo } from "react";

interface User {
  username: string;
  profileImage: string;
}

const page = () => {
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
    queryKey: [`user:${userId}`],
    queryFn: fetchUser,
    enabled: !!userId,
  });

  const getFirstName = useMemo(() => {
    if (data?.username.includes(" ")) {
      const [firstName, lastName] = data?.username.split(" ");
      return firstName;
    } else {
      return data?.username;
    }
  }, [data?.username]);

  const getDay = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  }, []);
  return (
    <div className="px-[50px] py-10">
      <h1 className="font-bold text-[24px] text-gray-600">
        Good {getDay}, {getFirstName} 👋
      </h1>
    </div>
  );
};

export default page;
