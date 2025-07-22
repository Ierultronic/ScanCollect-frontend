import React, { useEffect, useState } from 'react';
import { callBackendWithAuth } from '@/app/lib/supabase';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Rarity {
  id: string;
  value: string;
  label: string;
}

interface ManageRaritiesModalProps {
  open: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
}

export default function ManageRaritiesModal({ open, onClose, categoryId, categoryName }: ManageRaritiesModalProps) {
  const [rarities, setRarities] = useState<Rarity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addValue, setAddValue] = useState('');
  const [addLabel, setAddLabel] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editLabel, setEditLabel] = useState('');

  const fetchRarities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${categoryId}/rarities`);
      if (!res.ok) throw new Error('Failed to fetch rarities');
      const data = await res.json();
      setRarities(data.rarities || []);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchRarities();
    // eslint-disable-next-line
  }, [open, categoryId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await callBackendWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${categoryId}/rarities`,
        {
          method: 'POST',
          body: JSON.stringify({ value: addValue, label: addLabel }),
        }
      );
      setAddValue('');
      setAddLabel('');
      await fetchRarities();
    } catch (err: any) {
      alert(err.message || 'Failed to add rarity');
    }
  };

  const handleEdit = (rarity: Rarity) => {
    setEditId(rarity.id);
    setEditValue(rarity.value);
    setEditLabel(rarity.label);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    try {
      await callBackendWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rarities/${editId}`,
        {
          method: 'PUT',
          body: JSON.stringify({ value: editValue, label: editLabel }),
        }
      );
      setEditId(null);
      setEditValue('');
      setEditLabel('');
      await fetchRarities();
    } catch (err: any) {
      alert(err.message || 'Failed to update rarity');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this rarity?')) return;
    try {
      await callBackendWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rarities/${id}`,
        { method: 'DELETE' }
      );
      await fetchRarities();
    } catch (err: any) {
      alert(err.message || 'Failed to delete rarity');
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl relative"
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={onClose}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-purple-700">Manage Rarities for {categoryName}</h2>
            {loading && <div className="text-purple-500">Loading rarities...</div>}
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {!loading && !error && (
              <div>
                <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Value (e.g. SR)"
                    className="border rounded px-2 py-1 flex-1"
                    value={addValue}
                    onChange={e => setAddValue(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Label (e.g. Super Rare)"
                    className="border rounded px-2 py-1 flex-1"
                    value={addLabel}
                    onChange={e => setAddLabel(e.target.value)}
                    required
                  />
                  <button type="submit" className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">Add</button>
                </form>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-1">Value</th>
                      <th className="py-1">Label</th>
                      <th className="py-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rarities.map(rarity => (
                      <tr key={rarity.id}>
                        <td className="py-1">
                          {editId === rarity.id ? (
                            <input
                              type="text"
                              className="border rounded px-2 py-1"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              required
                            />
                          ) : (
                            rarity.value
                          )}
                        </td>
                        <td className="py-1">
                          {editId === rarity.id ? (
                            <input
                              type="text"
                              className="border rounded px-2 py-1"
                              value={editLabel}
                              onChange={e => setEditLabel(e.target.value)}
                              required
                            />
                          ) : (
                            rarity.label
                          )}
                        </td>
                        <td className="py-1">
                          {editId === rarity.id ? (
                            <>
                              <button
                                className="px-2 py-1 bg-green-500 text-white rounded mr-1 hover:bg-green-600"
                                onClick={handleEditSave}
                                title="Save"
                              >
                                <FaSave />
                              </button>
                              <button
                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                onClick={() => setEditId(null)}
                                title="Cancel"
                              >
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded mr-1 hover:bg-yellow-200"
                                onClick={() => handleEdit(rarity)}
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                onClick={() => handleDelete(rarity.id)}
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    {rarities.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center text-gray-400 py-4">No rarities yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 