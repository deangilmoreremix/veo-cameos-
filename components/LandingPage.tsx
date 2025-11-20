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
      color: "from-green-500 to-emerald-500"
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
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Predict and track video performance with advanced AI insights",
      color: "from-blue-500 to-violet-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Repurposing",
      description: "Adapt content for multiple platforms automatically in seconds",
      color: "from-amber-500 to-orange-500"
    }
  ];

  const benefits = [
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "Effortless Creation",
      description: "Generate professional videos in minutes, not hours"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Brand Consistency",
      description: "Maintain visual identity across all your content"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multi-Platform Ready",
      description: "Optimize for TikTok, YouTube, Instagram, and more"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Data-Driven Results",
      description: "Get AI predictions to maximize engagement"
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

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah",
      quote: "This platform cut my video production time by 80%. The AI tools are game-changing."
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Director",
      image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus",
      quote: "Our campaign performance improved dramatically. The predictions are incredibly accurate."
    },
    {
      name: "Emma Thompson",
      role: "Agency Owner",
      image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Emma",
      quote: "Finally, a tool that scales with our business. The brand guidelines feature is perfect."
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
              <span className="text-2xl font-bold tracking-wide">VEO CAMEOS</span>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 rounded-full font-semibold transition-all shadow-lg shadow-blue-500/25"
            >
              Get Started
            </button>
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
              Create Stunning
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                AI Videos
              </span>
              <br />
              <span className="text-4xl md:text-5xl lg:text-6xl text-white/80">
                In Minutes
              </span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your ideas into professional videos with AI. Generate, edit, and optimize content with cutting-edge technology designed for creators and businesses.
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

      <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose VEO CAMEOS?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built for creators who demand quality, speed, and results
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
              Join thousands of creators using AI to produce amazing videos
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
