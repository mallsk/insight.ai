import { College } from "@/components/College"
import { CTASection } from "@/components/cta-section"
import { FeaturesSection } from "@/components/features-section"
import { FloatingHeader } from "@/components/floating-header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { HowItWorksSection } from "@/components/how-it-works-section"


export default async function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white overflow-hidden">
      <FloatingHeader />

      <main className="flex-1 pt-20">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
        <div className="p-4"></div>
        <College />
      </main>

      <Footer />
    </div>
  )
}