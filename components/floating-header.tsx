"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out backdrop-blur-md bg-slate-950/70 border-b border-white/10 shadow-lg shadow-black/20 ${
        scrolled
          ? "px-8 lg:px-12 py-4 mx-[10px] lg:mx-[85px] mt-4 rounded-2xl border border-white/20"
          : "px-4 lg:px-6 py-4 mx-0 mt-0 rounded-none"
      }`}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-2xl"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <Link className="flex items-center justify-center gap-2" href="#">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
            <img src="/insight.png" className="border-1 rounded-md" alt="" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            InsightAI
          </span>
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link
            className="text-sm font-medium hover:text-blue-400 transition-all duration-300 text-slate-300 hover:bg-white/5 px-3 py-2 rounded-lg backdrop-blur-sm"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:text-blue-400 transition-all duration-300 text-slate-300 hover:bg-white/5 px-3 py-2 rounded-lg backdrop-blur-sm"
            href="#how-it-works"
          >
            How it Works
          </Link>

        </nav>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            Sign in
          </Button>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </header>
  )
}
