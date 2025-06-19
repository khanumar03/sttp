"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";

export const create = async (username: string) => {
  let isUser = await db.user.findUnique({ where: { username: username } });

  if (!isUser) {
    isUser = await db.user.create({
      data: { username: username.trim() },
    });

    if (!isUser) return { error: "something went wrong" };
  }

  (await cookies()).set("username", isUser.username, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  return { message: "User created successfully", user: isUser };
};

export const signOut = async () => {
  (await cookies()).delete("username");

  return { message: "signOut successfully" };
};

export const get = async () => {
  const username = (await cookies()).get("username");
  const response = await db.user.findUnique({
    where: { username: username?.value },
  });

  if(!response) return {error: "something went wrong"}

  return { message: { data: response } };
};
