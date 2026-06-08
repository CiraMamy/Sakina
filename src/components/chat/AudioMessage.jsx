import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

export default function AudioMessage({ audioUrl, duration, isUser }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex items-center space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-white/20 hover:bg-white/30' 
            : 'bg-[#8CB8E8] hover:bg-[#7AA5D1]'
        } transition-colors`}
      >
        {isPlaying ? (
          <Pause className={`w-5 h-5 ${isUser ? 'text-white' : 'text-white'}`} fill="currentColor" />
        ) : (
          <Play className={`w-5 h-5 ${isUser ? 'text-white' : 'text-white'}`} fill="currentColor" />
        )}
      </motion.button>

      <div className="flex-1 min-w-[150px]">
        <div className="relative h-1 bg-white/20 rounded-full overflow-hidden mb-1">
          <motion.div
            className={`h-full ${isUser ? 'bg-white' : 'bg-[#8CB8E8]'}`}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${isUser ? 'text-white/80' : 'text-gray-600'}`}>
            {formatTime(currentTime)}
          </span>
          <span className={`text-xs ${isUser ? 'text-white/80' : 'text-gray-600'}`}>
            {formatTime(duration || 0)}
          </span>
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
}