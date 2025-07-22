"use client";

import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import React, { useState } from 'react';
import { FaTrophy, FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

// Mock achievement data type
interface Achievement {
  id: number;
  name: string;
  description: string;
}

const initialAchievements: Achievement[] = [
  { id: 1, name: 'First Collection', description: 'Complete your first card collection.' },
  { id: 2, name: 'Collector', description: 'Collect 100 cards.' },
];

export default function ManageAchievementsPage() {
  const isAdmin = true; // Placeholder

  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [achievementToDelete, setAchievementToDelete] = useState<Achievement | null>(null);

  // Form state
  const [form, setForm] = useState({ name: '', description: '' });

  // Handlers
  const openAddModal = () => {
    setEditingAchievement(null);
    setForm({ name: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setForm({ name: achievement.name, description: achievement.description });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAchievement(null);
    setForm({ name: '', description: '' });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAchievement) {
      // Edit
      setAchievements(achievements.map(a => a.id === editingAchievement.id ? { ...a, ...form } : a));
    } else {
      // Add
      const newAchievement: Achievement = {
        id: Math.max(0, ...achievements.map(a => a.id)) + 1,
        name: form.name,
        description: form.description,
      };
      setAchievements([newAchievement, ...achievements]);
    }
    closeModal();
  };

  const openDeleteModal = (achievement: Achievement) => {
    setAchievementToDelete(achievement);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setAchievementToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = () => {
    if (achievementToDelete) {
      setAchievements(achievements.filter(a => a.id !== achievementToDelete.id));
      closeDeleteModal();
    }
  };

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
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-purple-800">Manage Achievements</h1>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full shadow hover:scale-105 hover:from-purple-700 hover:to-purple-900 transition-transform duration-150"
                onClick={openAddModal}
              >
                <FaPlus />
                Add Achievement
              </button>
            </div>

            {/* Achievements Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-full text-center text-gray-500">Loading...</div>
              ) : error ? (
                <div className="col-span-full text-center text-red-500">{error}</div>
              ) : achievements.length === 0 ? (
                <p className="col-span-full text-gray-500">No achievements to display yet.</p>
              ) : (
                achievements.map(a => (
                  <div
                    key={a.id}
                    className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 border border-purple-100 hover:shadow-xl transition-shadow group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full p-3 shadow-inner">
                        <FaTrophy className="text-yellow-700 text-2xl" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-purple-800 group-hover:underline">{a.name}</h2>
                        <p className="text-gray-500 text-sm">{a.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 justify-end">
                      <button
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                        onClick={() => openEditModal(a)}
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                        onClick={() => openDeleteModal(a)}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add/Edit Modal */}
          <AnimatePresence>
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
                >
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                    onClick={closeModal}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <h2 className="text-xl font-bold mb-4 text-purple-700">
                    {editingAchievement ? 'Edit Achievement' : 'Add Achievement'}
                  </h2>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block mb-1 font-medium">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Description</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleFormChange}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 border border-gray-200"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full shadow hover:from-purple-700 hover:to-purple-900 transition"
                      >
                        {editingAchievement ? 'Save Changes' : 'Add Achievement'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
          <ConfirmDeleteModal
            open={deleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={handleDelete}
            title={achievementToDelete ? `Delete achievement "${achievementToDelete.name}"?` : ''}
            description="This action cannot be undone."
          />

        </main>
      </div>
    </AuthGuard>
  );
}

// Animations (add to your global CSS if not present)
// .animate-fade-in { animation: fadeIn 0.2s; }
// .animate-pop-in { animation: popIn 0.2s; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } } 