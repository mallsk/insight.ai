"use client"

import { BarChart3, Brain, Database, FileSpreadsheet, TrendingUp, Upload } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturesSection() {
  const features = [
    {
      icon: Upload,
      title: "Smart Data Upload",
      description: "Seamlessly upload CSV and Excel files with automatic format detection and validation.",
      color: "blue",
    },
    {
      icon: Brain,
      title: "AI-Driven Analysis",
      description: "Advanced algorithms automatically identify patterns, anomalies, and key insights in your data.",
      color: "purple",
    },
    {
      icon: BarChart3,
      title: "Interactive Visualizations",
      description: "Dynamic charts and graphs that adapt to your data, making complex information easy to understand.",
      color: "green",
    },
    {
      icon: Database,
      title: "Data Profiling",
      description: "Comprehensive analysis of data types, missing values, and statistical summaries at a glance.",
      color: "orange",
    },
    {
      icon: TrendingUp,
      title: "Predictive Insights",
      description: "Forecast trends and identify opportunities with machine learning-powered predictions.",
      color: "pink",
    },
    {
      icon: FileSpreadsheet,
      title: "Export & Share",
      description: "Generate professional reports and share insights with your team in multiple formats.",
      color: "indigo",
    },
  ]

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-slate-900/50 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Powerful Features for Smart Analysis
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to turn raw data into meaningful insights, powered by advanced AI algorithms.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className={`border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl hover:shadow-${feature.color}-500/10 transition-all duration-300 hover:-translate-y-2 hover:border-${feature.color}-500/50 group`}
              >
                <CardHeader>
                  <div
                    className={`h-12 w-12 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-${feature.color}-500/25 group-hover:shadow-${feature.color}-500/40 transition-all duration-300`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className={`text-white group-hover:text-${feature.color}-300 transition-colors`}>
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
