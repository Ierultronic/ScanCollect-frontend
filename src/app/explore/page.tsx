"use client";

import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { FaSearch, FaSort } from "react-icons/fa";
import AuthGuard from "@/components/AuthGuard";
import { motion } from "framer-motion";
import { TCG_OPTIONS, TCG_RARITIES } from "../../lib/tcg-constants";
import TcgCardFilter from '../../components/TcgCardFilter';
import { JustTCGCard, justtcgApi, fallbackCards } from "../../lib/justtcg-api";
import UnifiedCardComponent from "../../components/UnifiedCardComponent";
import ExploreCardModal from "../../components/ExploreCardModal";

interface Card {
  id: string;
  name: string;
  image_url?: string;
  description?: string;
  set_code: string;
  number: string;
  rarity: string;
  // API TCG may not have category_id, so omit category filter for now
}

export default function ExplorePage() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode] = useState<'grid'>('grid'); // Remove toggle, always grid
  // State for filtering and sorting
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [useJustTCG, setUseJustTCG] = useState(true); // Toggle between JustTCG and backend API
  const [selectedCard, setSelectedCard] = useState<any>(null);

  // Fetch categories from backend
  useEffect(() => {
    fetch("http://localhost:8082/api/categories")
      .then(res => res.json())
      .then(data => {
        console.log('Fetched categories response:', data);
        if (Array.isArray(data)) setCategories(data);
        else if (data && Array.isArray(data.data)) setCategories(data.data);
        else if (data && Array.isArray(data.categories)) setCategories(data.categories);
        else setCategories([]);
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      });
  }, []);

  // Fetch cards from JustTCG API or backend API
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchCards = async () => {
      try {
        if (useJustTCG) {
          // Use JustTCG API
          const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
          const categoryName = selectedCategoryObj?.name || 'Pokémon';
          const gameId = justtcgApi.getGameId(categoryName);

          console.log('JustTCG Search:', {
            categoryName,
            gameId,
            searchTerm,
            page
          });

          const cards = await justtcgApi.searchCards({
            game: gameId,
            name: searchTerm || undefined,
            limit: 20,
            offset: (page - 1) * 20,
            orderBy: sortBy === 'name' ? undefined : 'price',
            order: sortOrder,
          });

          setCards(cards);
          setTotalPages(Math.ceil(cards.length / 20) || 1);
        } else {
          // Use backend API (fallback)
          const params = new URLSearchParams();
          const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
          const tcgSlug = selectedCategoryObj?.name
            ? selectedCategoryObj.name.toLowerCase().replace(/ /g, '-')
            : '';
          if (tcgSlug) params.append("tcg", tcgSlug);
          if (searchTerm) params.append("name", searchTerm);
          params.append("page", String(page));
          params.append("limit", "10");
          
          const response = await fetch(`http://localhost:8082/api/explore-cards?${params.toString()}`);
          if (!response.ok) throw new Error("Failed to fetch cards");
          const data = await response.json();
          setCards(data.data || []);
          if (typeof data.totalPages === "number") setTotalPages(data.totalPages);
          else setTotalPages(1);
        }
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cards');
        // Fallback to sample data if JustTCG fails
        if (useJustTCG) {
          setCards(fallbackCards);
          setTotalPages(1);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [searchTerm, selectedCategory, page, categories, useJustTCG, sortBy, sortOrder]);

  // Reset to page 1 when search or TCG changes
  useEffect(() => { setPage(1); }, [searchTerm, selectedCategory]);

  // Keep searchInput in sync with searchTerm when searchTerm changes (e.g., on TCG change)
  useEffect(() => { setSearchInput(searchTerm); }, [searchTerm]);

  // Filter and sort cards
  const filteredAndSortedCards = useMemo(() => {
    let filtered = cards.filter((card) => {
      // Ensure we're working with string values for filtering
      const cardName = typeof card.name === 'string' ? card.name : String(card.name || '');
      const cardSet = typeof card.set === 'string' ? card.set : 
                    typeof card.set_code === 'string' ? card.set_code : String(card.set || card.set_code || '');
      const cardRarity = typeof card.rarity === 'string' ? card.rarity : String(card.rarity || '');
      
      const matchesSearch =
        cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cardSet.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRarity = !selectedRarity || cardRarity === selectedRarity;
      return matchesSearch && matchesRarity;
    });
    
    filtered.sort((a, b) => {
      let aValue: string, bValue: string;
      
      // Ensure we're working with string values for sorting
      switch (sortBy) {
        case "name":
          aValue = typeof a.name === 'string' ? a.name.toLowerCase() : String(a.name || '').toLowerCase();
          bValue = typeof b.name === 'string' ? b.name.toLowerCase() : String(b.name || '').toLowerCase();
          break;
        case "rarity":
          aValue = typeof a.rarity === 'string' ? a.rarity.toLowerCase() : String(a.rarity || '').toLowerCase();
          bValue = typeof b.rarity === 'string' ? b.rarity.toLowerCase() : String(b.rarity || '').toLowerCase();
          break;
        case "set_code":
          const aSet = typeof a.set === 'string' ? a.set : 
                      typeof a.set_code === 'string' ? a.set_code : String(a.set || a.set_code || '');
          const bSet = typeof b.set === 'string' ? b.set : 
                      typeof b.set_code === 'string' ? b.set_code : String(b.set || b.set_code || '');
          aValue = aSet.toLowerCase();
          bValue = bSet.toLowerCase();
          break;
        default:
          aValue = typeof a.name === 'string' ? a.name.toLowerCase() : String(a.name || '').toLowerCase();
          bValue = typeof b.name === 'string' ? b.name.toLowerCase() : String(b.name || '').toLowerCase();
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return filtered;
  }, [cards, searchTerm, selectedRarity, sortBy, sortOrder]);

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "bg-gray-500";
      case "uncommon":
        return "bg-green-500";
      case "rare":
        return "bg-blue-500";
      case "epic":
        return "bg-purple-500";
      case "legendary":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  // Helper to get the correct image URL from the card object
  function getCardImage(card: any) {
    // One Piece, Digimon, Dragon Ball Fusion, Gundam, Union Arena, Magic
    if (card.images && (card.images.small || card.images.large)) {
      return card.images.large || card.images.small;
    }
    // Pokémon
    if (card.images && card.images.small) {
      return card.images.small;
    }
    // Some APIs may use 'image_url' (legacy)
    if (card.image_url) {
      return card.image_url;
    }
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading cards</div>
          <div className="text-gray-600">{error}</div>
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Cards</h1>
              <p className="text-gray-600">
                {filteredAndSortedCards.length} card{filteredAndSortedCards.length !== 1 ? "s" : ""} found
              </p>
            </div>
            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {/* API Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">API Source:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setUseJustTCG(true)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        useJustTCG
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      disabled={!justtcgApi.isConfigured()}
                    >
                      JustTCG (Live Pricing)
                    </button>
                    <button
                      onClick={() => setUseJustTCG(false)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        !useJustTCG
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      API TCG
                    </button>
                  </div>
                </div>
                {useJustTCG ? (
                  <div className={`text-xs px-2 py-1 rounded ${
                    justtcgApi.isConfigured() 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-red-600 bg-red-50'
                  }`}>
                    {justtcgApi.isConfigured() 
                      ? '✓ JustTCG API configured' 
                      : '⚠ JustTCG API key needed'
                    }
                  </div>
                ) : (
                  <div className="text-xs px-2 py-1 rounded text-blue-600 bg-blue-50">
                    ✓ API TCG with images
                  </div>
                )}
              </div>

              <TcgCardFilter
                rarity={selectedRarity}
                search={searchInput}
                sortBy={sortBy}
                sortOrder={sortOrder}
                categories={categories}
                selectedCategory={selectedCategory}
                onChange={(filters) => {
                  if (filters.category !== undefined) setSelectedCategory(filters.category);
                  if (filters.rarity !== undefined) setSelectedRarity(filters.rarity);
                  if (filters.search !== undefined) setSearchInput(filters.search);
                  if (filters.sortBy !== undefined) setSortBy(filters.sortBy);
                  if (filters.sortOrder !== undefined) setSortOrder(filters.sortOrder as 'asc' | 'desc');
                }}
                showSearchButton={true}
                showRarity={true}
                showSort={true}
              />
            </div>

            {/* Cards Display */}
            {filteredAndSortedCards.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No cards found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedRarity
                    ? "Try adjusting your filters"
                    : "Try searching for a card!"}
                </p>
                {useJustTCG && !justtcgApi.isConfigured() && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <strong>JustTCG API Key Required:</strong> To use live pricing data, 
                      please add your JustTCG API key to the backend environment variables.
                    </p>
                    <p className="text-yellow-700 text-xs mt-2">
                      Add <code className="bg-yellow-100 px-1 rounded">JUST_TCG_API_KEY=your_key</code> to your backend <code className="bg-yellow-100 px-1 rounded">.env</code> file.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      : "space-y-4"
                  }
                >
                  {filteredAndSortedCards.map((card) => {
                    // Debug logging to see card structure
                    console.log('Rendering card:', card);
                    
                    return (
                      <UnifiedCardComponent
                        key={card.id + (card.number || "")}
                        card={card}
                        isJustTCG={useJustTCG}
                        onClick={() => {
                          setSelectedCard(card);
                          setModalOpen(true);
                        }}
                      />
                    );
                  })}
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                    className="px-4 py-2 rounded bg-purple-200 text-purple-800 font-bold disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="font-semibold text-lg text-purple-700">
                    Page {page} {totalPages > 1 ? `of ${totalPages}` : ""}
                  </span>
                  <button
                    onClick={() => setPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p + 1))}
                    disabled={loading || (totalPages ? page >= totalPages : false)}
                    className="px-4 py-2 rounded bg-purple-200 text-purple-800 font-bold disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      {/* Card Detail Modal */}
      <ExploreCardModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCard(null);
        }}
        card={selectedCard}
        isJustTCG={useJustTCG}
      />
    </AuthGuard>
  );
} 