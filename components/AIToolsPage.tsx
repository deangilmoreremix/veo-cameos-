import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Wand2,
  BarChart,
  Palette,
  Target,
  TrendingUp,
  Film,
  Layers,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Globe,
  Users,
  Clock,
  Shield,
  Code,
  Lightbulb
} from 'lucide-react';

interface AIToolsPageProps {
  onBack: () => void;
  onGetStarted: () => void;
}

export const AIToolsPage: React.FC<AIToolsPageProps> = ({ onBack, onGetStarted }) => {
  const aiTools = [
    {
      icon: <Wand2 className="w-12 h-12" />,
      title: "AI Script Generator",
      tagline: "Creative Action Ideas on Demand",
      description: "Generate engaging action descriptions for your characters instantly. Our AI understands context, brand voice, and platform requirements to create compelling scenarios.",
      capabilities: [
        "Natural language action generation",
        "Brand voice integration",
        "Platform-specific optimization",
        "Multiple creative variations",
        "Context-aware suggestions",
        "Save as reusable templates"
      ],
      useCases: [
        "Social media character content",
        "Marketing campaign character videos",
        "Educational character demonstrations",
        "Entertainment and storytelling"
      ],
      technology: "Powered by Google Gemini Pro with custom fine-tuning for character video generation",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Prompt Enhancement AI",
      tagline: "Optimize Every Action Description",
      description: "Automatically improve your action prompts for better character video results. AI analyzes and enhances clarity, visual detail, and technical specifications.",
      capabilities: [
        "Automatic prompt optimization",
        "Visual detail enhancement",
        "Technical parameter suggestions",
        "Style consistency enforcement",
        "Character motion refinement",
        "Scene composition improvement"
      ],
      useCases: [
        "First-time character video creators",
        "Improving existing prompts",
        "Maintaining quality standards",
        "Learning better prompt writing"
      ],
      technology: "Advanced NLP with character video generation expertise and 10M+ prompt database",
      color: "from-violet-500 to-blue-500"
    },
    {
      icon: <BarChart className="w-12 h-12" />,
      title: "Performance Predictor",
      tagline: "Know Before You Publish",
      description: "AI predicts how your character cameos will perform across different platforms before you publish. Get engagement forecasts and optimization suggestions.",
      capabilities: [
        "Engagement rate prediction",
        "Platform-specific forecasts",
        "Audience sentiment analysis",
        "Optimal posting time suggestions",
        "A/B testing recommendations",
        "Competitor benchmarking"
      ],
      useCases: [
        "Pre-launch character video testing",
        "Campaign performance planning",
        "Content strategy optimization",
        "ROI maximization"
      ],
      technology: "Machine learning trained on 1M+ character video performance metrics across platforms",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: <Film className="w-12 h-12" />,
      title: "Video Analysis Engine",
      tagline: "Deep Character Video Insights",
      description: "Comprehensive AI analysis of your character cameos providing actionable insights on quality, engagement potential, and improvements.",
      capabilities: [
        "Quality score assessment",
        "Character motion analysis",
        "Scene composition evaluation",
        "Brand compliance checking",
        "Improvement suggestions",
        "Competitive analysis"
      ],
      useCases: [
        "Post-generation character video review",
        "Quality assurance",
        "Content optimization",
        "Team feedback"
      ],
      technology: "Computer vision and deep learning models trained on professional character video content",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "Style Transfer AI",
      tagline: "Consistent Character Visual Identity",
      description: "Apply and maintain consistent visual styles across all your character cameos. AI ensures brand consistency and visual cohesion.",
      capabilities: [
        "Visual style extraction",
        "Cross-character video application",
        "Brand guideline enforcement",
        "Color palette management",
        "Mood and tone consistency",
        "Custom style creation"
      ],
      useCases: [
        "Brand identity maintenance",
        "Series of character videos",
        "Multi-character campaigns",
        "Professional character productions"
      ],
      technology: "Neural style transfer with character video-specific adaptations",
      color: "from-pink-500 to-violet-500"
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: "Campaign Builder AI",
      tagline: "Strategic Character Video Planning",
      description: "Plan and execute multi-character video campaigns with AI assistance. Get strategic recommendations and automated workflow optimization.",
      capabilities: [
        "Campaign strategy generation",
        "Character video sequencing",
        "Cross-platform coordination",
        "Timeline optimization",
        "Resource allocation",
        "Performance tracking"
      ],
      useCases: [
        "Product launch character campaigns",
        "Seasonal character content series",
        "Brand awareness character videos",
        "Multi-platform character strategies"
      ],
      technology: "AI planning engine with marketing expertise and character video campaign data",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: <Layers className="w-12 h-12" />,
      title: "Content Repurposing AI",
      tagline: "One Character Video, Multiple Formats",
      description: "Automatically adapt your character cameos for different platforms, formats, and audiences. AI handles technical conversions and optimizations.",
      capabilities: [
        "Automatic format conversion",
        "Platform-specific adaptations",
        "Aspect ratio optimization",
        "Length adjustments",
        "Character video re-editing",
        "Multi-version generation"
      ],
      useCases: [
        "Cross-platform character distribution",
        "Format experimentation",
        "Audience targeting",
        "Efficiency maximization"
      ],
      technology: "Intelligent character video processing with platform knowledge base",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Competitor Analysis AI",
      tagline: "Stay Ahead with Character Videos",
      description: "Analyze competitor character video strategies and get recommendations to differentiate and improve your content.",
      capabilities: [
        "Competitor character video tracking",
        "Trend identification",
        "Gap analysis",
        "Differentiation strategies",
        "Best practice learning",
        "Performance comparison"
      ],
      useCases: [
        "Market research for character content",
        "Strategy development",
        "Competitive advantage",
        "Trend adoption"
      ],
      technology: "Web scraping and analysis with character video content understanding",
      color: "from-blue-500 to-violet-500"
    }
  ];

  const benefits = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "10x Faster Creation",
      description: "AI tools reduce character video creation time from hours to minutes"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Higher Performance",
      description: "AI-optimized character cameos see 3x better engagement on average"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Brand Safe",
      description: "Automatic brand compliance and guideline enforcement"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Always Learning",
      description: "AI models continuously improve from millions of character videos"
    }
  ];

  const integrations = [
    {
      category: "Character Video Generation",
      tools: ["Google Veo 2", "Custom character models", "Scene understanding AI", "Motion synthesis"]
    },
    {
      category: "Content Intelligence",
      tools: ["Google Gemini Pro", "Natural language processing", "Computer vision", "Predictive analytics"]
    },
    {
      category: "Performance Analytics",
      tools: ["Multi-platform APIs", "Engagement tracking", "Sentiment analysis", "Trend detection"]
    },
    {
      category: "Creative Assistance",
      tools: ["Script generation", "Style transfer", "Prompt enhancement", "Brand voice AI"]
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
              <Brain className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                AI-Powered Tools
              </span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              AI Tools
            </span>
            <br />
            for Character Videos
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive suite of AI-powered tools designed specifically for character video creation, optimization, and performance
          </p>
        </motion.div>

        <section className="mb-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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

          <div className="space-y-24">
            {aiTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="p-8 md:p-12 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl backdrop-blur-xl">
                  <div className="grid md:grid-cols-5 gap-8">
                    <div className="md:col-span-2">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${tool.color} mb-6`}>
                        {tool.icon}
                      </div>
                      <h3 className="text-3xl font-bold mb-2">{tool.title}</h3>
                      <div className="text-blue-400 font-semibold mb-4">{tool.tagline}</div>
                      <p className="text-gray-400 text-lg leading-relaxed mb-6">
                        {tool.description}
                      </p>
                      <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-start gap-2 text-sm text-gray-400">
                          <Code className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div>{tool.technology}</div>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-3 space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-yellow-400" />
                          Capabilities
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {tool.capabilities.map((capability, cIndex) => (
                            <div
                              key={cIndex}
                              className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5"
                            >
                              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-300">{capability}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-blue-400" />
                          Use Cases
                        </h4>
                        <div className="space-y-2">
                          {tool.useCases.map((useCase, uIndex) => (
                            <div
                              key={uIndex}
                              className="flex items-center gap-3 text-sm text-gray-400"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                              {useCase}
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={onGetStarted}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 rounded-lg font-semibold transition-all flex items-center gap-2 group"
                      >
                        Try This Tool
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Technology Stack</h2>
            <p className="text-xl text-gray-400">Built on cutting-edge AI and machine learning</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl backdrop-blur-xl"
              >
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  {integration.category}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {integration.tools.map((tool, tIndex) => (
                    <div
                      key={tIndex}
                      className="p-3 bg-white/5 rounded-lg border border-white/5 text-sm text-gray-300 text-center"
                    >
                      {tool}
                    </div>
                  ))}
                </div>
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
              Experience AI-Powered Character Creation
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Get access to all these powerful AI tools and create exceptional character cameos
            </p>
            <button
              onClick={onGetStarted}
              className="group px-12 py-6 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 rounded-full font-bold text-xl transition-all shadow-2xl shadow-blue-500/40 flex items-center gap-3 mx-auto"
            >
              Start Using AI Tools
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </section>
      </div>
    </div>
  );
};
