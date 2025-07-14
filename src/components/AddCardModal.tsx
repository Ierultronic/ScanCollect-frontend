'use client';

import React, { useState } from 'react';
import { useCreateCard, useCategories } from '../lib/hooks';
import { Card } from '../lib/api';
import { FaTimes, FaPlus, FaUpload } from 'react-icons/fa';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddCardModal({ isOpen, onClose, onSuccess }: AddCardModalProps) {
  const { createCard, loading, error } = useCreateCard();
  const { data: categories } = useCategories();
  
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    rarity: '',
    set_code: '',
    number: '',
    image_url: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCard(formData);
      // Reset form
      setFormData({
        category_id: '',
        name: '',
        rarity: '',
        set_code: '',
        number: '',
        image_url: '',
        description: '',
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New Card</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Card Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter card name"
              />
            </div>

            {/* Rarity */}
            <div>
              <label htmlFor="rarity" className="block text-sm font-medium text-gray-700 mb-2">
                Rarity
              </label>
              <select
                id="rarity"
                name="rarity"
                value={formData.rarity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select rarity</option>
                <option value="Common">Common</option>
                <option value="Uncommon">Uncommon</option>
                <option value="Rare">Rare</option>
                <option value="Epic">Epic</option>
                <option value="Legendary">Legendary</option>
              </select>
            </div>

            {/* Set Code */}
            <div>
              <label htmlFor="set_code" className="block text-sm font-medium text-gray-700 mb-2">
                Set Code
              </label>
              <input
                type="text"
                id="set_code"
                name="set_code"
                value={formData.set_code}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., SET001"
              />
            </div>

            {/* Card Number */}
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 001"
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter card description"
            />
          </div>

          {/* Image Preview */}
          {formData.image_url && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Preview
              </label>
              <div className="w-32 h-48 border border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={formData.image_url}
                  alt="Card preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDEyOCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjY0IiB5PSI5NiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjc3NDhGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+Cjx0ZXh0IHg9IjY0IiB5PSIxMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY3NzQ4RiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPm5vdCBmb3VuZDwvdGV4dD4KPC9zdmc+';
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <FaPlus /> Add Card
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 