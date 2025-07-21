'use client';

import React, { useState, useEffect } from 'react';
import { useCards, useCategories, useDeleteCard, useUserCollections } from '../../lib/hooks';
import { Card, Category } from '../../lib/api';
import { FaSearch, FaFilter, FaSort, FaTrash, FaEdit, FaEye, FaPlus, FaDownload, FaShare } from 'react-icons/fa';
import AddCardModal from '../../components/AddCardModal';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import TcgCardFilter from '../../components/TcgCardFilter';
import { TCG_OPTIONS } from '../../lib/tcg-constants';

export default function CollectionPage() {
  const { data: cards, loading, error, refetch } = useCards();
  const { collections, loading: loadingCollections, error: errorCollections } = useUserCollections();
  const { data: categories } = useCategories();
  const { deleteCard, loading: deleteLoading } = useDeleteCard();

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter and sort cards (only those in user's collection)
  const filteredAndSortedCards: Card[] = React.useMemo((): Card[] => {
    if (!cards || !collections) return [];
    // Only show cards that are in the user's collection
    const userCardIds = new Set(collections.map(col => col.card_id));
    let filtered = cards.filter((card: Card) => userCardIds.has(card.id));

    // Sort cards
    filtered.sort((a: Card, b: Card) => {
      let aValue: string | number, bValue: string | number;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'rarity':
          aValue = a.rarity.toLowerCase();
          bValue = b.rarity.toLowerCase();
          break;
        case 'set_code':
          aValue = a.set_code.toLowerCase();
          bValue = b.set_code.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply search, category, and rarity filters
    filtered = filtered.filter((card: Card) => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.set_code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || card.category_id === selectedCategory;
      const matchesRarity = !selectedRarity || card.rarity === selectedRarity;

      return matchesSearch && matchesCategory && matchesRarity;
    });

    return filtered;
  }, [cards, collections, searchTerm, selectedCategory, selectedRarity, sortBy, sortOrder]);

  // Handle card deletion
  const handleDeleteCard = async (cardId: string) => {
    if (confirm('Are you sure you want to delete this card from your collection?')) {
      try {
        await deleteCard(cardId);
        refetch();
      } catch (error) {
        console.error('Failed to delete card:', error);
      }
    }
  };

  // Handle bulk selection
  const handleSelectCard = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCards.length === filteredAndSortedCards.length) {
      setSelectedCards([]);
    } else {
      setSelectedCards(filteredAndSortedCards.map(card => card.id));
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    return categories?.find((cat: Category) => cat.id === categoryId)?.name || 'Unknown Category';
  };

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  if (loading || loadingCollections) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || errorCollections) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading collection</div>
          <div className="text-gray-600">{error || errorCollections}</div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-purple-100/80 backdrop-blur-md">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Collection</h1>
          <p className="text-gray-600">
            {filteredAndSortedCards.length} card{filteredAndSortedCards.length !== 1 ? 's' : ''} in your collection
          </p>
        </div>
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <TcgCardFilter
            rarity={selectedRarity}
            search={searchTerm}
            sortBy={sortBy}
            sortOrder={sortOrder as 'asc' | 'desc'}
            categories={categories || []}
            selectedCategory={selectedCategory}
            onChange={(filters) => {
              if (filters.rarity !== undefined) setSelectedRarity(filters.rarity);
              if (filters.search !== undefined) setSearchTerm(filters.search);
              if (filters.sortBy !== undefined) setSortBy(filters.sortBy);
              if (filters.sortOrder !== undefined) setSortOrder(filters.sortOrder);
              if (filters.category !== undefined) setSelectedCategory(filters.category);
            }}
            showSearchButton={false}
            showRarity={true}
            showSort={true}
          />
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                List View
              </button>
            </div>
            <div className="flex gap-2">
              {selectedCards.length > 0 && (
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                  <FaTrash /> Delete Selected ({selectedCards.length})
                </button>
              )}
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <FaPlus /> Add Card
              </button>
            </div>
          </div>
        </div>

        {/* Cards Display */}
        {filteredAndSortedCards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No cards found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory || selectedRarity 
                ? 'Try adjusting your filters' 
                : 'Start building your collection by adding your first card!'
              }
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredAndSortedCards.map((card: Card) => (
              <div
                key={card.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  viewMode === 'list' ? 'flex' : ''
                } ${selectedCards.includes(card.id) ? 'ring-2 ring-purple-500' : ''}`}
              >
                {/* Card Image */}
                <div className={`${viewMode === 'list' ? 'w-32 flex-shrink-0' : 'w-full'}`}>
                  {card.image_url ? (
                    <img
                      src={card.image_url}
                      alt={card.name}
                      className={`${viewMode === 'list' ? 'h-full w-full' : 'h-48 w-full'} object-cover`}
                    />
                  ) : (
                    <div className={`${viewMode === 'list' ? 'h-32' : 'h-48'} w-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center`}>
                      <div className="text-gray-400 text-4xl">🃏</div>
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                      {card.name}
                    </h3>
                    <input
                      type="checkbox"
                      checked={selectedCards.includes(card.id)}
                      onChange={() => handleSelectCard(card.id)}
                      className="ml-2"
                    />
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Category:</span>
                      <span>{getCategoryName(card.category_id)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Rarity:</span>
                      <span className={`px-2 py-1 rounded-full text-xs text-white ${getRarityColor(card.rarity)}`}>
                        {card.rarity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Set:</span>
                      <span>{card.set_code} #{card.number}</span>
                    </div>
                    {card.description && (
                      <p className="text-gray-500 text-xs line-clamp-2">
                        {card.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-400">
                      Added {new Date(card.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-1">
                      <FaEye /> View
                    </button>
                    <button className="flex-1 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors flex items-center justify-center gap-1">
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      disabled={deleteLoading}
                      className="flex-1 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Collection Stats */}
        {filteredAndSortedCards.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Collection Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{filteredAndSortedCards.length}</div>
                <div className="text-sm text-gray-600">Total Cards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(filteredAndSortedCards.map((card: Card) => card.category_id)).size}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(filteredAndSortedCards.map((card: Card) => card.set_code)).size}
                </div>
                <div className="text-sm text-gray-600">Sets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {new Set(filteredAndSortedCards.map((card: Card) => card.rarity)).size}
                </div>
                <div className="text-sm text-gray-600">Rarities</div>
              </div>
            </div>
          </div>
        )}
        {/* Add Card Modal */}
        <AddCardModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            refetch();
            setIsAddModalOpen(false);
          }}
        />
      </div>
    </main>
  </div>
</AuthGuard>
  );
}
