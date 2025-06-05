import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  isVisible?: boolean;
}

export default function Toast({ message, onClose, isVisible = true }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="bg-dark-900/95 backdrop-blur-xl text-white px-6 py-4 rounded-2xl shadow-glow-orchid flex items-center gap-3 max-w-sm">
            <div className="w-8 h-8 bg-gradient-to-r from-orchid-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-200 flex-1">{message}</span>
            <motion.button
              onClick={onClose}
              className="w-6 h-6 rounded-lg bg-dark-800 hover:bg-dark-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 