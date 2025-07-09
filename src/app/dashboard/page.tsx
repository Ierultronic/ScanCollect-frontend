'use client';

import Sidebar from '@/components/Sidebar';
import { FaStar, FaCrown, FaFire, FaTrophy } from 'react-icons/fa';
import AuthGuard from '@/components/AuthGuard';
import React from 'react';
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

const mockStats = [
  { label: 'Cards Scanned', value: 128, icon: <FaStar className="text-yellow-400" /> },
  { label: 'Cards Collected', value: 95, icon: <FaCrown className="text-blue-500" /> },
  { label: 'Completed Sets', value: 3, icon: <FaTrophy className="text-green-500" /> },
  { label: 'Rare Cards', value: 7, icon: <FaFire className="text-red-500" /> },
  { label: 'Achievements', value: 12, icon: <FaTrophy className="text-purple-500" /> },
  { label: 'Daily Streak', value: 5, icon: <FaFire className="text-orange-500" /> },
];

const mockActivity = [
  { card: 'Charizard EX', set: 'Pokémon TCG', img: '/public/globe.svg', time: '2h ago' },
  { card: 'Blue-Eyes White Dragon', set: 'Yu-Gi-Oh!', img: '/public/window.svg', time: '1d ago' },
  { card: 'Dark Magician', set: 'Yu-Gi-Oh!', img: '/public/vercel.svg', time: '3d ago' },
];

export default function DashboardPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
                    Email: {user.email} | Admin: {user.is_admin ? 'Yes' : 'No'} | ID: {user.user_id}
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
                Member since {user?.joined_at ? new Date(user.joined_at).toLocaleDateString() : 'Recently'}
              </p>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockStats.map((stat) => (
              <div key={stat.label} className="bg-white/80 rounded-xl shadow-xl p-6 flex items-center gap-4 border border-purple-100">
                <div className="text-3xl">{stat.icon}</div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">{stat.value}</div>
                  <div className="text-purple-400 text-sm font-semibold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Tracker */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 rounded-xl shadow-xl p-6 border border-purple-100">
              <div className="font-semibold text-purple-500 mb-2 tracking-wide">Collection Progress</div>
              <div className="w-full bg-purple-200 rounded-full h-4 mb-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-400 h-4 rounded-full" style={{ width: '35%' }}></div>
              </div>
              <div className="text-sm text-purple-400 font-semibold">35/100 Pokémon Cards</div>
            </div>
            <div className="bg-white/80 rounded-xl shadow-xl p-6 border border-purple-100">
              <div className="font-semibold text-purple-500 mb-2 tracking-wide">Achievements Progress</div>
              <div className="w-full bg-purple-200 rounded-full h-4 mb-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-4 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <div className="text-sm text-purple-400 font-semibold">4/10 Achievements Unlocked</div>
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