import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Download, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AudioMessage from './AudioMessage';

const FilePreview = ({ url, onRemove, showRemove = false }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  
  if (!isImage) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 bg-white/10 rounded-[12px] px-3 py-2 text-xs hover:bg-white/20 transition-colors"
      >
        <Download className="w-4 h-4" />
        <span>Fichier joint</span>
      </a>
    );
  }
  
  return (
    <>
      <div className="relative group">
        <img
          src={url}
          alt="Fichier joint"
          className="max-w-[200px] max-h-[200px] rounded-[12px] cursor-pointer object-cover"
          onClick={() => setShowFullImage(true)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-[12px] transition-colors flex items-center justify-center">
          <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {showRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
      
      {showFullImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowFullImage(false)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <img
            src={url}
            alt="Fichier joint"
            className="max-w-full max-h-full rounded-[24px]"
          />
        </motion.div>
      )}
    </>
  );
};

export default function MessageBubble({ message, isUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* File attachments */}
        {message.file_urls && message.file_urls.length > 0 && (
          <div className={`mb-2 ${isUser ? 'flex justify-end' : ''}`}>
            <div className="space-y-2">
              {message.file_urls.map((url, index) => (
                <FilePreview key={index} url={url} />
              ))}
            </div>
          </div>
        )}
        
        {/* Audio message */}
        {message.audio_url && (
          <div
            className={`rounded-[24px] px-5 py-3 ${
              isUser
                ? 'bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] text-white'
                : 'bg-white text-[#2E4057] card-shadow'
            }`}
          >
            <AudioMessage 
              audioUrl={message.audio_url} 
              duration={message.audio_duration}
              isUser={isUser}
            />
          </div>
        )}
        
        {/* Message bubble */}
        {message.text && (
          <div
            className={`rounded-[24px] px-5 py-3 ${
              isUser
                ? 'bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] text-white'
                : 'bg-white text-[#2E4057] card-shadow'
            } ${message.audio_url ? 'mt-2' : ''}`}
          >
            {isUser ? (
              <p className="text-sm leading-relaxed">{message.text}</p>
            ) : (
              <ReactMarkdown
                className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:leading-relaxed [&_p]:my-2"
                components={{
                  p: ({ children }) => <p className="text-[#2E4057] leading-relaxed my-2">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-[#8CB8E8]">{children}</strong>,
                  em: ({ children }) => <em className="italic text-[#2E4057]/80">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-[#2E4057]">{children}</li>,
                }}
              >
                {message.text}
              </ReactMarkdown>
            )}
          </div>
        )}
        
        {!isUser && message.time && (
          <p className="text-xs text-gray-400 mt-1 ml-4">{message.time}</p>
        )}
      </div>
    </motion.div>
  );
}