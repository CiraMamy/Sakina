import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Star } from 'lucide-react';

export default function PointsAnimation({ points, trigger, message = '' }) {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.5 }}
          animate={{ opacity: 1, y: -50, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.5 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div className="bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] rounded-[24px] px-8 py-6 card-shadow">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 1,
                ease: "easeInOut"
              }}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center mx-auto mb-3"
            >
              <Star className="w-8 h-8 text-white" fill="white" />
            </motion.div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Plus className="w-6 h-6 text-white" strokeWidth={3} />
                <span className="text-4xl font-bold text-white">{points}</span>
              </div>
              <p className="text-sm text-white/90 font-light">points gagnés!</p>
              {message && (
                <p className="text-xs text-white/80 mt-2">{message}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}