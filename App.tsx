
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
import ScriptGeneratorModal from './components/ScriptGeneratorModal';
import AIToolsHub from './components/AIToolsHub';
import VideoAnalysisModal from './components/VideoAnalysisModal';
import StyleTransferModal from './components/StyleTransferModal';
import StoryboardModal from './components/StoryboardModal';
import RepurposingModal from './components/RepurposingModal';
import CompetitorAnalysisModal from './components/CompetitorAnalysisModal';
import BrandGuidelinesModal from './components/BrandGuidelinesModal';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { generateVideo } from './services/geminiService';
import { creditService } from './services/creditService';
import { generationService } from './services/generationService';
import { supabase } from './services/supabaseClient';
import { FeedPost, GenerateVideoParams, PostStatus } from './types';
import { Clapperboard, Library, FileText, Sparkles, ChevronDown, Search, Palette, Film, RefreshCw, Target, LogOut, User } from 'lucide-react';

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
  const [showScriptGenerator, setShowScriptGenerator] = useState(false);
  const [showAITools, setShowAITools] = useState(false);
  const [showVideoAnalysis, setShowVideoAnalysis] = useState(false);
  const [showStyleTransfer, setShowStyleTransfer] = useState(false);
  const [showStoryboard, setShowStoryboard] = useState(false);
  const [showRepurposing, setShowRepurposing] = useState(false);
  const [showCompetitor, setShowCompetitor] = useState(false);
  const [showBrandGuidelines, setShowBrandGuidelines] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [generations, setGenerations] = useState<any[]>([]);
  const [promptFromScript, setPromptFromScript] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData();
      loadGenerations();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadUserProfile(session.user.id);
        setShowLanding(false);
      }

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        (async () => {
          setUser(session?.user ?? null);
          if (session?.user) {
            await loadUserProfile(session.user.id);
            setShowLanding(false);
          }
        })();
      });
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const loadUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      setUserProfile(data);
      setCredits(data.credits);
    }
  };

  const loadUserData = async () => {
    if (!user) return;
    await loadUserProfile(user.id);
  };

  const loadGenerations = async () => {
    if (!user) return;
    const userGenerations = await generationService.getUserGenerations(user.id);
    setGenerations(userGenerations);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setCredits(10);
    setShowUserMenu(false);
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

  const processGeneration = async (postId: string, params: GenerateVideoParams, generationId: string | null) => {
    try {
      const { url } = await generateVideo(params);
      updateFeedPost(postId, { videoUrl: url, status: PostStatus.SUCCESS });

      if (generationId) {
        await generationService.updateGenerationSuccess(generationId, url);
        loadGenerations();
      }
    } catch (error) {
      console.error('Video generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
      updateFeedPost(postId, { status: PostStatus.ERROR, errorMessage: errorMessage });

      if (generationId) {
        await generationService.updateGenerationError(generationId, errorMessage);
        loadGenerations();
      }

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
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setCredits(prev => prev + credits);

    const { error } = await supabase
      .from('user_profiles')
      .update({ credits: credits + (userProfile?.credits || 0) })
      .eq('id', user.id);

    if (!error) {
      await loadUserProfile(user.id);
    }

    setShowPricingModal(false);
    setErrorToast(`Successfully added ${credits} credits!`);
  };

  const handleDeleteGeneration = async (id: string) => {
    const success = await generationService.deleteGeneration(id);
    if (success) {
      setGenerations(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleGenerate = useCallback(async (params: GenerateVideoParams) => {
    if (!user) {
      setShowAuthModal(true);
      setErrorToast('Please sign in to generate videos.');
      return;
    }

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

    const newCredits = credits - 1;
    setCredits(newCredits);

    await supabase
      .from('user_profiles')
      .update({ credits: newCredits })
      .eq('id', user.id);

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

    // Create generation record in database
    const generationId = await generationService.createGeneration(user.id, params);

    // Prepend to feed immediately
    setFeed(prev => [newPost, ...prev]);

    // Start generation in background
    processGeneration(newPostId, params, generationId);

  }, [credits, user]);

  const handleApiKeyDialogContinue = async () => {
    setShowApiKeyDialog(false);
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    }
  };

  const handleGetStarted = () => {
    setShowLanding(false);
    setShowAuthModal(true);
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

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

      <ScriptGeneratorModal
        isOpen={showScriptGenerator}
        onClose={() => setShowScriptGenerator(false)}
        onUseScene={(scene) => setPromptFromScript(scene)}
      />

      <AIToolsHub
        isOpen={showAITools}
        onClose={() => setShowAITools(false)}
        onUsePrompt={(prompt) => setPromptFromScript(prompt)}
      />

      <VideoAnalysisModal
        isOpen={showVideoAnalysis}
        onClose={() => setShowVideoAnalysis(false)}
      />

      <StyleTransferModal
        isOpen={showStyleTransfer}
        onClose={() => setShowStyleTransfer(false)}
        onUseStyle={(prompt) => setPromptFromScript(prompt)}
      />

      <StoryboardModal
        isOpen={showStoryboard}
        onClose={() => setShowStoryboard(false)}
        onUseFrame={(prompt) => setPromptFromScript(prompt)}
      />

      <RepurposingModal
        isOpen={showRepurposing}
        onClose={() => setShowRepurposing(false)}
        onUseVariation={(prompt) => setPromptFromScript(prompt)}
      />

      <CompetitorAnalysisModal
        isOpen={showCompetitor}
        onClose={() => setShowCompetitor(false)}
        onUseSuggestion={(prompt) => setPromptFromScript(prompt)}
      />

      <BrandGuidelinesModal
        isOpen={showBrandGuidelines}
        onClose={() => setShowBrandGuidelines(false)}
        userId={user?.id || null}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={async () => {
          await checkAuth();
          setErrorToast('Successfully signed in!');
        }}
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
                    {user ? (
                      <div className="relative">
                        <button
                          onClick={() => setShowUserMenu(!showUserMenu)}
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl hover:bg-white/10 transition-all text-white"
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm font-medium">{userProfile?.username || 'User'}</span>
                        </button>

                        {showUserMenu && (
                          <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 transition-all text-left"
                            >
                              <LogOut className="w-4 h-4" />
                              <span className="text-sm">Sign Out</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full backdrop-blur-xl transition-all text-white font-medium shadow-lg"
                      >
                        Sign In
                      </button>
                    )}
                    <div className="relative">
                      <button
                        onClick={() => setShowToolsMenu(!showToolsMenu)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full backdrop-blur-xl transition-all text-white shadow-lg shadow-purple-500/20"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">AI Tools</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {showToolsMenu && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                          <div className="p-2 space-y-1">
                            <button
                              onClick={() => { setShowAITools(true); setShowToolsMenu(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-all text-left"
                            >
                              <Target className="w-5 h-5 text-purple-400" />
                              <div>
                                <div className="font-semibold text-sm">Campaign Builder</div>
                                <div className="text-xs text-white/60">Multi-video campaigns</div>
                              </div>
                            </button>
                            <button
                              onClick={() => { setShowScriptGenerator(true); setShowToolsMenu(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-all text-left"
                            >
                              <FileText className="w-5 h-5 text-blue-400" />
                              <div>
                                <div className="font-semibold text-sm">Script Generator</div>
                                <div className="text-xs text-white/60">AI-written scenes</div>
                              </div>
                            </button>
                            <button
                              onClick={() => { setShowStoryboard(true); setShowToolsMenu(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-all text-left"
                            >
                              <Film className="w-5 h-5 text-indigo-400" />
                              <div>
                                <div className="font-semibold text-sm">Storyboard</div>
                                <div className="text-xs text-white/60">Frame-by-frame planning</div>
                              </div>
                            </button>
                            <button
                              onClick={() => { setShowVideoAnalysis(true); setShowToolsMenu(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-all text-left"
                            >
                              <Search className="w-5 h-5 text-cyan-400" />
                              <div>
                                <div className="font-semibold text-sm">Video Analysis</div>
                                <div className="text-xs text-white/60">Quality insights</div>
                              </div>
                            </button>
                            <button
                              onClick={() => { setShowStyleTransfer(true); setShowToolsMenu(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-all text-left"
                            >
                              <Palette className="w-5 h-5 text-pink-400" />
                              <div>
                                <div className="font-semibold text-sm">Style Transfer</div>
                                <div className="text-xs text-white/60">Extract & reuse styles</div>
                              </div>
                            </button>
                            <button
                              onClick={() => { setShowRepurposing(true); setShowToolsMenu(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-all text-left"
                            >
                              <RefreshCw className="w-5 h-5 text-green-400" />
                              <div>
                                <div className="font-semibold text-sm">Repurposing</div>
                                <div className="text-xs text-white/60">Multi-platform adapt</div>
                              </div>
                            </button>
                            <button
                              onClick={() => { setShowCompetitor(true); setShowToolsMenu(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-all text-left"
                            >
                              <Target className="w-5 h-5 text-orange-400" />
                              <div>
                                <div className="font-semibold text-sm">Competitor Intel</div>
                                <div className="text-xs text-white/60">Analyze & differentiate</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setShowBrandGuidelines(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl hover:bg-white/10 transition-all text-white"
                    >
                      <Palette className="w-4 h-4" />
                      <span className="text-sm font-medium">Brand</span>
                    </button>

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

      <BottomPromptBar
        onGenerate={handleGenerate}
        initialPrompt={promptFromScript}
        onPromptUsed={() => setPromptFromScript('')}
      />
    </div>
  );
};

export default App;
