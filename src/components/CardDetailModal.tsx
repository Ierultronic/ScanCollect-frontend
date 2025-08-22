import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Category } from '../lib/api';
import { FaTimes, FaEdit, FaTrash, FaDownload, FaShare } from 'react-icons/fa';

interface CardDetailModalProps {
  open: boolean;
  onClose: () => void;
  card: Card | null;
  category?: Category;
  onEdit?: (card: Card) => void;
  onDelete?: (cardId: string) => void;
}

export default function CardDetailModal({ 
  open, 
  onClose, 
  card, 
  category,
  onEdit,
  onDelete 
}: CardDetailModalProps) {
  if (!open || !card) return null;

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
                {card.image_url ? (
                  <div className="w-auto max-w-md flex items-center justify-center">
                    <img
                      src={card.image_url}
                      alt={card.name}
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{card.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {card.set_code} #{card.number}
                      </span>
                      {category && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                          {category.name}
                        </span>
                      )}
                    </div>
                    {card.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">{card.description}</p>
                    )}
                  </div>

                  {/* Collection Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Collection Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Rarity</span>
                        <p className="font-semibold text-gray-900">{card.rarity}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Set</span>
                        <p className="font-semibold text-gray-900">{card.set_code}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Card Number</span>
                        <p className="font-semibold text-gray-900">#{card.number}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Date Added</span>
                        <p className="font-semibold text-gray-900">
                          {new Date(card.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Value */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Estimated Value
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-purple-600">$75.00</p>
                      <p className="text-sm text-gray-600">Based on current market prices</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => onEdit?.(card)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      <FaEdit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => onDelete?.(card.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      <FaTrash className="w-4 h-4" /> Delete
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium">
                      <FaDownload className="w-4 h-4" /> Export
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                      <FaShare className="w-4 h-4" /> Share
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