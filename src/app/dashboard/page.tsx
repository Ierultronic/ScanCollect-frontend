'use client';

import Sidebar from '@/components/Sidebar';
import { FaStar, FaCrown, FaFire, FaTrophy } from 'react-icons/fa';
import AuthGuard from '@/components/AuthGuard';
import React, { useEffect, useState } from 'react';
import { callBackendWithAuth, createOrGetUser } from '../lib/supabase';

// User interface to match backend response
interface User {
  user_id: string;
  email: string;
  username: string;
  avatar_url: string;
  is_admin: boolean;
  joined_at: string;
  message: string;
}

interface AchievementProgress {
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

const mockActivity = [
  { card: 'Charizard EX', set: 'Pokémon TCG', img: '/public/globe.svg', time: '2h ago' },
  { card: 'Blue-Eyes White Dragon', set: 'Yu-Gi-Oh!', img: '/public/window.svg', time: '1d ago' },
  { card: 'Dark Magician', set: 'Yu-Gi-Oh!', img: '/public/vercel.svg', time: '3d ago' },
];

export default function DashboardPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [achievements, setAchievements] = useState<AchievementProgress[]>([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [achievementsError, setAchievementsError] = useState<string | null>(null);

  React.useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        // First, ensure user exists in our database
        await createOrGetUser();
        
        // Then fetch user data
        const data = await callBackendWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`);
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchAchievements() {
      setAchievementsLoading(true);
      setAchievementsError(null);
      try {
        const res = await fetch('/api/user/achievement-progress', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch achievements');
        const data = await res.json();
        setAchievements(data.achievement_progress || []);
      } catch (err: any) {
        setAchievementsError(err.message || 'Unknown error');
      } finally {
        setAchievementsLoading(false);
      }
    }
    fetchAchievements();
  }, []);

  // Calculate unlocked achievements
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-purple-100/80 backdrop-blur-md">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Backend User Info - Admin Only */}
          {user?.is_admin && (
            <div className="mb-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
                <div className="text-yellow-700 font-semibold">🔧 Developer Mode - Admin Access</div>
                <div className="text-xs text-yellow-600 mt-1">Sensitive backend information visible to admins only</div>
              </div>
              {loading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-blue-600 font-semibold">Loading user info...</div>
                  <div className="text-xs text-blue-500 mt-1">Connecting to backend...</div>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="text-red-600 font-semibold">Backend error: {error}</div>
                  <div className="text-xs text-red-500 mt-1">Please try refreshing the page</div>
                </div>
              )}
              {user && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-green-600 font-semibold">{user.message}</div>
                  <div className="text-xs text-green-500 mt-1">
                    Username: {user.username} | Admin: {user.is_admin ? 'Yes' : 'No'} | ID: {user.user_id}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Welcome Banner */}
          <div className="flex items-center gap-4 mb-8 bg-white/70 border border-purple-200 rounded-xl shadow-lg px-6 py-4">
            <div className="transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-3">
              <img 
                src={user?.avatar_url || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=default'} 
                alt="avatar" 
                className="w-16 h-16 rounded-full border-2 border-purple-400 shadow-lg cursor-pointer" 
              />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-purple-500">
                Welcome back, {user?.username || 'User'} <span role='img' aria-label='wave'>👋</span>
              </h1>
              <p className="text-purple-400 text-sm font-semibold">
                Member since {user?.joined_at ? new Date(user.joined_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'numeric', 
                  year: 'numeric'
                }) : 'Recently'}
              </p>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Remove mockStats and show real achievements count */}
            <div className="bg-white/80 rounded-xl shadow-xl p-6 flex items-center gap-4 border border-purple-100">
              <div className="text-3xl"><FaTrophy className="text-purple-500" /></div>
              <div>
                <div className="text-2xl font-bold text-purple-700">{unlockedCount} / {totalCount}</div>
                <div className="text-purple-400 text-sm font-semibold">Achievements Unlocked</div>
              </div>
            </div>
            {/* You can add more real stats here if available */}
          </div>

          {/* Progress Tracker */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 rounded-xl shadow-xl p-6 border border-purple-100">
              <div className="font-semibold text-purple-500 mb-2 tracking-wide">Achievements Progress</div>
              {achievementsLoading ? (
                <div>Loading achievements progress...</div>
              ) : achievementsError ? (
                <div className="text-red-500">{achievementsError}</div>
              ) : (
                <>
                  <div className="w-full bg-purple-200 rounded-full h-4 mb-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-4 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <div className="text-sm text-purple-400 font-semibold">{unlockedCount} / {totalCount} Achievements Unlocked</div>
                  {/* Preview a few achievements */}
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {achievements.slice(0, 3).map((ach) => (
                      <div key={ach.id} className={`flex flex-col items-center p-2 rounded ${ach.unlocked ? 'bg-green-100' : 'bg-gray-100'}`}> 
                        <img src={ach.icon_url || '/images/logo2.png'} alt={ach.name} className="w-10 h-10 object-contain rounded-full border mb-1" />
                        <span className="text-xs text-purple-700 font-semibold text-center">{ach.name}</span>
                        <span className={`text-[10px] ${ach.unlocked ? 'text-green-600' : 'text-gray-400'}`}>{ach.unlocked ? 'Unlocked' : 'Locked'}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Keep or update the other progress card as needed */}
            <div className="bg-white/80 rounded-xl shadow-xl p-6 border border-purple-100">
              <div className="font-semibold text-purple-500 mb-2 tracking-wide">Collection Progress</div>
              <div className="w-full bg-purple-200 rounded-full h-4 mb-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-400 h-4 rounded-full" style={{ width: '35%' }}></div>
              </div>
              <div className="text-sm text-purple-400 font-semibold">35/100 Pokémon Cards</div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="mb-8">
            <div className="font-semibold text-purple-500 mb-4 tracking-wide">Recent Activity</div>
            <ul className="space-y-3">
              {mockActivity.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 bg-white/80 rounded-xl shadow p-4 border border-purple-100">
                  <img src={item.img} alt={item.card} className="w-10 h-10 rounded" />
                  <div>
                    <div className="font-medium text-gray-800">You scanned <span className="text-blue-600 font-semibold">{item.card}</span> from {item.set}</div>
                    <div className="text-xs text-purple-400 font-semibold">{item.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Cards */}
          <div className="flex gap-4">
            <a href="/scan" className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:from-purple-700 hover:to-blue-600 transition">Start Scanning</a>
            <a href="/collection" className="bg-white/80 border border-purple-500 text-purple-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-purple-50 transition">View Your Collection</a>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 