import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Trash2, Send } from 'lucide-react';
import { Button } from '../ui/button';

export default function VoiceRecorder({ onSend, onCancel }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Impossible d\'accéder au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
  };

  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob, duration);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-[24px] p-5 card-shadow mb-4"
    >
      {!audioBlob ? (
        <div className="flex flex-col items-center space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5]'
            } transition-all`}
          >
            {isRecording ? (
              <Square className="w-8 h-8 text-white" fill="white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </motion.button>

          <div className="text-center">
            <p className="text-2xl font-bold text-[#2E4057]">
              {formatDuration(duration)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isRecording ? 'Enregistrement en cours...' : 'Appuie pour enregistrer'}
            </p>
          </div>

          {isRecording && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex space-x-1"
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-8 bg-red-500 rounded-full"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    animation: 'pulse 1s ease-in-out infinite'
                  }}
                />
              ))}
            </motion.div>
          )}

          {!isRecording && (
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full rounded-[16px]"
            >
              Annuler
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={playAudio}
              className="w-12 h-12 rounded-full bg-[#8CB8E8] hover:bg-[#7AA5D1] flex items-center justify-center transition-colors"
            >
              <Play className="w-5 h-5 text-white" fill={isPlaying ? 'white' : 'none'} />
            </button>
            
            <div className="flex-1 bg-[#FAFAFA] rounded-[16px] px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 h-1 bg-[#8CB8E8]/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#8CB8E8]"
                    initial={{ width: '0%' }}
                    animate={{ width: isPlaying ? '100%' : '0%' }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 ml-3">
                  {formatDuration(duration)}
                </span>
              </div>
            </div>

            <button
              onClick={deleteRecording}
              className="w-12 h-12 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 rounded-[16px]"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSend}
              className="flex-1 rounded-[16px] bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] hover:shadow-lg"
            >
              <Send className="w-4 h-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </motion.div>
  );
}