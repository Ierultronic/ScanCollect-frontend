import { ScrollCards } from "@/components/ScrollCards"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen text-slate-800 relative bg-purple-100/80 backdrop-blur-md">
      <header className="bg-gradient-to-r from-purple-700 via-purple-500 to-purple-900 shadow-xl px-6 py-4 flex justify-between items-center relative z-10">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white select-none">ScanCollect</h1>
        <div className="space-x-3">
          <Link href="/login"><Button
            className="bg-purple-200 text-purple-800 font-bold shadow border-0 hover:bg-purple-300 hover:text-purple-900 transition"
          >
            Login
          </Button></Link>
          <Link href="/register"><Button
            className="bg-green-100 text-green-800 font-bold shadow border-0 hover:bg-green-200 hover:text-green-900 transition"
          >
            Register
          </Button></Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-purple-700 leading-tight">
          Your TCG, Your Way
        </h2>
        <p className="max-w-xl text-lg mb-6 font-medium text-purple-600 bg-white/70 rounded-lg px-4 py-2 shadow">
          Scan and manage your trading card game collection with ease — discover, track, and show off your achievements.
        </p>
        <Link href="/register">
          <Button size="lg" className="bg-purple-200 text-purple-800 font-bold shadow border-0 hover:bg-purple-300 hover:text-purple-900 transition">
            Start Collecting
          </Button>
        </Link>
      </section>

      {/* Scroll Animation */}
      <ScrollCards />

      <footer className="text-center text-sm text-purple-100 py-6 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-800 shadow-xl relative z-10">
        &copy; {new Date().getFullYear()} ScanCollect. All rights reserved.
      </footer>
    </main>
  )
}
