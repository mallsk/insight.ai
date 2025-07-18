"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import { Paperclip, Send, X, FileSpreadsheet, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming you use shadcn/ui
interface AiApiResponse {
  message: string;
}
export default function DashboardMain({
  chatLink,
  initialMessages = [],
}: {
  chatLink: string;
  initialMessages: {
    id: number;
    text: string;
    type: "user" | "ai";
    chartData?: any;
    createdAt: string;
  }[];
}) {
  
  const [inputText, setInputText] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      // As per the project proposal, we accept CSV and Excel files.
      if (["csv", "xlsx", "xls"].includes(fileExtension || "")) {
        setAttachedFile(file);
      } else {
        alert("Please select a CSV or Excel file (.csv, .xlsx, .xls)");
      }
    }
  };

  const handleSend = async () => {
  if (!inputText.trim() || !attachedFile) return;

  // Append user message immediately
  setMessages((prev) => [
  ...prev,
  {
    id: Date.now(), // or use a UUID if needed
    text: inputText,
    type: "user",
    createdAt: new Date().toISOString(),
  },
]);
  setInputText("");
  setLoading(true);

  const formData = new FormData();
  formData.append("file", attachedFile);
  formData.append("query", inputText);

  // 💡 Only add chatLink if one exists
  if (chatLink) {
    formData.append("chatLink", chatLink);
  }

  try {
    const res = await axios.post("/api/user/chat", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const data = res.data as { message: string; chatLink: string };

    const aiResponse = data.message || "Sorry, no response.";
    setMessages((prev) => [
  ...prev,
  {
    id: Date.now(), // or use a UUID if needed
    text: inputText,
    type: "user",
    createdAt: new Date().toISOString(),
  },
]);

    // ✅ Redirect if this was the first message (no chatLink yet)
    if (!chatLink && data.chatLink) {
      window.location.href = `/chat/${data.chatLink}`;
    }
  } catch (error: any) {
    console.error(error);
    const errorMessage =
      error.response?.data?.error || "❌ Something went wrong.";
    setMessages((prev) => [
  ...prev,
  {
    id: Date.now(), // or use a UUID if needed
    text: inputText,
    type: "user",
    createdAt: new Date().toISOString(),
  },
]);
  } finally {
    setLoading(false);
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
  };

  const isDisabled = !inputText.trim() || !attachedFile || loading;

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.type === "ai" && (
              <div className="mr-2 mt-1.5 text-slate-400 flex-shrink-0">
                <Bot className="h-5 w-5" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow ${
                msg.type === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-800 text-slate-100 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
            {msg.type === "user" && (
              <div className="ml-2 mt-1.5 text-slate-400 flex-shrink-0">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-start justify-start">
            <div className="mr-2 mt-1.5 text-slate-400 flex-shrink-0">
              <Bot className="h-5 w-5" />
            </div>
            <div className="bg-slate-800 text-slate-400 px-4 py-3 rounded-2xl text-sm animate-pulse rounded-bl-none">
              Thinking...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Section */}
      <div className="border-t border-slate-700 bg-slate-900/70 p-4">
        <div className="max-w-4xl mx-auto space-y-2">
          {attachedFile && (
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2">
              <FileSpreadsheet className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium">{attachedFile.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setAttachedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="h-6 w-6 ml-auto p-0 text-slate-400 hover:text-red-400 hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="relative bg-slate-800 border border-slate-600 rounded-2xl p-3 focus-within:border-blue-500 transition-colors flex items-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 w-9 p-0 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl flex-shrink-0"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <TextareaAutosize
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something about your data..."
              className="flex-1 text-white bg-transparent border-0 resize-none placeholder:text-slate-500 focus:outline-none"
              minRows={1}
              maxRows={6}
            />
            <Button
              onClick={handleSend}
              disabled={isDisabled}
              size="icon"
              className={`h-9 w-9 p-0 rounded-xl transition-all flex-shrink-0 ${
                isDisabled
                  ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
              }`}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
