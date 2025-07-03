import { ScrollCards } from "@/components/ScrollCards"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen text-slate-800 relative">
      <header className="bg-gradient-to-r from-purple-600/90 via-purple-500/90 to-purple-600/90 backdrop-blur-sm shadow-lg px-6 py-4 flex justify-between items-center relative z-10">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">ScanCollect 2.0</h1>
        <div className="space-x-3">
          <Link href="/login"><Button
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold shadow-lg border-0 transform transition duration-200 hover:scale-105 hover:from-yellow-500 hover:to-orange-600"
          >
            Login
          </Button></Link>
          <Link href="/register"><Button
            className="bg-gradient-to-r from-green-300 to-green-500 text-white font-bold shadow-lg border-0 transform transition duration-200 hover:scale-105 hover:from-green-400 hover:to-green-600"
          >
            Register
          </Button></Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-green-600 to-yellow-500 bg-clip-text text-transparent leading-tight">
          Your TCG, Your Way
        </h2>
        <p className="max-w-xl text-lg mb-6 font-medium text-white drop-shadow-lg bg-black/40 rounded-lg px-4 py-2">
          Scan and manage your trading card game collection with ease — discover, track, and show off your achievements.
        </p>
        <Link href="/register">
          <Button size="lg" className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white border-0 shadow-lg">
            Start Collecting
          </Button>
        </Link>
      </section>

      {/* Scroll Animation */}
      <ScrollCards />

      <footer className="text-center text-sm text-gray-600 py-6 bg-gradient-to-r from-purple-100/80 via-green-100/80 to-yellow-100/80 backdrop-blur-sm relative z-10">
        &copy; {new Date().getFullYear()} ScanCollect. All rights reserved.
      </footer>
    </main>
  )
}
