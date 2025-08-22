import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaDollarSign, FaArrowUp, FaArrowDown, FaMinus, FaExternalLinkAlt } from 'react-icons/fa';

// Unified card interface that can handle both JustTCG and API TCG cards
interface UnifiedCard {
  id: string;
  name: string;
  set?: string;
  set_code?: string;
  number: string;
  rarity: string;
  image_url?: string;
  description?: string;
  game?: string;
  tcgplayerId?: string;
  variants?: any[];
  // API TCG specific fields
  price?: number;
  condition?: string;
  printing?: string;
  // Image fields
  images?: {
    small?: string;
    large?: string;
  };
}

interface ExploreCardModalProps {
  open: boolean;
  onClose: () => void;
  card: UnifiedCard | null;
  isJustTCG?: boolean;
}

export default function ExploreCardModal({ 
  open, 
  onClose, 
  card, 
  isJustTCG = false 
}: ExploreCardModalProps) {
  if (!open || !card) return null;

  // Helper function to safely extract string value from potentially complex objects
  const safeStringValue = (value: any, fallback: string = 'Unknown'): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (value && typeof value === 'object') {
      // If it's an object, try to extract a meaningful value
      if (value.name && typeof value.name === 'string') return value.name;
      if (value.value && typeof value.value === 'string') return value.value;
      if (value.label && typeof value.label === 'string') return value.label;
      // If it's an array, take the first item
      if (Array.isArray(value) && value.length > 0) return safeStringValue(value[0], fallback);
    }
    return value ? String(value) : fallback;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-green-400';
    }
  };

  // Helper functions for JustTCG cards
  const getLowestPrice = (): number => {
    if (!isJustTCG || !card.variants || card.variants.length === 0) {
      return card.price || 0;
    }
    return Math.min(...card.variants.map((v: any) => v.price));
  };

  const getPriceRange = (): { min: number; max: number } => {
    if (!isJustTCG || !card.variants || card.variants.length === 0) {
      const price = card.price || 0;
      return { min: price, max: price };
    }
    const prices = card.variants.map((v: any) => v.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  const formatPrice = (price: number): string => {
    if (price === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getPriceChangeIndicator = (): { direction: 'up' | 'down' | 'neutral'; percentage: number } => {
    if (!isJustTCG || !card.variants || card.variants.length === 0) {
      return { direction: 'neutral', percentage: 0 };
    }

    const change24h = card.variants[0]?.priceChange24hr || 0;
    
    if (change24h > 0) return { direction: 'up', percentage: change24h };
    if (change24h < 0) return { direction: 'down', percentage: Math.abs(change24h) };
    return { direction: 'neutral', percentage: 0 };
  };

  const getPriceChangeIcon = () => {
    const priceChange = getPriceChangeIndicator();
    switch (priceChange.direction) {
      case 'up':
        return <FaArrowUp className="text-green-500" />;
      case 'down':
        return <FaArrowDown className="text-red-500" />;
      default:
        return <FaMinus className="text-gray-500" />;
    }
  };

  const getPriceChangeColor = () => {
    const priceChange = getPriceChangeIndicator();
    switch (priceChange.direction) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Get the correct image URL
  const getCardImage = (): string | null => {
    // One Piece, Digimon, Dragon Ball Fusion, Gundam, Union Arena, Magic
    if (card.images && (card.images.small || card.images.large)) {
      return card.images.large || card.images.small || null;
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
  };

  const cardImage = getCardImage();
  const priceRange = getPriceRange();
  const priceChange = getPriceChangeIndicator();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-xl shadow-lg w-auto max-w-[95vw] max-h-[95vh] overflow-y-auto relative my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Card Details</h2>
              <button
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                onClick={onClose}
                aria-label="Close"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Card Image */}
              <div className="lg:w-auto p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-blue-50 flex-shrink-0 flex items-center justify-center">
                {cardImage ? (
                  <div className="w-auto max-w-md flex items-center justify-center">
                    <img
                      src={cardImage}
                      alt={safeStringValue(card.name, 'Card image')}
                      className="w-auto h-auto max-h-[80vh] object-contain rounded-lg shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="w-64 h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-6xl">🃏</div>
                  </div>
                )}
              </div>

              {/* Right Side - Card Details */}
              <div className="lg:w-80 p-4 lg:p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {safeStringValue(card.name, 'Unknown Card')}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {safeStringValue(card.set || card.set_code, 'Unknown Set')} #{safeStringValue(card.number, '')}
                      </span>
                      <span className={`px-3 py-1 text-white text-sm rounded-full ${getRarityColor(safeStringValue(card.rarity, 'Unknown'))}`}>
                        {safeStringValue(card.rarity, 'Unknown')}
                      </span>
                    </div>
                    {card.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {safeStringValue(card.description, '')}
                      </p>
                    )}
                  </div>

                  {/* Card Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Card Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Set</span>
                        <p className="font-semibold text-gray-900">
                          {safeStringValue(card.set || card.set_code, 'Unknown Set')}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Card Number</span>
                        <p className="font-semibold text-gray-900">
                          #{safeStringValue(card.number, '')}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Rarity</span>
                        <p className="font-semibold text-gray-900">
                          {safeStringValue(card.rarity, 'Unknown')}
                        </p>
                      </div>
                      {card.game && (
                        <div className="bg-white rounded-lg p-3">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Game</span>
                          <p className="font-semibold text-gray-900">
                            {safeStringValue(card.game, 'Unknown Game')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing Information */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FaDollarSign className="text-purple-500" />
                      Pricing Information
                    </h4>
                    
                    {isJustTCG ? (
                      <div className="space-y-3">
                        {/* Price Range */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Price Range:</span>
                          <span className="font-bold text-lg text-purple-600">
                            {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                          </span>
                        </div>

                        {/* Price Change */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">24h Change:</span>
                          <div className="flex items-center gap-2">
                            {getPriceChangeIcon()}
                            <span className={`font-semibold ${getPriceChangeColor()}`}>
                              {priceChange.percentage > 0 ? `${priceChange.percentage.toFixed(1)}%` : 'No change'}
                            </span>
                          </div>
                        </div>

                        {/* Variants Info */}
                        {card.variants && card.variants.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-purple-200">
                            <span className="text-sm text-gray-600">Available Variants:</span>
                            <div className="mt-2 space-y-2">
                              {card.variants.slice(0, 3).map((variant: any, index: number) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">
                                    {safeStringValue(variant.condition, 'Unknown Condition')}
                                  </span>
                                  <span className="font-semibold text-purple-600">
                                    {formatPrice(typeof variant.price === 'number' ? variant.price : parseFloat(String(variant.price || 0)))}
                                  </span>
                                </div>
                              ))}
                              {card.variants.length > 3 && (
                                <div className="text-xs text-gray-500">
                                  +{card.variants.length - 3} more variants
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Simple Price Display */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Price:</span>
                          <span className="font-bold text-lg text-purple-600">
                            {card.price ? formatPrice(card.price) : 'N/A'}
                          </span>
                        </div>
                        
                        {card.condition && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Condition:</span>
                            <span className="font-semibold text-gray-900">
                              {safeStringValue(card.condition, 'Unknown')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-200">
                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium">
                      <FaExternalLinkAlt className="w-4 h-4" />
                      View on TCGPlayer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 