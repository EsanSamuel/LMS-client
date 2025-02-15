import { auth, clerkClient } from "@clerk/nextjs/server";
import axios from "axios";
import { notFound, redirect } from "next/navigation";
import React from "react";

const syncuser = async () => {
  const { userId } = await auth();
  console.log(userId);
  if (!userId) {
    throw new Error("User not found!");
  }
  const clerkclient = await clerkClient();
  const user = await clerkclient.users.getUser(userId);
  if (!user.emailAddresses[0].emailAddress) {
    return notFound();
  }

  const data = {
    username : user.fullName,
    email: user.emailAddresses[0].emailAddress,
    clerkId: userId,
    profileImage: user.imageUrl,
  };
  console.log(data);

  await axios.post("http://localhost:8080/v1/create-user", data);
  return redirect("/");
};

export default syncuser;
