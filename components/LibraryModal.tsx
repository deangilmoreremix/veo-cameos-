import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Download, Trash2, AlertCircle } from 'lucide-react';
import { Generation } from '../services/generationService';
import { VeoLogo } from './icons';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  generations: Generation[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ isOpen, onClose, generations, onDelete, onRefresh }) => {
  const [selectedVideo, setSelectedVideo] = useState<Generation | null>(null);

  useEffect(() => {
    if (isOpen) {
      onRefresh();
    }
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleDownload = async (gen: Generation) => {
    if (!gen.videoUrl) return;

    try {
      if (gen.videoUrl.startsWith('blob:')) {
        const a = document.createElement('a');
        a.href = gen.videoUrl;
        a.download = `video-${gen.id}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const response = await fetch(gen.videoUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `video-${gen.id}.mp4`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      onDelete(id);
      if (selectedVideo?.id === id) {
        setSelectedVideo(null);
      }
    }
  };

  const getStatusColor = (status: Generation['status']) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'generating': return 'text-yellow-400';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-6xl w-full shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Your Library</h2>
                  <p className="text-white/60">{generations.length} video generations</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white/60 hover:text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {generations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-white/40">
                    <VeoLogo className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg">No videos yet</p>
                    <p className="text-sm mt-2">Start creating your first video below!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generations.map((gen) => (
                      <motion.div
                        key={gen.id}
                        className="bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all cursor-pointer group"
                        whileHover={{ y: -2 }}
                        onClick={() => setSelectedVideo(gen)}
                      >
                        <div className="aspect-video bg-black/60 relative">
                          {gen.status === 'success' && gen.videoUrl ? (
                            <video
                              src={gen.videoUrl}
                              className="w-full h-full object-cover"
                              muted
                              loop
                              playsInline
                            />
                          ) : gen.status === 'generating' ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                          )}

                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-xs text-white/80 flex items-center gap-1">
                            <VeoLogo className="w-3 h-3" />
                            {gen.model.includes('fast') ? 'Fast' : 'Standard'}
                          </div>

                          <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(gen.status)} bg-black/60 backdrop-blur-md capitalize`}>
                            {gen.status}
                          </div>
                        </div>

                        <div className="p-4">
                          <p className="text-white text-sm line-clamp-2 mb-2">{gen.prompt}</p>
                          <div className="flex items-center justify-between text-xs text-white/40">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(gen.createdAt)}
                            </div>
                            <span>{gen.creditsUsed} credit{gen.creditsUsed > 1 ? 's' : ''}</span>
                          </div>

                          {gen.status === 'success' && (
                            <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(gen);
                                }}
                                className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-medium transition-colors flex items-center justify-center gap-1"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(gen.id);
                                }}
                                className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 text-xs font-medium transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {selectedVideo && selectedVideo.status === 'success' && selectedVideo.videoUrl && (
            <motion.div
              className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
            >
              <video
                src={selectedVideo.videoUrl}
                className="max-w-4xl max-h-[80vh] rounded-2xl"
                controls
                autoPlay
                loop
              />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default LibraryModal;
