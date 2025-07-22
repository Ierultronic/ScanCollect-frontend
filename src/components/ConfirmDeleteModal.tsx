import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function ConfirmDeleteModal({ open, onClose, onConfirm, title, description }: ConfirmDeleteModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative"
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-3 text-red-600">{title}</h2>
            <p className="text-gray-700 mb-6">{description}</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={onConfirm}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 