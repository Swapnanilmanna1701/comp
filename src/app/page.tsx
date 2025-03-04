/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import TextGradient from "@/components/textgradient"
import Preview from "@/components/preview"
import NavButton from "@/components/navlogo"
import { useChat, Message } from "ai/react";
import RefButton from "@/components/refbutton";

import CubeLoader from "@/components/cube";
import remarkGfm from "remark-gfm";
import {
  Play,
  Pause,
  X,
  
  SendHorizonal,
  Mic,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoLoader from "@/components/logoo";
import UserLoader from "@/components/user";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";
import {
  additionalSuggestions,
  creativeSuggestions,
  suggestions,
} from "@/lib/prompt";
import Image from "next/image";
import meta from "@/assets/Meta-ai-logo.png";
import { AutosizeTextarea } from "@/components/ui/textarea";
import bg from "@/assets/wap-bg.png";
import TextRotate from "@/components/magic/text-rotate";

export default function Chat() {
  const [imgUrl, setImgUrl] = useState<string | undefined>("");
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    append,
  } = useChat({
    maxSteps: 6,

    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "generateAIImage") {
        const { imgprompt } = toolCall.args as { imgprompt: string };

        const res = await fetch(
          "https://ai-image-api.workers.dev/img?model=flux-schnell&prompt=" +
            imgprompt
        );
        const imgResponse = await res.blob();
        const imgUrl = URL.createObjectURL(imgResponse);
        setImgUrl(imgUrl);
      }
    },
  });
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (recording) {
      startRecording();
    } else {
      stopRecording();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recording]);

  useEffect(() => {
    messageContainerRef.current?.scrollTo({
      top: messageContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.addEventListener("stop", handleStop);
      mediaRecorderRef.current.start();
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= 30) {
            stopRecording();
            return 30;
          }
          return prevTime + 1;
        });
      }, 1000);
      audioChunks.current = [];
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      audioChunks.current.push(event.data);
    }
  };

  const handleStop = () => {
    if (audioChunks.current.length > 0) {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      setAudioBlob(audioBlob);
    }
  };

  const handleVoiceSubmit = async () => {
    if (!audioBlob) return;

    // Dummy API call for voice processing
    const dummyTranscription =
      "This is a dummy transcription of the voice message.";

    // Append user's voice message
    const userMessage: Message = {
      role: "user",
      content: "[Voice Message]",
      id: Date.now().toString(),
    };
    append(userMessage);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Append AI's response to transcription
    const aiMessage: Message = {
      role: "assistant",
      content: `I received a voice message. Here's what I understood: "${dummyTranscription}"`,
      id: Date.now().toString(),
    };
    append(aiMessage);

    // Reset audio blob and recording time
    setAudioBlob(null);
    setRecordingTime(0);
    audioChunks.current = []; // Reset audio chunks
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setRecordingTime(0);
    audioChunks.current = [];
  };

  return (
    <div className="flex flex-col h-svh bg-black text-white max-w-3xl mx-auto rounded-2xl relative">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between gap-3 p-4 border-b border-gray-800/60 rounded-b-lg border-pink-700 backdrop-blur"
      >
        <div className="flex items-center gap-5 ml-4">
          <LogoLoader />

          <div>
            <h1 className="font-bold text-2xl"><TextGradient /></h1>
            <div className="text-sm text-muted-foreground inline-flex">
              with
              <TextRotate
                texts={[
                  "Llama 3.3 🦙",
                  "Flux schnell ✨",
                  "Unsplash 🖼️",
                  "Gemini 🪐",
                  "Tavily 🤖",
                ]}
                mainClassName="px-2"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                rotationInterval={2200}
              />
            </div>
          </div>
        </div>
        <Button
          className="bg-clip-text mr-8 text-transparent bg-gradient-to-r from-pink-600 via-violet-500 to-cyan-300"
          //variant="ghost"
          size="icon"
          onClick={() => {
            window.location.reload();
          }}
        >
          <RefButton />
        </Button>
      </motion.header>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-black"
        ref={messageContainerRef}
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500"
          >
            <p className="text-sm font-medium">Error: {error.message}</p>
          </motion.div>
        )}
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative flex flex-col items-center justify-center mt-20 md:mt-32 gap-4">
                <CubeLoader />
                

                <h2 className="text-2xl md:text-4xl tracking-tight font-semibold word-spacing-4">
                    <Preview />  
                </h2>
              </div>

              <div
                className="relative overflow-scroll w-full pb-6 mt-6 flex flex-col gap-3 md:gap-4"
                style={{
                  maskImage:
                    "linear-gradient(to left, transparent 0%, black 5%, black 95%, transparent 100%)",
                }}
              >
                <div className="whitespace-nowrap flex gap-2 md:gap-4 justify-center animate-marquee">
                  {[...suggestions, ...suggestions].map((suggestion, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="rounded-full  bg-gradient-to-r from-pink-600 via-violet-500 to-cyan-300 hover:bg-blue-600 text-white hover:text-black"
                      onClick={() =>
                        handleInputChange({
                          target: { value: suggestion.text },
                        } as React.ChangeEvent<HTMLInputElement>)
                      }
                    >
                      {suggestion.emoji} {suggestion.text}
                    </Button>
                  ))}
                </div>
                <div className="whitespace-nowrap flex gap-2 md:gap-4 justify-center animate-marquee2">
                  {[...additionalSuggestions, ...additionalSuggestions].map(
                    (suggestion, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="rounded-full  bg-gradient-to-r to-pink-600 via-violet-500 from-cyan-300 hover:bg-gray-700/40 text-white hover:text-black"
                        onClick={() =>
                          handleInputChange({
                            target: { value: suggestion.text },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                      >
                        {suggestion.emoji} {suggestion.text}
                      </Button>
                    )
                  )}
                </div>
                <div className="whitespace-nowrap flex gap-2 md:gap-4 justify-center animate-marquee3">
                  {[...creativeSuggestions, ...creativeSuggestions].map(
                    (suggestion, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="rounded-full border border-blue-600 bg-black hover:text-blue-600 hover:bg-black hover:border-white text-white "
                        onClick={() =>
                          handleInputChange({
                            target: { value: suggestion.text },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                      >
                        {suggestion.emoji} {suggestion.text}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map(
          (message, i) =>
            (message.content ||
              message.toolInvocations?.some(
                (tool) => tool.toolName === "generateAIImage"
              )) && (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "flex gap-1 ml-5 md:gap-5 max-w-xl",
                  message.role === "user" ? "w-fit ml-auto" : ""
                )}
              >
                {message.role !== "user" && (
                  <LogoLoader
                  />
                )}
                <div
                  className={cn(
                    "rounded-xl px-3 py-1 mr-5 break-words",
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-700  to-pink-700 rounded-tr-none"
                      : "bg-gradient-to-r from-blue-800 to-violet-500  rounded-tl-none"
                  )}
                >
                  {message.toolInvocations?.some(
                    (tool) => tool.toolName === "generateAIImage"
                  ) ? (
                    message.toolInvocations.map((toolInvocation) => (
                      <div key={toolInvocation.toolCallId}>
                        {imgUrl && (
                          <img
                            src={imgUrl}
                            alt="AI Generated"
                            className="max-w-full h-auto rounded-lg mt-2"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <Markdown
                      className={"markdown-body"}
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-4">
                            <table
                              className="min-w-full divide-y divide-gray-700"
                              {...props}
                            />
                          </div>
                        ),
                        th: ({ node, ...props }) => (
                          <th className="px-4 py-2 bg-gray-800" {...props} />
                        ),
                        td: ({ node, ...props }) => (
                          <td
                            className="px-4 py-2 border-t border-gray-700"
                            {...props}
                          />
                        ),
                        code: ({ node, ...props }) => (
                          <code
                            className="block bg-gray-800 p-4 rounded-lg my-4"
                            {...props}
                          />
                        ),
                        img: ({ node, ...props }) => (
                          <img
                            alt="image"
                            {...props}
                            className="rounded-lg max-w-full h-auto my-2 hover:shadow-md"
                            loading="lazy"
                          />
                        ),
                      }}
                    >
                      {message.content}
                    </Markdown>
                  )}

                  {isLoading &&
                    i === messages.length - 1 &&
                    message.role !== "user" && (
                      <div className="flex items-center space-x-1 my-1">
                        <div className="size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                        <div className="size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                        <div className="size-2 animate-bounce rounded-full bg-gray-400"></div>
                      </div>
                    )}
                  <p
                    className={cn(
                      "text-[10px] -mt-1.5",
                      message.role === "user"
                        ? "text-gray-300 ml-auto text-end w-full"
                        : "text-cyan-300"
                    )}
                  >
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {message.role === "user" && (
                  <UserLoader />
                )}
              </motion.div>
            )
        )}
      </div>

      {/* Recording animation */}
      <AnimatePresence>
        {recording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 bg-gray-900 border-t border-gray-800 flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span>Recording... {recordingTime}s</span>
            </div>
            <Button onClick={cancelRecording} size="sm" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice message preview */}
      <AnimatePresence>
        {audioBlob && !recording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 bg-gray-900 border-t border-gray-800 flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <Button onClick={togglePlayPause} size="sm" variant="ghost">
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <span>Voice message ({recordingTime}s)</span>
              <audio
                ref={audioRef}
                src={URL.createObjectURL(audioBlob)}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => {
                  console.error("Audio playback error:", e);
                  setIsPlaying(false);
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleVoiceSubmit} size="sm">
                Send
              </Button>
              <Button onClick={cancelRecording} size="sm" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative flex items-end pb-4">
          <AutosizeTextarea
            value={input}
            onChange={handleInputChange}
            placeholder="Chat with CazzAI"
            minHeight={38}
            maxHeight={100}
            className="rounded-3xl pl-5 pt-3 resize-none bg-gradient-to-r to-cyan-300 from-pink-700 via-violet-500 w-full text-white"
          />
          {input.length > 0 ? (
            <Button
              type="submit"
              className="rounded-full bg-gradient-to-r to-cyan-300 from-pink-700 via-violet-500 w-full hover:bg-green-600 size-12 shrink-0"
              disabled={isLoading}
            >
              <SendHorizonal size={24} className="translate-x-px" />
            </Button>
          ) : (
            <Button
              type="button"
              className={cn(
                "rounded-full bg-gradient-to-r to-cyan-300 from-blue-700  w-full hover:bg-green-600 size-12 shrink-0 text-white",
                recording && "bg-gray-700 hover:bg-gray-800"
              )}
              onClick={() => setRecording(!recording)}
              disabled={audioBlob !== null}
            >
              <Mic
                className={cn(recording && "text-red-500 animate-pulse")}
                size={22}
              />
            </Button>
          )}
        </div>
      </motion.form>
    </div>
  );
}
