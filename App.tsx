
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import ApiKeyDialog from './components/ApiKeyDialog';
import BottomPromptBar from './components/BottomPromptBar';
import VideoCard from './components/VideoCard';
import CreditDisplay from './components/CreditDisplay';
import PricingModal from './components/PricingModal';
import LibraryModal from './components/LibraryModal';
import { generateVideo } from './services/geminiService';
import { creditService } from './services/creditService';
import { generationService } from './services/generationService';
import { FeedPost, GenerateVideoParams, PostStatus } from './types';
import { Clapperboard, Library } from 'lucide-react';

// Extend Window interface for AI Studio helper
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

// Sample video URLs for the feed (public domain/creative commons)
const sampleVideos: FeedPost[] = [
  {
    id: 's1',
    videoUrl: 'https://storage.googleapis.com/sideprojects-asronline/veo-cameos/cameo-alisa.mp4',
    username: 'alisa_fortin',
    avatarUrl: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Maria',
    description: 'Sipping coffee at a parisian cafe',
    modelTag: 'Veo Fast',
    status: PostStatus.SUCCESS,
  },
  {
    id: 's2',
    videoUrl: 'https://storage.googleapis.com/sideprojects-asronline/veo-cameos/cameo-omar.mp4',
    username: 'osanseviero',
    avatarUrl: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery',
    description: 'At a llama petting zoo',
    modelTag: 'Veo Fast',
    status: PostStatus.SUCCESS,
  },
  {
    id: 's3',
    videoUrl: 'https://storage.googleapis.com/sideprojects-asronline/veo-cameos/cameo-ammaar.mp4',
    username: 'ammaar',
    avatarUrl: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Kimberly',
    description: 'At a red carpet ceremony',
    modelTag: 'Veo',
    status: PostStatus.SUCCESS,
  },
    {
    id: 's4',
    videoUrl: 'https://storage.googleapis.com/sideprojects-asronline/veo-cameos/cameo-logan.mp4',
    username: 'OfficialLoganK',
    avatarUrl: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Jocelyn',
    description: 'Vibe coding on a mountain.',
    modelTag: 'Veo Fast',
    status: PostStatus.SUCCESS,
  },
    {
    id: 's5',
    videoUrl: 'https://storage.googleapis.com/sideprojects-asronline/veo-cameos/cameo-kat.mp4',
    username: 'kat_kampf',
    avatarUrl: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Jameson',
    description: 'Exploring a majestic temple in a forest.',
    modelTag: 'Veo Fast',
    status: PostStatus.SUCCESS,
  },
    {
    id: 's6',
    videoUrl: 'https://storage.googleapis.com/sideprojects-asronline/veo-cameos/cameo-josh.mp4',
    username: 'joshwoodward',
    avatarUrl: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Jade',
    description: 'On the Google Keynote stage.',
    modelTag: 'Veo Fast',
    status: PostStatus.SUCCESS,
  },    
];

const App: React.FC = () => {
  const [feed, setFeed] = useState<FeedPost[]>(sampleVideos);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(10);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [generations, setGenerations] = useState<any[]>([]);
  const mockUserId = 'demo-user';

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setCredits(10);
  };

  const loadGenerations = async () => {
    setGenerations([]);
  };

  useEffect(() => {
    if (errorToast) {
      const timer = setTimeout(() => setErrorToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorToast]);

  const updateFeedPost = (id: string, updates: Partial<FeedPost>) => {
    setFeed(prevFeed => 
      prevFeed.map(post => 
        post.id === id ? { ...post, ...updates } : post
      )
    );
  };

  const processGeneration = async (postId: string, params: GenerateVideoParams) => {
    try {
      const { url } = await generateVideo(params);
      updateFeedPost(postId, { videoUrl: url, status: PostStatus.SUCCESS });
    } catch (error) {
      console.error('Video generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
      updateFeedPost(postId, { status: PostStatus.ERROR, errorMessage: errorMessage });
      
      // Global error toast for specific API key issues
      if (typeof errorMessage === 'string' && (
          errorMessage.includes('API_KEY_INVALID') || 
          errorMessage.includes('permission denied') ||
          errorMessage.includes('Requested entity was not found')
      )) {
        setErrorToast('Invalid API key or permissions. Please check billing.');
      }
    }
  };

  const handlePurchase = async (tierId: string, credits: number, price: number) => {
    setCredits(prev => prev + credits);
    setShowPricingModal(false);
    setErrorToast(`Successfully added ${credits} credits!`);
  };

  const handleDeleteGeneration = async (id: string) => {
    setGenerations(prev => prev.filter(g => g.id !== id));
  };

  const handleGenerate = useCallback(async (params: GenerateVideoParams) => {
    if (credits < 1) {
      setShowPricingModal(true);
      setErrorToast('Insufficient credits. Please purchase more credits to continue.');
      return;
    }

    if (window.aistudio) {
      try {
        if (!(await window.aistudio.hasSelectedApiKey())) {
          setShowApiKeyDialog(true);
          return;
        }
      } catch (error) {
        setShowApiKeyDialog(true);
        return;
      }
    }

    setCredits(prev => prev - 1);

    const newPostId = Date.now().toString();
    const refImage = params.referenceImages?.[0]?.base64;

    // Create new post object with GENERATING status
    const newPost: FeedPost = {
      id: newPostId,
      username: 'you',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      description: params.prompt,
      modelTag: params.model === 'veo-3.1-fast-generate-preview' ? 'Veo Fast' : 'Veo',
      status: PostStatus.GENERATING,
      referenceImageBase64: refImage,
    };

    // Prepend to feed immediately
    setFeed(prev => [newPost, ...prev]);

    // Start generation in background
    processGeneration(newPostId, params);

  }, [credits]);

  const handleApiKeyDialogContinue = async () => {
    setShowApiKeyDialog(false);
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden font-sans selection:bg-white/20 selection:text-white">
      {showApiKeyDialog && (
        <ApiKeyDialog onContinue={handleApiKeyDialogContinue} />
      )}

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        onPurchase={handlePurchase}
      />

      <LibraryModal
        isOpen={showLibraryModal}
        onClose={() => setShowLibraryModal(false)}
        generations={generations}
        onDelete={handleDeleteGeneration}
        onRefresh={loadGenerations}
      />
      
      {/* Error Toast */}
      <AnimatePresence>
        {errorToast && (
            <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 24, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-1/2 -translate-x-1/2 z-[60] bg-neutral-900/80 border border-white/10 text-white px-5 py-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl max-w-md text-center text-sm font-medium flex items-center gap-3"
            >
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse"></div>
                {errorToast}
            </motion.div>
        )}
      </AnimatePresence>
      
      <main className="flex-1 h-full relative overflow-y-auto overflow-x-hidden no-scrollbar bg-black">
        {/* Ambient background light */}
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.03),_transparent_70%)]"></div>

        {/* Top Bar */}
        <header className="sticky top-0 z-30 w-full px-6 py-6 pointer-events-none">
            {/* Glass background for header */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-xl mask-image-linear-gradient-to-b" />
            
            <div className="relative flex items-center justify-between text-white pointer-events-auto max-w-[1600px] mx-auto w-full">
                <div className="flex items-center gap-3.5">
                    <Clapperboard className="w-8 h-8 text-white" />
                    <h1 className="font-bogle text-3xl text-white tracking-wide drop-shadow-sm">VEO CAMEOS</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowLibraryModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl hover:bg-white/10 transition-all text-white"
                    >
                      <Library className="w-4 h-4" />
                      <span className="text-sm font-medium">Library</span>
                    </button>

                    <CreditDisplay
                      credits={credits}
                      onPurchase={() => setShowPricingModal(true)}
                    />
                </div>
            </div>
        </header>

        {/* Video Grid */}
        <div className="w-full max-w-[1600px] mx-auto p-4 md:p-6 pb-48 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence initial={false}>
              {feed.map((post) => (
                <VideoCard key={post.id} post={post} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <BottomPromptBar onGenerate={handleGenerate} />
    </div>
  );
};

export default App;
