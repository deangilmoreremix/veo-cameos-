import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clapperboard,
  Sparkles,
  Video,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Users,
  Clock,
  Palette,
  Brain,
  BarChart,
  Film,
  Wand2,
  Layers,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigateToFeatures?: () => void;
  onNavigateToHowItWorks?: () => void;
  onNavigateToAITools?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onNavigateToFeatures, onNavigateToHowItWorks, onNavigateToAITools }) => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "Personalized Character Cameos",
      description: "Create personalized cameos with preset or custom characters performing actions from your text prompts",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Custom Character Upload",
      description: "Upload your own character images and create unlimited personalized video cameos with them",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Script Generator",
      description: "AI-powered script writing that creates engaging action descriptions for your characters",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Style Transfer",
      description: "Apply consistent visual styles across multiple personalized cameos",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Video Analysis",
      description: "Analyze your personalized cameos and get AI insights on performance and engagement",
      color: "from-blue-500 to-violet-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Quick Generation",
      description: "Generate personalized character cameos in minutes with Google's Veo AI",
      color: "from-amber-500 to-orange-500"
    }
  ];

  const benefits = [
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "Simple Prompts",
      description: "Just describe what you want your character to do"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Your Characters",
      description: "Use preset characters or upload your own"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Generation",
      description: "Create short video clips in minutes"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Professional Quality",
      description: "Powered by Google's advanced Veo AI"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      credits: "100 credits",
      features: [
        "100 video generations",
        "HD quality output",
        "Basic AI tools",
        "Email support",
        "30-day history"
      ]
    },
    {
      name: "Professional",
      price: "$99",
      credits: "500 credits",
      features: [
        "500 video generations",
        "4K quality output",
        "All AI tools unlocked",
        "Priority support",
        "Unlimited history",
        "Custom branding"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$299",
      credits: "2000 credits",
      features: [
        "2000 video generations",
        "8K quality output",
        "Advanced AI features",
        "Dedicated support",
        "Team collaboration",
        "API access",
        "Custom integrations"
      ]
    }
  ];

  const stats = [
    { label: "Videos Generated", value: "10K+", icon: <Video className="w-5 h-5" /> },
    { label: "Active Creators", value: "2K+", icon: <Users className="w-5 h-5" /> },
    { label: "Avg. Generation Time", value: "< 2 min", icon: <Clock className="w-5 h-5" /> },
    { label: "Powered By", value: "Veo AI", icon: <Sparkles className="w-5 h-5" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Social Media Manager",
      image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah",
      quote: "Creating character cameos used to take hours. Now I can produce personalized videos in minutes with consistent quality across all our campaigns."
    },
    {
      name: "Michael Torres",
      role: "Content Director",
      image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Michael",
      quote: "The character library and AI tools make it easy to maintain brand consistency while experimenting with creative ideas. Our engagement rates doubled."
    },
    {
      name: "Jessica Patel",
      role: "Creative Agency Founder",
      image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jessica",
      quote: "Smart Cameos transformed how we deliver for clients. Character-driven videos that used to cost thousands now take minutes to create with better results."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.12),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(16,185,129,0.10),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,0,0,0.8),_transparent_100%)]"></div>

        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <Clapperboard className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-wide">Smart Cameos</span>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={onNavigateToFeatures}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={onNavigateToHowItWorks}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={onNavigateToAITools}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                AI Tools
              </button>
              <button
                onClick={onGetStarted}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 rounded-full font-semibold transition-all shadow-lg shadow-blue-500/25"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center relative z-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-6 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-full backdrop-blur-xl"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Powered by Google Veo AI
                </span>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              Create Personalized
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Character Cameos with AI
              </span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform text into personalized character videos in seconds. Upload your own character images, describe any action, and watch AI bring them to life with stunning realism powered by Google Veo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 rounded-full font-semibold text-lg transition-all shadow-2xl shadow-blue-500/30 flex items-center gap-2"
              >
                Start Creating Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-semibold text-lg transition-all flex items-center gap-2 backdrop-blur-xl">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-xl"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="text-blue-400">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                See It In Action
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real character cameos created with Smart Cameos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                videoUrl: 'https://storage.googleapis.com/sideprojects-asronline/veo-cameos/cameo-alisa.mp4',
                description: 'Sipping coffee at a Parisian cafe',
                creator: 'alisa_fortin'
              },
              {
                videoUrl: 'https://storage.googleapis.com/sideprojects-asronline/veo-cameos/cameo-omar.mp4',
                description: 'At a llama petting zoo',
                creator: 'osanseviero'
              },
              {
                videoUrl: 'https://storage.googleapis.com/sideprojects-asronline/veo-cameos/cameo-ammaar.mp4',
                description: 'At a red carpet ceremony',
                creator: 'ammaar'
              },
              {
                videoUrl: 'https://storage.googleapis.com/sideprojects-asronline/veo-cameos/cameo-logan.mp4',
                description: 'Vibe coding on a mountain',
                creator: 'OfficialLoganK'
              },
              {
                videoUrl: 'https://storage.googleapis.com/sideprojects-asronline/veo-cameos/cameo-kat.mp4',
                description: 'Exploring a majestic temple',
                creator: 'kat_kampf'
              },
              {
                videoUrl: 'https://storage.googleapis.com/sideprojects-asronline/veo-cameos/cameo-josh.mp4',
                description: 'On the Google Keynote stage',
                creator: 'joshwoodward'
              }
            ].map((demo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all backdrop-blur-xl">
                  <video
                    src={demo.videoUrl}
                    className="w-full aspect-video object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white font-semibold mb-1">{demo.description}</p>
                      <p className="text-gray-400 text-sm">by @{demo.creator}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full text-xs font-semibold">
                    Veo AI
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 rounded-full font-semibold text-lg transition-all shadow-2xl shadow-blue-500/30 flex items-center gap-2 mx-auto"
            >
              Create Your Own Character Cameo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Powerful AI Tools
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to create, optimize, and scale your video content
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <div className="h-full p-8 bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-2xl hover:border-white/20 transition-all backdrop-blur-xl">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-5`}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>

                  {hoveredFeature === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-10 rounded-2xl -z-10 blur-2xl`}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                How Smart Cameos Works
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Create professional character videos in 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl font-bold">
                    1
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-black" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Upload Character</h3>
                <p className="text-gray-400 leading-relaxed">
                  Upload your own character image (or use sample profiles). Organize your character collection for quick access.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-3xl font-bold">
                    2
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-black" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Describe Action</h3>
                <p className="text-gray-400 leading-relaxed">
                  Write what you want your character to do. AI enhances your prompt and suggests improvements automatically.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-3xl font-bold">
                    3
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Generate Video</h3>
                <p className="text-gray-400 leading-relaxed">
                  Google Veo AI creates your character cameo in under 90 seconds. Download in HD, 4K, or 8K quality.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <button
              onClick={onNavigateToHowItWorks}
              className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all flex items-center gap-2 mx-auto"
            >
              <span className="text-lg">See Complete Workflow</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Smart Cameos?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built for creators who want personalized character-driven videos with AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl backdrop-blur-xl text-center"
              >
                <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 mb-4">
                  <div className="text-blue-400">{benefit.icon}</div>
                </div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Perfect For Every Creator
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From solo creators to agencies, Smart Cameos scales with your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl backdrop-blur-xl"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Content Creators</h3>
                  <p className="text-gray-400">Social media managers, influencers, and content creators</p>
                </div>
              </div>
              <ul className="space-y-3 mt-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Create engaging character content for Instagram, TikTok, YouTube</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Generate multiple character variations in minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Maintain consistent character presence across platforms</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl backdrop-blur-xl"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Marketing Teams</h3>
                  <p className="text-gray-400">Agencies, brands, and marketing departments</p>
                </div>
              </div>
              <ul className="space-y-3 mt-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Launch character-driven campaigns faster</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Ensure brand consistency with guidelines enforcement</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Predict performance before publishing</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl backdrop-blur-xl"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500">
                  <Film className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Video Producers</h3>
                  <p className="text-gray-400">Production companies and video agencies</p>
                </div>
              </div>
              <ul className="space-y-3 mt-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Produce character videos at scale</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Plan multi-scene character storyboards</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Export in multiple formats and resolutions</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl backdrop-blur-xl"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Entrepreneurs</h3>
                  <p className="text-gray-400">Startups, solopreneurs, and small businesses</p>
                </div>
              </div>
              <ul className="space-y-3 mt-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Create professional character videos without a team</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Build character-driven brand identity</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Cost-effective alternative to hiring videographers</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Creators Say</h2>
            <p className="text-xl text-gray-400">Join thousands of satisfied users</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-8 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-white/20"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-400">Choose the plan that fits your needs</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: plan.popular ? 1.05 : 1.02, y: -8 }}
                className="relative"
              >
                {plan.popular && (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full text-sm font-semibold shadow-lg"
                  >
                    Most Popular
                  </motion.div>
                )}
                <div className={`h-full p-8 rounded-2xl border backdrop-blur-xl transition-all ${plan.popular ? 'border-blue-500 bg-gradient-to-b from-blue-500/10 via-emerald-500/5 to-transparent shadow-2xl shadow-blue-500/20' : 'border-white/10 bg-gradient-to-b from-white/5 to-transparent'}`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">{plan.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <div className="text-sm text-gray-400 mb-6 px-3 py-1 bg-white/5 rounded-full inline-block">{plan.credits}</div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={onGetStarted}
                    className={`w-full py-4 rounded-xl font-semibold transition-all ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg shadow-blue-500/25' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <p className="text-xl text-gray-400">Everything you need to know about Smart Cameos</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl"
            >
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
                  ?
                </div>
                What is a character cameo?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A character cameo is a short video where a character of your choice performs a specific action you describe. Upload your own character images to create personalized videos with them.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl"
            >
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
                  ?
                </div>
                How long does generation take?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Most character videos generate in under 90 seconds using our standard mode. Fast mode can produce results in 30-60 seconds, though with slightly reduced quality control.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl"
            >
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
                  ?
                </div>
                Can I use my own characters?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Yes! You can upload your own character images (PNG, JPG, WEBP up to 10MB). Create unlimited custom characters to match your brand, personas, or creative vision.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl"
            >
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
                  ?
                </div>
                What video quality can I export?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Export in multiple resolutions from 720p HD up to 8K. Choose from various aspect ratios (16:9, 9:16, 1:1, 4:5) and formats (MP4, WebM, MOV) optimized for each platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl"
            >
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
                  ?
                </div>
                How does the credit system work?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Each character video generation costs 1 credit. Credits never expire and you can purchase additional credits anytime. New accounts start with 100 free credits to get you started.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl"
            >
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
                  ?
                </div>
                What AI tools are included?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                All plans include AI Script Generator, Prompt Enhancement, Performance Predictor, Video Analysis, Style Transfer, Campaign Builder, Storyboarding, and Repurposing tools.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl"
            >
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
                  ?
                </div>
                Can I use videos commercially?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Yes! All generated character videos are yours to use commercially in social media, marketing, advertising, websites, and more. No attribution required.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl"
            >
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
                  ?
                </div>
                Is there a free trial?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every new account receives 100 free credits to explore the platform and create character videos. No credit card required to start, and credits never expire.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-8"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-blue-500/50">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Join thousands of creators using AI to produce personalized character cameos
            </p>
            <button
              onClick={onGetStarted}
              className="group px-12 py-6 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 rounded-full font-bold text-xl transition-all shadow-2xl shadow-blue-500/40 flex items-center gap-3 mx-auto"
            >
              Start Creating Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 py-12 px-6 backdrop-blur-xl bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <Clapperboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Smart Cameos</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Smart Cameos. Powered by Google Veo AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
