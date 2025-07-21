"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
    }
    fetchAchievements();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Achievements</h1>
      {loading && <div>Loading achievements...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="space-y-6">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`flex items-center gap-4 p-4 rounded-lg shadow-md border ${ach.unlocked ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}
          >
            <img
              src={ach.icon_url || "/images/logo2.png"}
              alt={ach.name}
              className="w-16 h-16 object-contain rounded-full border"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-purple-800">{ach.name}</h2>
                {ach.unlocked && (
                  <span className="ml-2 px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded">Unlocked</span>
                )}
              </div>
              <p className="text-gray-600 mb-2">{ach.description}</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${ach.unlocked ? "bg-green-400" : "bg-purple-400"}`}
                  style={{ width: `${Math.min(100, (ach.progress / (ach.target || 1)) * 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {ach.progress} / {ach.target} {ach.trigger_type.replace("_", " ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 