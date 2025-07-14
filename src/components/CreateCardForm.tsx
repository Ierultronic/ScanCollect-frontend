'use client';

import React, { useState } from 'react';
import { useCreateCard, useCategories } from '../lib/hooks';
import { Card } from '../lib/api';

export default function CreateCardForm() {
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
      // Reset form after successful creation
      setFormData({
        category_id: '',
        name: '',
        rarity: '',
        set_code: '',
        number: '',
        image_url: '',
        description: '',
      });
      alert('Card created successfully!');
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Card</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Card Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter card name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="rarity" className="block text-sm font-medium text-gray-700 mb-1">
              Rarity
            </label>
            <input
              type="text"
              id="rarity"
              name="rarity"
              value={formData.rarity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Common, Rare"
            />
          </div>

          <div>
            <label htmlFor="set_code" className="block text-sm font-medium text-gray-700 mb-1">
              Set Code
            </label>
            <input
              type="text"
              id="set_code"
              name="set_code"
              value={formData.set_code}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., SET001"
            />
          </div>

          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 001"
            />
          </div>
        </div>

        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter card description"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-md transition-colors"
          >
            {loading ? 'Creating...' : 'Create Card'}
          </button>
        </div>
      </form>
    </div>
  );
} 