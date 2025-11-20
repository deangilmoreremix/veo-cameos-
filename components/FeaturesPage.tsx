import React from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Brain,
  Palette,
  BarChart,
  Wand2,
  Users,
  Target,
  TrendingUp,
  Layers,
  Zap,
  Film,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Globe,
  Clock,
  Shield,
  Workflow
} from 'lucide-react';

interface FeaturesPageProps {
  onBack: () => void;
  onGetStarted: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onBack, onGetStarted }) => {
  const coreFeatures = [
    {
      icon: <Video className="w-12 h-12" />,
      title: "Personalized Character Cameos",
      description: "Create engaging video cameos featuring characters of your choice performing custom actions from simple text prompts.",
      benefits: [
        "Upload your own custom character images",
        "Use sample profile characters",
        "Describe any action or scenario",
        "Generate HD to 4K quality videos",
        "Full creative control over character behavior"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Custom Character Management",
      description: "Upload and manage your own character images to create unlimited personalized video cameos with consistent characters.",
      benefits: [
        "Upload unlimited custom character images",
        "Organize characters into collections",
        "Save favorite characters for quick access",
        "Reuse characters across multiple videos",
        "Support for PNG, JPG, WEBP formats"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "AI Script Generator",
      description: "Let AI craft compelling action descriptions and scenarios for your characters, ensuring engaging and coherent video content.",
      benefits: [
        "Generate creative action ideas instantly",
        "Customize tone and style of actions",
        "Brand voice integration for consistency",
        "Platform-optimized action descriptions",
        "Multiple variations per request"
      ],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "Style Transfer & Consistency",
      description: "Apply and maintain consistent visual styles across all your character cameos for a cohesive brand presence.",
      benefits: [
        "Create and save custom visual styles",
        "Apply styles to multiple characters",
        "Brand guideline enforcement",
        "Color palette management",
        "Style presets for quick application"
      ],
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: <BarChart className="w-12 h-12" />,
      title: "Video Performance Analytics",
      description: "Analyze your character cameo performance with AI-powered insights and actionable recommendations.",
      benefits: [
        "Engagement prediction before publishing",
        "Platform-specific performance metrics",
        "Audience sentiment analysis",
        "Optimization recommendations",
        "Competitor benchmarking"
      ],
      color: "from-blue-500 to-violet-500"
    },
    {
      icon: <Workflow className="w-12 h-12" />,
      title: "Campaign Builder",
      description: "Plan and execute multi-video campaigns with character cameos, ensuring cohesive storytelling and maximum impact.",
      benefits: [
        "Multi-video campaign planning",
        "Character scheduling across videos",
        "Cross-platform campaign coordination",
        "Progress tracking and analytics",
        "Team collaboration tools"
      ],
      color: "from-amber-500 to-orange-500"
    }
  ];

  const advancedFeatures = [
    {
      icon: <Film className="w-8 h-8" />,
      title: "Storyboard Sequencing",
      description: "Plan frame-by-frame character actions with visual storyboards for complex video sequences.",
      useCases: ["Multi-scene character videos", "Complex action sequences", "Tutorial content", "Story-driven campaigns"]
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Platform Optimization",
      description: "Automatically optimize character cameos for different social media platforms and formats.",
      useCases: ["Instagram Reels", "TikTok videos", "YouTube Shorts", "LinkedIn content"]
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Content Repurposing",
      description: "Transform existing character cameos into multiple formats and variations for different platforms.",
      useCases: ["Format conversions", "Aspect ratio adjustments", "Platform-specific edits", "Length variations"]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Performance Predictor",
      description: "AI predicts how your character cameos will perform before you publish them.",
      useCases: ["Pre-launch testing", "A/B testing scenarios", "Engagement forecasting", "Risk assessment"]
    },
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "Prompt Enhancement",
      description: "AI automatically improves your action descriptions for better character video results.",
      useCases: ["Action clarity", "Visual detail enhancement", "Technical optimization", "Style consistency"]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Brand Guidelines Integration",
      description: "Ensure all character cameos align with your brand identity and visual standards.",
      useCases: ["Brand voice enforcement", "Visual consistency", "Tone matching", "Color palette adherence"]
    }
  ];

  const technicalSpecs = [
    {
      category: "Video Quality",
      specs: [
        "Resolution: 720p, 1080p, 4K",
        "Aspect Ratios: 16:9, 9:16, 1:1, 4:5",
        "Duration: 5-60 seconds per cameo",
        "Format: MP4, WebM, MOV"
      ]
    },
    {
      category: "Generation Speed",
      specs: [
        "Standard Mode: 1-2 minutes",
        "Fast Mode: 30-60 seconds",
        "Batch Processing: 5-10 videos simultaneously",
        "Real-time preview available"
      ]
    },
    {
      category: "Character Support",
      specs: [
        "Sample Characters: 5 profiles included",
        "Custom Characters: Unlimited uploads",
        "File Types: PNG, JPG, WEBP",
        "Max File Size: 10MB per character"
      ]
    },
    {
      category: "AI Technology",
      specs: [
        "Powered by Google Veo 2",
        "Natural language processing",
        "Advanced scene understanding",
        "Context-aware generation"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.12),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(16,185,129,0.10),_transparent_50%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={onBack}
          className="mb-8 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all flex items-center gap-2 group"
        >
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-6 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-full backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Complete Feature Overview
              </span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
            <br />
            for Character Video Creation
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to create, manage, and optimize personalized character cameos with AI technology
          </p>
        </motion.div>

        <section className="mb-32">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Core Features</h2>
          <div className="space-y-16">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
              >
                <div className="grid md:grid-cols-2 gap-8 items-start p-8 md:p-12 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl backdrop-blur-xl">
                  <div>
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <button
                      onClick={onGetStarted}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 rounded-lg font-semibold transition-all flex items-center gap-2 group"
                    >
                      Try This Feature
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, bIndex) => (
                      <div
                        key={bIndex}
                        className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Capabilities</h2>
            <p className="text-xl text-gray-400">Professional tools for serious character video creators</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-8 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl hover:border-white/20 transition-all backdrop-blur-xl"
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-6">{feature.description}</p>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-300 mb-2">Use Cases:</div>
                  {feature.useCases.map((useCase, ucIndex) => (
                    <div key={ucIndex} className="text-sm text-gray-400 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                      {useCase}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Specifications</h2>
            <p className="text-xl text-gray-400">Detailed specs and capabilities</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {technicalSpecs.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl backdrop-blur-xl"
              >
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  {spec.category}
                </h3>
                <ul className="space-y-3">
                  {spec.specs.map((item, sIndex) => (
                    <li key={sIndex} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Start creating personalized character cameos with all these powerful tools
            </p>
            <button
              onClick={onGetStarted}
              className="group px-12 py-6 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 rounded-full font-bold text-xl transition-all shadow-2xl shadow-blue-500/40 flex items-center gap-3 mx-auto"
            >
              Start Free Trial
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </section>
      </div>
    </div>
  );
};
