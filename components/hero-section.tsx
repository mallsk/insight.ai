"use client"

import { ArrowRight, Play, Shield, Sparkles, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Beam Light Effect */}
      <div className="absolute top-0 right-0 w-full h-full">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-30">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-400/20 via-purple-400/10 to-transparent transform rotate-12 blur-3xl"></div>
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-bl from-cyan-400/30 via-blue-400/15 to-transparent transform rotate-6 blur-2xl"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-white/20 via-blue-300/20 to-transparent blur-xl"></div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-50 animation-delay-2000"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse opacity-30 animation-delay-3000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:72px_72px]"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-6 max-w-4xl pt-22">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              AI-Powered Data Analysis
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl"></div>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight pr-4">
                Transform Data into
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 pb-2 to-pink-400 bg-clip-text text-transparent">
                Actionable Insights
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-slate-300 md:text-xl lg:text-2xl p-2 leading-relaxed">
              Upload your datasets and let our AI automatically analyze, visualize, and extract meaningful insights.
              <span className="text-blue-300"> No coding required</span>, just intelligent data interpretation.
            </p>
          </div>
          <div className="pb-26">

          </div>
        </div>
      </div>
    </section>
  )
}
