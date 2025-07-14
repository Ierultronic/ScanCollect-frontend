'use client';

import React from 'react';
import { useCards, useDeleteCard } from '../lib/hooks';
import { Card } from '../lib/api';

export default function CardsList() {
  const { data: cards, loading, error, refetch } = useCards();
  const { deleteCard, loading: deleteLoading } = useDeleteCard();

  const handleDelete = async (id: string) => {
    try {
      await deleteCard(id);
      refetch(); // Refresh the list after deletion
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading cards...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center p-8 text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return <div className="flex justify-center p-8">No cards found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {cards.map((card: Card) => (
        <div
          key={card.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          {card.image_url && (
            <img
              src={card.image_url}
              alt={card.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {card.name}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Rarity:</span> {card.rarity}</p>
              <p><span className="font-medium">Set:</span> {card.set_code}</p>
              <p><span className="font-medium">Number:</span> {card.number}</p>
              {card.description && (
                <p className="text-gray-500 mt-2">{card.description}</p>
              )}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {new Date(card.created_at).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleDelete(card.id)}
                disabled={deleteLoading}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 