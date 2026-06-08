import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export default function TypingIndicator({ message = "Je t'écoute..." }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-4"
    >
      <div className="bg-white rounded-[24px] px-5 py-3 card-shadow max-w-[80%]">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Brain className="w-5 h-5 text-[#8CB8E8]" />
          </motion.div>
          
          <div className="flex flex-col">
            <div className="flex space-x-2 mb-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#8CB8E8]"
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 font-light">{message}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}