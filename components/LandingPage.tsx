"use client"

import { CTASection } from "./cta-section"
import { FeaturesSection } from "./features-section"
import { FloatingHeader } from "./floating-header"
import { Footer } from "./footer"
import { HeroSection } from "./hero-section"
import { HowItWorksSection } from "./how-it-works-section"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white overflow-hidden">
      <FloatingHeader />

      <main className="flex-1 pt-20">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}
