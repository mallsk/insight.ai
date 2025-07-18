"use client";

import { useState } from "react";
import { MessageSquare, Plus, Search, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Chat {
  id: string;
  title: string;
  timestamp: string;
}

interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({ isOpen, onToggle }: DashboardSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentChats] = useState<Chat[]>([
    { id: "1", title: "Sales Data Analysis Q4 2024", timestamp: "2 hours ago" },
    { id: "2", title: "Customer Segmentation Report", timestamp: "1 day ago" },
    {
      id: "3",
      title: "Marketing Campaign Performance",
      timestamp: "2 days ago",
    },
    { id: "4", title: "Revenue Forecasting Model", timestamp: "3 days ago" },
    { id: "5", title: "Product Analytics Dashboard", timestamp: "1 week ago" },
    { id: "6", title: "User Behavior Analysis", timestamp: "1 week ago" },
    { id: "7", title: "Financial Metrics Overview", timestamp: "2 weeks ago" },
    { id: "8", title: "Inventory Management Data", timestamp: "2 weeks ago" },
  ]);

  const filteredChats = recentChats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-700 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-80" : "w-0"
        } lg:relative lg:z-auto`}
      >
        <div className="">

          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="p-4 border-b border-slate-700">
                <Button
                  className="w-full justify-start gap-3 bg-slate-800 hover:bg-slate-700 text-white border-slate-600"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                  New Analysis
                </Button>
              </div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Recent
              </h3>
              <div className="space-y-1">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-slate-400">{chat.timestamp}</p>
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
        </div>
      </div>
    </>
  );
}
