import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Wand2,
  Sparkles,
  Video,
  Share2,
  ArrowRight,
  CheckCircle,
  Target,
  Layers,
  Zap,
  BarChart,
  Settings,
  Upload,
  Edit3,
  Play,
  Download
} from 'lucide-react';

interface HowItWorksPageProps {
  onBack: () => void;
  onGetStarted: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onBack, onGetStarted }) => {
  const mainSteps = [
    {
      number: "01",
      icon: <Users className="w-12 h-12" />,
      title: "Upload Your Character",
      description: "Upload your own character image or use one of the sample profiles to create personalized video cameos.",
      details: [
        "Upload custom character images (PNG, JPG, WEBP)",
        "Use 5 sample character profiles included",
        "Organize your characters for easy access",
        "Reuse characters across multiple videos"
      ],
      image: "character-selection",
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "02",
      icon: <Wand2 className="w-12 h-12" />,
      title: "Describe the Action",
      description: "Write a simple text prompt describing what action or scenario you want your character to perform in the video.",
      details: [
        "Use natural language descriptions",
        "AI suggests improvements to your prompt",
        "Apply brand voice and tone guidelines",
        "Save frequently used prompts as templates"
      ],
      image: "prompt-writing",
      color: "from-emerald-500 to-green-500"
    },
    {
      number: "03",
      icon: <Settings className="w-12 h-12" />,
      title: "Customize Settings",
      description: "Fine-tune your video with advanced options like resolution, aspect ratio, style preferences, and platform optimization.",
      details: [
        "Choose resolution (720p to 4K)",
        "Select aspect ratio for platform",
        "Apply visual style presets",
        "Set generation speed preference"
      ],
      image: "customization",
      color: "from-orange-500 to-amber-500"
    },
    {
      number: "04",
      icon: <Sparkles className="w-12 h-12" />,
      title: "AI Generates Your Video",
      description: "Google's Veo AI creates your personalized character cameo in minutes with stunning quality and realistic character movements.",
      details: [
        "Standard generation: 1-2 minutes",
        "Fast mode available: 30-60 seconds",
        "Real-time progress tracking",
        "Preview available during generation"
      ],
      image: "generation",
      color: "from-violet-500 to-blue-500"
    },
    {
      number: "05",
      icon: <Video className="w-12 h-12" />,
      title: "Review & Edit",
      description: "Preview your generated character cameo, make adjustments if needed, and access AI-powered insights and recommendations.",
      details: [
        "Full preview with playback controls",
        "Performance predictions and insights",
        "Suggested improvements",
        "Regenerate with modifications"
      ],
      image: "review",
      color: "from-teal-500 to-cyan-500"
    },
    {
      number: "06",
      icon: <Share2 className="w-12 h-12" />,
      title: "Download & Share",
      description: "Download your character cameo in your preferred format and resolution, ready to share across all your platforms.",
      details: [
        "Multiple format options (MP4, WebM, MOV)",
        "Direct social media sharing",
        "Organize in collections",
        "Track performance metrics"
      ],
      image: "export",
      color: "from-pink-500 to-red-500"
    }
  ];

  const workflows = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Quick Single Character Cameo",
      description: "Create a standalone character video in minutes",
      steps: ["Select character", "Write action prompt", "Generate", "Download"],
      time: "2-5 minutes",
      bestFor: "Social media posts, quick content"
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Multi-Character Campaign",
      description: "Plan and execute campaigns with multiple character videos",
      steps: ["Create campaign", "Select characters for each video", "Generate batch", "Track performance"],
      time: "15-30 minutes",
      bestFor: "Marketing campaigns, series content"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Brand-Aligned Character Content",
      description: "Create character cameos that match your brand perfectly",
      steps: ["Set brand guidelines", "Choose characters", "Generate with brand enforcement", "Review compliance"],
      time: "10-20 minutes",
      bestFor: "Professional brands, agencies"
    }
  ];

  const aiTools = [
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "Script Generator",
      description: "AI creates engaging action descriptions for your characters",
      when: "When you need creative action ideas"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Performance Predictor",
      description: "Predicts how your character cameo will perform before publishing",
      when: "Before finalizing your video"
    },
    {
      icon: <Edit3 className="w-6 h-6" />,
      title: "Prompt Enhancer",
      description: "Automatically improves your action prompts for better results",
      when: "During prompt writing"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Style Transfer",
      description: "Applies consistent visual styles across character videos",
      when: "For brand consistency"
    }
  ];

  const tips = [
    {
      title: "Write Clear Action Descriptions",
      description: "Be specific about what action you want your character to perform. Instead of 'running', try 'character running through a forest trail at sunset'."
    },
    {
      title: "Use Character Collections",
      description: "Organize your characters into collections by theme, project, or campaign for faster access and better workflow."
    },
    {
      title: "Leverage AI Tools",
      description: "Let the AI Script Generator create action ideas, and use the Prompt Enhancer to optimize your descriptions automatically."
    },
    {
      title: "Test Different Styles",
      description: "Experiment with various visual styles and save successful ones as presets for future character cameos."
    },
    {
      title: "Optimize for Platforms",
      description: "Use platform-specific settings to ensure your character cameos look perfect on Instagram, TikTok, YouTube, etc."
    },
    {
      title: "Batch Process When Possible",
      description: "Generate multiple character videos at once for campaigns to save time and maintain consistency."
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
              <Play className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Complete Workflow Guide
              </span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            How to Create
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Character Cameos
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Follow our simple 6-step process to create stunning personalized character videos with AI in minutes
          </p>
        </motion.div>

        <section className="mb-32">
          <div className="space-y-24">
            {mainSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className={`grid md:grid-cols-2 gap-12 items-start ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                    <div className="flex items-start gap-6 mb-6">
                      <div className="text-6xl font-bold text-white/10">{step.number}</div>
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${step.color}`}>
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                    <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="space-y-3">
                      {step.details.map((detail, dIndex) => (
                        <div
                          key={dIndex}
                          className="flex items-start gap-3 text-gray-300"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                    <div className={`aspect-video rounded-2xl bg-gradient-to-br ${step.color} opacity-20 backdrop-blur-3xl border border-white/10 flex items-center justify-center`}>
                      <div className="text-center text-white/50">
                        <div className="text-4xl font-bold mb-2">Step {step.number}</div>
                        <div className="text-sm">{step.image}</div>
                      </div>
                    </div>
                  </div>
                </div>
                {index < mainSteps.length - 1 && (
                  <div className="flex justify-center my-12">
                    <div className="w-px h-16 bg-gradient-to-b from-blue-500/50 to-emerald-500/50"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Common Workflows</h2>
            <p className="text-xl text-gray-400">Different ways to use Smart Cameos for character videos</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {workflows.map((workflow, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-8 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl"
              >
                <div className="text-blue-400 mb-4">{workflow.icon}</div>
                <h3 className="text-xl font-bold mb-3">{workflow.title}</h3>
                <p className="text-gray-400 mb-6">{workflow.description}</p>
                <div className="space-y-3 mb-6">
                  {workflow.steps.map((step, sIndex) => (
                    <div key={sIndex} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
                        {sIndex + 1}
                      </div>
                      <span className="text-sm text-gray-300">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Time Required:</span>
                    <span className="text-emerald-400 font-semibold">{workflow.time}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Best for: {workflow.bestFor}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Assistance</h2>
            <p className="text-xl text-gray-400">Smart tools that help you create better character videos</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {aiTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl backdrop-blur-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500">
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                    <p className="text-gray-400 mb-3">{tool.description}</p>
                    <div className="text-sm text-blue-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      {tool.when}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pro Tips</h2>
            <p className="text-xl text-gray-400">Expert advice for creating exceptional character cameos</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl backdrop-blur-xl hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-bold">{tip.title}</h3>
                </div>
                <p className="text-sm text-gray-400">{tip.description}</p>
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
              Ready to Start Creating?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Follow this simple workflow and create your first character cameo in minutes
            </p>
            <button
              onClick={onGetStarted}
              className="group px-12 py-6 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 rounded-full font-bold text-xl transition-all shadow-2xl shadow-blue-500/40 flex items-center gap-3 mx-auto"
            >
              Start Creating Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </section>
      </div>
    </div>
  );
};
