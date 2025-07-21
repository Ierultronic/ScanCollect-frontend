"use client";

import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { FaSearch, FaSort } from "react-icons/fa";
import AuthGuard from "@/components/AuthGuard";
import { motion } from "framer-motion";
import { TCG_OPTIONS, TCG_RARITIES } from "../../lib/tcg-constants";
import TcgCardFilter from '../../components/TcgCardFilter';

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
  const [cards, setCards] = useState<Card[]>([]);
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
  const [modalImage, setModalImage] = useState<string | null>(null);

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

  // Fetch cards from backend API
  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    // Find the selected category object
    const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
    // Convert category name to slug
    const tcgSlug = selectedCategoryObj?.name
      ? selectedCategoryObj.name.toLowerCase().replace(/ /g, '-')
      : '';
    if (tcgSlug) params.append("tcg", tcgSlug);
    if (searchTerm) params.append("name", searchTerm);
    params.append("page", String(page));
    params.append("limit", "10");
    fetch(`http://localhost:8082/api/explore-cards?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch cards");
        const data = await res.json();
        setCards(data.data || []);
        if (typeof data.totalPages === "number") setTotalPages(data.totalPages);
        else setTotalPages(1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchTerm, selectedCategory, page, categories]);

  // Reset to page 1 when search or TCG changes
  useEffect(() => { setPage(1); }, [searchTerm, selectedCategory]);

  // Keep searchInput in sync with searchTerm when searchTerm changes (e.g., on TCG change)
  useEffect(() => { setSearchInput(searchTerm); }, [searchTerm]);

  // Filter and sort cards
  const filteredAndSortedCards = useMemo(() => {
    let filtered = cards.filter((card) => {
      const matchesSearch =
        (card.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (card.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (card.set_code?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      const matchesRarity = !selectedRarity || card.rarity === selectedRarity;
      return matchesSearch && matchesRarity;
    });
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "rarity":
          aValue = a.rarity.toLowerCase();
          bValue = b.rarity.toLowerCase();
          break;
        case "set_code":
          aValue = a.set_code.toLowerCase();
          bValue = b.set_code.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
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
                  {filteredAndSortedCards.map((card) => (
                    <motion.div
                      key={card.id + (card.number || "")}
                      className="relative overflow-hidden shadow-lg rounded-[28px] flex items-end"
                      style={{ width: 260, height: 360, margin: "auto", cursor: "pointer", border: "2px solid #c4b5fd", background: "#eee" }}
                      whileHover={{
                        scale: 1.12,
                        rotate: -2,
                        boxShadow: "0 15px 35px rgba(147, 51, 234, 0.15), 0 5px 15px rgba(168, 85, 247, 0.10)",
                        zIndex: 10,
                      }}
                      transition={{ type: "spring", stiffness: 260, damping: 15 }}
                      onClick={() => {
                        const img = getCardImage(card);
                        if (img) {
                          setModalImage(img);
                          setModalOpen(true);
                        }
                      }}
                    >
                      {/* Card Image as background */}
                      {getCardImage(card) ? (
                        <img
                          src={getCardImage(card)}
                          alt={card.name}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 28,
                            zIndex: 1,
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 z-1 rounded-[28px]">
                          <div className="text-gray-400 text-4xl">🃏</div>
                        </div>
                      )}
                      {/* Gradient overlay for text readability */}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          bottom: 0,
                          width: "100%",
                          height: "100px",
                          background: "linear-gradient(0deg, rgba(0,0,0,0.8) 80%, rgba(0,0,0,0.0) 100%)",
                          zIndex: 2,
                        }}
                      />
                      {/* Card Info overlay */}
                      <div
                        style={{
                          position: "relative",
                          zIndex: 3,
                          width: "100%",
                          padding: "14px 14px 10px 14px",
                          color: "#fff",
                          fontWeight: 500,
                          fontSize: "1.05rem",
                          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: "1.12rem", lineHeight: 1.2, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%", maxWidth: "100%" }}>{card.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.98rem", flexWrap: "nowrap", minWidth: 0 }}>
                          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Rarity:</span>
                          <span style={{ background: "rgba(0,0,0,0.7)", color: "#fff", borderRadius: 12, padding: "2px 10px", fontWeight: 700, fontSize: "0.98rem", letterSpacing: 0.5, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inline-block" }}>{card.rarity}</span>
                          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Set:</span>
                          <span style={{ background: "rgba(0,0,0,0.7)", color: "#fff", borderRadius: 12, padding: "2px 10px", fontWeight: 700, fontSize: "0.98rem", letterSpacing: 0.5, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inline-block" }}>{card.set_code}{card.number ? ` #${card.number}` : ""}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
      {/* Modal for full image display */}
      {modalOpen && modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setModalOpen(false)}>
          <div className="relative bg-transparent rounded-lg shadow-lg flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2  text-purple-700 rounded-full px-0.5 py-0.5 font-bold shadow hover:bg-purple-100 z-10 text-base"
              aria-label="Close"
            >
              ×
            </button>
            <img
              src={modalImage}
              alt="Card Full"
              style={{ maxWidth: "90vw", maxHeight: "80vh", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
            />
          </div>
        </div>
      )}
    </AuthGuard>
  );
} 