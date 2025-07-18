"use client";

import { useState, useRef, useEffect } from "react";
import {
  Brain,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Logout from "./logout";

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}
type ApiResponse = {
  user: {
    name: string;
    email: string;
    image: string;
  };
};

export function DashboardHeader({
  onToggleSidebar,
  sidebarOpen,
}: DashboardHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<ApiResponse["user"] | null>(null);

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

  return (
    <header className="h-14 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-4">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="text-slate-300 hover:text-white hover:bg-slate-800 p-2"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            InsightAI
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
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>

              {/* Menu Items */}
              <div className="space-y-1">
                {/* <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button> */}
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
  );
}
