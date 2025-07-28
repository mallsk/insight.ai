"use client";

export function College() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center text-white">
          <div className="space-y-4 max-w-3xl flex justify-center">
            <img
              src="./gmulogo1.png"
              className="h-16 w-16 rounded-full border-2"
              alt=""
              />
            <div>
              <h2 className="text-3xl font-bold tracking-tighter pb-2 sm:text-4xl md:text-5xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                GM University, Davanagere
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                Invested seed money
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
