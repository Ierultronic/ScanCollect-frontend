"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import CategoryModal from '@/components/CategoryModal';
import ManageRaritiesModal from '@/components/ManageRaritiesModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { callBackendWithAuth } from '@/app/lib/supabase';

interface Category {
    id?: string;
    name: string;
    description: string;
    image_url: string;
}

export default function CategoriesManagementPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [raritiesModalOpen, setRaritiesModalOpen] = useState(false);
    const [raritiesCategory, setRaritiesCategory] = useState<{ id: string; name: string } | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`);
            if (!res.ok) throw new Error('Failed to fetch categories');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (err: any) {
            setError(err.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = () => {
        setEditCategory(null);
        setModalOpen(true);
    };

    const handleEdit = (cat: Category) => {
        setEditCategory(cat);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditCategory(null);
    };

    const handleModalSubmit = async (category: Omit<Category, 'id'>) => {
        try {
            if (editCategory) {
                // Edit mode
                await callBackendWithAuth(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${editCategory.id}`,
                    {
                        method: 'PUT',
                        body: JSON.stringify(category),
                    }
                );
            } else {
                // Add mode
                await callBackendWithAuth(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`,
                    {
                        method: 'POST',
                        body: JSON.stringify(category),
                    }
                );
            }
            await fetchCategories();
            setModalOpen(false);
            setEditCategory(null);
        } catch (err: any) {
            alert(err.message || 'Failed to save category');
        }
    };

    const handleRarities = (cat: Category) => {
        if (!cat.id) return;
        setRaritiesCategory({ id: cat.id, name: cat.name });
        setRaritiesModalOpen(true);
    };

    const handleRaritiesModalClose = () => {
        setRaritiesModalOpen(false);
        setRaritiesCategory(null);
    };

    const handleDelete = (cat: Category) => {
        setDeleteCategory(cat);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteCategory?.id) return;
        try {
            await callBackendWithAuth(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${deleteCategory.id}`,
                { method: 'DELETE' }
            );
            await fetchCategories();
        } catch (err: any) {
            alert(err.message || 'Failed to delete category');
        } finally {
            setDeleteModalOpen(false);
            setDeleteCategory(null);
        }
    };

    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
        setDeleteCategory(null);
    };

    return (
        <AuthGuard>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-purple-800">Categories Management</h1>
                        <button
                            className="mb-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                            onClick={handleAdd}
                        >
                            Add New Category
                        </button>
                        {loading && <div className="text-purple-500">Loading categories...</div>}
                        {error && <div className="text-red-500">{error}</div>}
                        {!loading && !error && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
                                        <div className="flex items-center gap-4 mb-2">
                                            {cat.image_url && <img src={cat.image_url} alt={cat.name} className="w-16 h-16 object-cover rounded" />}
                                            <div>
                                                <h2 className="text-xl font-semibold text-purple-700">{cat.name}</h2>
                                                <p className="text-gray-500 text-sm">{cat.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                                                onClick={() => handleRarities(cat)}
                                            >
                                                Manage Rarities
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                                                onClick={() => handleEdit(cat)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                                                onClick={() => handleDelete(cat)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <CategoryModal
                        open={modalOpen}
                        onClose={handleModalClose}
                        onSubmit={handleModalSubmit}
                        initialData={editCategory}
                    />
                    <ManageRaritiesModal
                        open={raritiesModalOpen}
                        onClose={handleRaritiesModalClose}
                        categoryId={raritiesCategory?.id || ''}
                        categoryName={raritiesCategory?.name || ''}
                    />
                    <ConfirmDeleteModal
                        open={deleteModalOpen}
                        onClose={handleDeleteModalClose}
                        onConfirm={handleDeleteConfirm}
                        title={deleteCategory ? `Delete category "${deleteCategory.name}"?` : ''}
                        description="This will also delete all its rarities. This action cannot be undone."
                    />
                </main>
            </div>
        </AuthGuard>
    );
} 