import { clsx, type ClassValue } from "clsx"
import io from "socket.io-client"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const socket: SocketIOClient.Socket = io(process.env.SERVER_URL as string)
