"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-slate-800 bg-slate-950">
      <p className="text-xs text-slate-500">© 2025 InsightAI. All rights reserved.</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-xs hover:underline underline-offset-4 text-slate-500 hover:text-slate-300 transition-colors"
          href="#"
        >
          Terms of Service
        </Link>
        <Link
          className="text-xs hover:underline underline-offset-4 text-slate-500 hover:text-slate-300 transition-colors"
          href="#"
        >
          Privacy Policy
        </Link>
        <Link
          className="text-xs hover:underline underline-offset-4 text-slate-500 hover:text-slate-300 transition-colors"
          href="#"
        >
          Contact
        </Link>
      </nav>
    </footer>
  )
}
