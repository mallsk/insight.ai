"use client"

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Upload Your Data",
      description:
        "Simply drag and drop your CSV or Excel files. Our system automatically detects the structure and validates the data.",
      color: "blue",
    },
    {
      number: 2,
      title: "AI Analysis",
      description:
        "Our AI engine processes your data, identifying patterns, correlations, and generating comprehensive statistical summaries.",
      color: "purple",
    },
    {
      number: 3,
      title: "Get Insights",
      description:
        "Explore interactive visualizations, discover key insights, and export professional reports ready for presentation.",
      color: "green",
    },
  ]

  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Get from data to insights in three simple steps. No technical expertise required.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4 group">
              <div
                className={`mx-auto h-20 w-20 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-2xl shadow-${step.color}-500/25 group-hover:shadow-${step.color}-500/40 transition-all duration-300 group-hover:scale-110`}
              >
                {step.number}
              </div>
              <h3 className={`text-xl font-semibold text-white group-hover:text-${step.color}-300 transition-colors`}>
                {step.title}
              </h3>
              <p className="text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
