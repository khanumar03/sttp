"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Blocks } from "lucide-react";
import { socket } from "@/lib/utils";
import { get, signOut } from "@/actions/user";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [newBlockName, setNewBlockName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");

  const router = useRouter()

  useEffect(() => {
    async function f() {
      const username = await get()
      if(username.message) setCurrentUsername(username.message.data.username)
    }
    f()
  }, [currentUsername]);

  useEffect(() => {
    socket.on("error", (data) => {
      setIsCreating(false);
      alert(data.message)
    });

    socket.on("block:created", (data) => {
      setIsCreating(false);
      setNewBlockName("");
      alert(data.id);
    });

    return () => {
      socket.off("error");
      socket.off("block:created");
    };
  });

  const createBlock = () => {
    if (!newBlockName.trim()) return;
    setIsCreating(true);

    socket.emit("block:create", {
      name: newBlockName,
      username: currentUsername,
    });
  };

  const _signOut = async () => {
    await signOut()
    return router.replace('/join')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Blocks className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">BlockChain</h1>
                  <p className="text-sm text-gray-400">
                    Decentralized Community Platform
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {currentUsername && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span onClick={_signOut} className="text-white text-sm cursor-pointer">
                      Welcome, {currentUsername}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            {/* Blockchain Animation */}
            <motion.div
              className="flex justify-center items-center space-x-4 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-16 h-16 bg-gradient-to-r ${
                    i === 0
                      ? "from-blue-500 to-purple-600"
                      : i === 1
                      ? "from-green-500 to-teal-600"
                      : i === 2
                      ? "from-orange-500 to-red-600"
                      : i === 3
                      ? "from-pink-500 to-rose-600"
                      : "from-indigo-500 to-blue-600"
                  } rounded-lg flex items-center justify-center text-white font-bold`}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotateY: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                >
                  {i + 1}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Create Block Section */}
        <section className="py-12 border-y border-white/10">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-white">Create New Block</CardTitle>
                  <CardDescription className="text-gray-400">
                    Start your own community block
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Enter block name..."
                    value={newBlockName}
                    onChange={(e) => setNewBlockName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    onKeyPress={(e) => e.key === "Enter" && createBlock()}
                  />
                  <Button
                    onClick={createBlock}
                    disabled={!newBlockName.trim() || isCreating}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {isCreating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Blocks className="h-4 w-4 mr-2" />
                        Create Block
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Blocks Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Available Blocks
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">
              © 2024 BlockChain Platform. Decentralized. Secure. Connected.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
