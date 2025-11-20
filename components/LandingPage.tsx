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
  BarChart
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "AI Video Generation",
      description: "Create stunning videos from text prompts using Google's Veo AI technology",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Script Generator",
      description: "AI-powered script writing that creates engaging video narratives instantly",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Style Transfer",
      description: "Extract and apply visual styles across your video projects seamlessly",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Campaign Builder",
      description: "Plan and execute multi-video campaigns with AI-driven strategies",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Predict and track video performance with advanced AI insights",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Repurposing",
      description: "Adapt content for multiple platforms automatically in seconds",
      color: "from-yellow-500 to-orange-500"
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
    { label: "Videos Generated", value: "50K+", icon: <Video className="w-5 h-5" /> },
    { label: "Active Creators", value: "10K+", icon: <Users className="w-5 h-5" /> },
    { label: "Avg. Generation Time", value: "< 2 min", icon: <Clock className="w-5 h-5" /> },
    { label: "User Satisfaction", value: "4.9/5", icon: <Star className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.15),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(168,85,247,0.15),_transparent_50%)]"></div>
      </div>

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clapperboard className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold tracking-wide">VEO CAMEOS</span>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full font-semibold transition-all shadow-lg shadow-blue-500/25"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full">
              <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Powered by Google Veo AI
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              Create Stunning
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Videos
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into professional videos with AI. Generate, edit, and optimize content for maximum impact.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full font-semibold text-lg transition-all shadow-2xl shadow-blue-500/50 flex items-center gap-2"
              >
                Start Creating Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-semibold text-lg transition-all flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="text-blue-400">{stat.icon}</div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
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
            <h2 className="text-5xl font-bold mb-4">Powerful AI Tools</h2>
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
                className="relative group"
              >
                <div className="h-full p-8 bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-2xl hover:border-white/20 transition-all">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>

                  {hoveredFeature === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl -z-10 blur-xl"
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
            <h2 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
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
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className={`h-full p-8 rounded-2xl border ${plan.popular ? 'border-blue-500 bg-gradient-to-b from-blue-500/10 to-purple-500/10' : 'border-white/10 bg-white/5'}`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <div className="text-sm text-gray-400 mb-6">{plan.credits}</div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={onGetStarted}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25' : 'bg-white/10 hover:bg-white/20'}`}
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
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
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-blue-400" />
            <h2 className="text-5xl font-bold mb-6">Ready to Transform Your Content?</h2>
            <p className="text-xl text-gray-400 mb-12">
              Join thousands of creators using AI to produce amazing videos
            </p>
            <button
              onClick={onGetStarted}
              className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full font-bold text-xl transition-all shadow-2xl shadow-blue-500/50 flex items-center gap-3 mx-auto"
            >
              Start Creating Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Clapperboard className="w-6 h-6 text-white" />
              <span className="text-xl font-bold">VEO CAMEOS</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 VEO CAMEOS. Powered by Google Veo AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
