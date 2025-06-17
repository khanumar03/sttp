"use server";

import { db } from "@/lib/db";

export const createUser = async (username: string) => {
  const response = await db.user.create({
    data: { username: username.trim() },
  });

  if (!response) return { error: "something went wrong" };

  return { message: "User created successfully", user: response };
};
