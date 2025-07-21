"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  trigger_type: string;
  requirement: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAchievements() {
      setLoading(true);
      setError(null);
      // --- DUMMY DATA FOR UI DEVELOPMENT ---
      const dummyAchievements: Achievement[] = [
        {
          id: "1",
          name: "First Scan!",
          description: "Scan your first card.",
          icon_url: "/images/logo2.png",
          trigger_type: "scan",
          requirement: "Scan 1 card",
          unlocked: true,
          progress: 1,
          target: 1,
        },
        {
          id: "2",
          name: "Collector",
          description: "Collect 10 cards.",
          icon_url: "/images/logo2.png",
          trigger_type: "collect",
          requirement: "Collect 10 cards",
          unlocked: false,
          progress: 4,
          target: 10,
        },
        {
          id: "3",
          name: "Explorer",
          description: "Explore 5 categories.",
          icon_url: "/images/logo2.png",
          trigger_type: "explore",
          requirement: "Explore 5 categories",
          unlocked: false,
          progress: 2,
          target: 5,
        },
      ];
      setTimeout(() => {
        setAchievements(dummyAchievements);
        setLoading(false);
      }, 800);
      // --- END DUMMY DATA ---
      /*
      try {
        // Get the current session (access token)
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        if (!accessToken) {
          setError("You must be logged in to view achievements.");
          setLoading(false);
          return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/achievement-progress`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch achievements");
        const data = await res.json();
        setAchievements(data.achievement_progress || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
      */
    }
    fetchAchievements();
  }, []);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-purple-100/80 backdrop-blur-md">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Achievements</h1>
              <p className="text-gray-600">Track your progress and unlock new milestones as you collect and explore cards!</p>
            </div>
            {/* Achievements Grid */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {loading && <div className="text-purple-500">Loading achievements...</div>}
              {error && <div className="text-red-500">{error}</div>}
              {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className={`flex flex-col items-center p-6 rounded-2xl shadow border transition-all duration-300 ${ach.unlocked ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}
                    >
                      <img
                        src={ach.icon_url || "/images/logo2.png"}
                        alt={ach.name}
                        className="w-20 h-20 object-contain rounded-full border mb-4 shadow"
                      />
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-bold text-purple-800 text-center">{ach.name}</h2>
                        {ach.unlocked && (
                          <span className="ml-2 px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded">Unlocked</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-center mb-3">{ach.description}</p>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                          className={`h-3 rounded-full ${ach.unlocked ? "bg-green-400" : "bg-purple-400"}`}
                          style={{ width: `${Math.min(100, (ach.progress / (ach.target || 1)) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {ach.progress} / {ach.target} {ach.trigger_type.replace("_", " ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 