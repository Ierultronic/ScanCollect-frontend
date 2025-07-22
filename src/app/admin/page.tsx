import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import React from 'react';

export default function AdminPage() {
  // TODO: Replace with real admin check in next step
  const isAdmin = true; // Placeholder

  if (!isAdmin) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen items-center justify-center">
          <div className="bg-white p-8 rounded shadow text-center">
            <h1 className="text-2xl font-bold mb-2 text-red-600">Access Denied</h1>
            <p className="text-gray-600">You do not have permission to view this page.</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-100">
      {/* <Sidebar adminOnly /> */}
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-purple-800">Admin Dashboard</h1>
            <div className="grid gap-6">
              <a href="/admin/cards" className="block p-6 bg-white rounded-xl shadow hover:bg-purple-50 transition">
                <h2 className="text-xl font-semibold text-purple-700 mb-1">Manage Cards</h2>
                <p className="text-gray-600">Create, edit, or delete cards in the system.</p>
              </a>
              <a href="/admin/categories" className="block p-6 bg-white rounded-xl shadow hover:bg-purple-50 transition">
                <h2 className="text-xl font-semibold text-purple-700 mb-1">Manage Categories</h2>
                <p className="text-gray-600">Organize and update card categories.</p>
              </a>
              <a href="/admin/achievements" className="block p-6 bg-white rounded-xl shadow hover:bg-purple-50 transition">
                <h2 className="text-xl font-semibold text-purple-700 mb-1">Manage Achievements</h2>
                <p className="text-gray-600">Add or update achievement milestones.</p>
              </a>
              <a href="/admin/users" className="block p-6 bg-white rounded-xl shadow hover:bg-purple-50 transition">
                <h2 className="text-xl font-semibold text-purple-700 mb-1">User Management</h2>
                <p className="text-gray-600">Promote or demote users as admins.</p>
              </a>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 