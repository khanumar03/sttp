"use server";
import { db } from "@/lib/db"

export const get = async (id: string) => {
    const response = await db.block.findUnique({
        where: { id },
    });
    if (!response) return { error: "Block not found" };
    return { message: response };
}