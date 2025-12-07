"use client";

import type React from "react";

import { useState, useRef, useEffect, use } from "react";
import {
  Brain,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Settings,
  HelpCircle,
  MessageSquare,
  Plus,
  Search,
  Trash2,
  Sparkles,
  Paperclip,
  Send,
  X,
  FileSpreadsheet,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Logout from "@/components/logut";
import axios from "axios";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { ChartRenderer } from "@/components/ChartRender";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { Redirect } from "@/components/redirect";
type MessageType = {
  type: "user" | "ai";
  text: string;
  chart?: any;
};

interface Chat {
  id: number;
  chatLink: string;
  title: string;
  createdAt: Date;
}
type ApiResponse = {
  user: {
    name: string;
    email: string;
    image: string;
  };
};
interface AiApiResponse {
  message: string;
}

export default function ChatDashboard() {

  const params = useParams<{ chatid: string}>()
  const chatid = params?.chatid!
  const router = useRouter();
  const [user, setUser] = useState<ApiResponse["user"] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [chartData, setChartData] = useState("");

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [model, setmodel] = useState(true);
  const [message, setMessage] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const endRef = useRef<HTMLDivElement>(null);

  const [recentChats,setRecentChats] = useState<Chat[]>([]);
    useEffect(() => {
  const fetchChats = async () => {
    try {
      const response = await axios.get<{ chats: Chat[] }>("/api/chats", {
        withCredentials: true,
      });
      setRecentChats(response.data.chats);
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  };
  fetchChats();
}, []);

  const newChat = () => {
    const link = nanoid(10);
    router.push(`/chat/${link}`);
  };
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  useEffect(() => {
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/${chatid}`);
      const data = await res.json();

      const formattedMessages: MessageType[] = data.messages.map((m: any) => ({
        type: m.role === "assistant" ? "ai" : "user",
        text: m.content,
        chart: m.chartData ?? undefined,
      }));

      setMessages(formattedMessages);
      setMessage(false)
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  if (chatid) fetchMessages();
}, [chatid]);

  useEffect(() => {
    const fetchdata = async () => {
      const response = await axios.get<ApiResponse>("/api/user", {
        withCredentials: true,
      });
      setUser(response.data.user);
    };
    fetchdata();
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredChats = recentChats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (
        fileExtension === "csv" ||
        fileExtension === "xlsx" ||
        fileExtension === "xls"
      ) {
        setAttachedFile(file);
      } else {
        alert("Please select only CSV or Excel files (.csv, .xlsx, .xls)");
      }
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    setmodel(false);
    if (!inputText.trim() || !attachedFile) return;

    setMessages((prev) => [...prev, { type: "user", text: inputText }]);
    setInputText("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", attachedFile);
    formData.append("query", inputText);
    formData.append("chatId", chatid);

    try {
      const res = await axios.post("/api/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const response = res.data as { message: string; chart: string };
      const aiResponse =
        response.message || "Sorry, I could not get a response.";
      const data = response.chart;
      setChartData(data);
      setMessages((prev) => [...prev, { type: "ai", text: aiResponse, chart: data  }]);
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error || "Something went wrong.";
      setMessages((prev) => [...prev, { type: "ai", text: errorMessage }]);
    } finally {
      setLoading(false);
      setAttachedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim() && attachedFile) {
        handleSend();
      }
    }
  };

  const isDisabled = !inputText.trim() || !attachedFile;

  return (
    <div className="h-screen flex bg-slate-950 text-white">
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-700 z-50 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-80" : "w-0"
        } lg:relative lg:z-auto`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-700">
            <Button
              onClick={newChat}
              disabled={model && message}
              className="disabled:opacity-50 disabled:cursor-not-allowed w-full justify-start gap-3 bg-slate-800 hover:bg-slate-700 text-white border-slate-600"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              New Analysis
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Recent Chats */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Recent
              </h3>
              <div className="space-y-1">
                {filteredChats.map((chats) => (
                  <div
                    key={chats.id}
                    onClick={() => router.push(`/chat/${chats.chatLink}`)} 
                    className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {chats.title}
                      </p>
                      <p className="text-xs text-slate-400">{new Date(chats.createdAt).toLocaleString()}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-slate-400 hover:text-red-400 hover:bg-slate-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          {/* <div className="p-4 border-t border-slate-700">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-4">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-slate-300 hover:text-white hover:bg-slate-800 p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <img src="/insight.png" className="h-8 w-8 text-white border-1 rounded-md" />
              </div>
              <span className="font-semibold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <button className="cursor-pointer" onClick={()=>{
                  router.push("/chat")
                }}>
                  InsightAI
                </button>
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2"
            >
              <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <img src={user?.image} className="h-8 w-8 rounded-full" />
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user?.name}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </Button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                <div className="p-2">
                  {/* User Info */}
                  <div className="px-3 py-2 border-b border-slate-700 mb-2">
                    <p className="text-sm font-medium text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Help & Support
                    </Button>

                    <div className="border-t border-slate-700 my-2"></div>
                    <Logout />
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-slate-950 flex flex-col">
          {/* ChatGPT-style Hero Section */}
          {model&& message && (
            <div className="flex-1 flex items-center pt-50 justify-center px-6">
              <div className="max-w-3xl mx-auto text-center">
                {/* Logo and Title */}
                <div className="mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-semibold text-white mb-3">
                    How can I help you analyze your data today?
                  </h1>
                  <p className="text-slate-400 text-lg">
                    Upload your CSV or Excel file and describe what insights
                    you're looking for.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className="flex flex-col space-y-2">
                <div
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

                {msg.type === "ai" && msg.chart && (
                  <div className="w-5xl p-8 bg-white/5 rounded-lg">
                    <ChartRenderer key={idx} chart={msg.chart} />
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

          {/* ChatGPT-style Input Area */}
          <div className="border-t border-slate-700 bg-slate-900/50 p-4">
            <div className="max-w-4xl mx-auto">
              {/* File Attachment Display */}
              {attachedFile && (
                <div className="mb-3">
                  <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-white">
                      {attachedFile.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="h-5 w-5 p-0 text-slate-400 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Input Container */}
              <div className="relative bg-slate-800 border border-slate-600 rounded-2xl focus-within:border-blue-500 transition-colors">
                <div className="flex items-end gap-2 p-3">
                  {/* Attach File Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAttachClick}
                    className="flex-shrink-0 h-10 w-10 p-0 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>

                  {/* Text Input */}
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe what you want to analyze... (File attachment required)"
                    className="flex-1 min-h-[40px] max-h-32 bg-transparent border-0 resize-none text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                    rows={1}
                  />

                  {/* Send Button */}
                  <Button
                    onClick={handleSend}
                    disabled={isDisabled}
                    size="sm"
                    className={`flex-shrink-0 h-10 w-10 p-0 rounded-xl transition-all ${
                      isDisabled
                        ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Helper Text */}
              <div className="mt-2 text-center">
                <p className="text-xs text-slate-500">
                  Attach a CSV or Excel file (.csv, .xlsx, .xls) and describe
                  your analysis needs
                </p>
              </div>

              {/* Hidden File Input */}
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
      </div>
    </div>
  );
}
