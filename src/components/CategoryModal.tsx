import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
    id?: string;
    name: string;
    description: string;
    image_url: string;
}

interface CategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (category: Omit<Category, 'id'>) => void;
    initialData?: Category | null;
}

export default function CategoryModal({ open, onClose, onSubmit, initialData }: CategoryModalProps) {
    const isEdit = !!initialData;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setImageUrl(initialData.image_url || '');
        } else {
            setName('');
            setDescription('');
            setImageUrl('');
        }
    }, [initialData, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, description, image_url: imageUrl });
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative"
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-purple-700">{isEdit ? 'Edit Category' : 'Add Category'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    value={imageUrl}
                                    onChange={e => setImageUrl(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                >
                                    {isEdit ? 'Save Changes' : 'Add Category'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
} 