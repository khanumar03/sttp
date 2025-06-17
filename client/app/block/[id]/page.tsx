"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, Users, LogOut, Blocks } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Block } from "@prisma/client";
import { get } from "@/actions/block";
import { socket } from "@/lib/utils";

export default function BlockPage() {
  const params = useParams();
  const blockId = params.id as string;

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [block, setBlock] = useState<Block | undefined>(undefined);

  useEffect(() => {
    async function fetchBlock() {
      const respones = await get(blockId);
      
      if (respones.error) {
        alert(respones.error);
        return;
      }

      setBlock(respones.message);
    }

    fetchBlock();
  }, [blockId]);

  console.log(block);
  

  useEffect(() => {
    socket.emit("user:join", { name: "dev3" });

  }, []);

  useEffect(() => {
    socket.on("block:user:joined", (data) => {
      alert(`${data.username} has joined the block`);
    });

    socket.on("block:msg", (data) => {
      alert(`New transaction in block ${data.id}: ${data.transaction}`);
    });

    return () => {
      socket.off("block:user:joined");
      socket.off("block:msg");
    };
  });

  //   useEffect(() => {
  //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  //   }, [])

  const sendMessage = () => {
    if (!message.trim()) return;
    console.log(block?.eventName);
    

    socket.emit("block:transaction", {
      name: block?.eventName,
      transaction: message.trim(),
    });

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div
                className={`w-10 h-10 bg-gradient-to-r bg-purple-500 rounded-lg flex items-center justify-center`}
              >
                <Blocks className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {block?.eventName}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />1
                  </span>
                </div>
              </div>
            </div>
            <Button
              //   onClick={leaveBlock}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Leave Block
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Online Users Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-white text-sm">
                  Online Users
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <AnimatePresence></AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-[calc(100vh-200px)] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence></AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-white/10 p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className={`bg-gradient-to-r bg-purple-500 hover:opacity-90`}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
