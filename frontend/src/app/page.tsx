'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Zap, 
  Smartphone, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  Brain,
  Code2,
  Palette,
  Layers,
  Stars,
  Wand2,
  Bot
} from 'lucide-react';

// Floating particles component
const FloatingParticles = () => {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [mounted, setMounted] = useState(false);
  const particles = Array.from({ length: 20 }, (_, i) => i);
  
  useEffect(() => {
    setMounted(true);
    // Set dimensions after component mounts
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Update dimensions on resize
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // Don't render anything during SSR
  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />;
  }
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => {
        const initialX = Math.random() * dimensions.width;
        const initialY = Math.random() * dimensions.height;
        const animateX = Math.random() * dimensions.width;
        const animateY = Math.random() * dimensions.height;
        
        return (
          <motion.div
            key={particle}
            className="absolute w-1 h-1 bg-orchid-400/30 rounded-full"
            initial={{
              x: initialX,
              y: initialY,
            }}
            animate={{
              x: animateX,
              y: animateY,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
};

// Neural network background
const NeuralBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [nodes] = useState(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
  })));

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything during SSR
  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden opacity-10" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {nodes.map((node, i) => (
          <g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="0.5"
              fill="currentColor"
              className="text-orchid-400"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
            {i < nodes.length - 1 && (
              <motion.line
                x1={node.x}
                y1={node.y}
                x2={nodes[i + 1].x}
                y2={nodes[i + 1].y}
                stroke="currentColor"
                strokeWidth="0.1"
                className="text-orchid-500"
                animate={{
                  opacity: [0.1, 0.5, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const router = useRouter();

  const handleClone = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setIsCloning(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/clone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          enhanced: true
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/clone/${data.clone_id}?url=${encodeURIComponent(url)}`);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to start cloning process');
        setIsCloning(false);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Backend server is not running. Please start the backend server first.');
      } else {
        setError('Network error. Please try again.');
      }
      setIsCloning(false);
    }
  };

  const quickTests = [
    { name: 'Portfolio Site', url: 'https://aniketsharma.vercel.app/', color: 'orchid' },
    { name: 'Example.com', url: 'https://example.com', color: 'purple' },
    { name: 'Demo Page', url: 'https://httpbin.org/html', color: 'violet' }
  ];

  const features = [
    { 
      icon: Brain, 
      title: 'AI-Powered Analysis', 
      description: 'Advanced machine learning algorithms analyze and understand website structure, design patterns, and user interactions with precision.',
      gradient: 'from-orchid-500 to-purple-600',
      delay: 0
    },
    { 
      icon: Zap, 
      title: 'Lightning Fast Processing', 
      description: 'Optimized processing pipeline delivers pixel-perfect clones in under 60 seconds with real-time progress tracking.',
      gradient: 'from-purple-500 to-violet-600',
      delay: 0.2
    },
    { 
      icon: Palette, 
      title: 'Perfect Design Recreation', 
      description: 'Accurately captures colors, typography, layouts, and animations to create an identical visual experience.',
      gradient: 'from-violet-500 to-orchid-600',
      delay: 0.4
    },
    { 
      icon: Smartphone, 
      title: 'Responsive Excellence', 
      description: 'Automatically generates mobile-first, responsive layouts that work flawlessly across all devices and screen sizes.',
      gradient: 'from-orchid-600 to-purple-500',
      delay: 0.6
    },
    { 
      icon: Code2, 
      title: 'Clean Code Output', 
      description: 'Produces well-structured, semantic HTML, optimized CSS, and modern JavaScript following industry best practices.',
      gradient: 'from-purple-600 to-violet-500',
      delay: 0.8
    },
    { 
      icon: Layers, 
      title: 'Component Architecture', 
      description: 'Intelligently breaks down complex layouts into reusable components with proper separation of concerns.',
      gradient: 'from-violet-600 to-orchid-500',
      delay: 1.0
    }
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Neural Network Background */}
        <NeuralBackground />
        
        {/* Floating Particles */}
        <FloatingParticles />
        
        {/* Gradient Orbs */}
        <motion.div 
          className="absolute top-1/4 -left-20 w-96 h-96 bg-orchid-500/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 5
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-60 h-60 bg-violet-500/15 rounded-full blur-3xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 bg-dark-900/80 backdrop-blur-xl rounded-full text-sm text-orchid-300 mb-8 shadow-glow-orchid"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Bot className="w-5 h-5 text-orchid-400" />
            </motion.div>
            <span className="text-orchid-300 font-medium">
              AI-Powered Website Cloning Technology
            </span>
            <Stars className="w-4 h-4 text-purple-400" />
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="text-white">Clone Any</span>
            <motion.span 
              className="block text-transparent bg-gradient-to-r from-orchid-400 via-purple-400 to-violet-400 bg-clip-text bg-[length:200%_100%] animate-text-shimmer"
              style={{ 
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Website
            </motion.span>
            <motion.span
              className="block text-4xl md:text-5xl lg:text-6xl text-gray-300 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Instantly
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Transform any website into
            <span className="text-orchid-400 font-medium"> clean, responsive code </span>
            with the power of advanced AI. 
            <span className="text-purple-400"> No coding required.</span>
          </motion.p>
        </motion.div>

        {/* Main Input Card */}
        <motion.div 
          className="w-full max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orchid-500/50 to-purple-500/50 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-dark-900/90 backdrop-blur-xl rounded-2xl shadow-neural p-8">
              <div className="space-y-6">
                {/* URL Input */}
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-gray-200">
                    Website URL
                    <span className="text-orchid-400 ml-1">*</span>
                  </label>
                  <motion.div 
                    className="relative group"
                    animate={focusedInput ? { scale: 1.02 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orchid-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onFocus={() => setFocusedInput(true)}
                        onBlur={() => setFocusedInput(false)}
                        placeholder="https://example.com"
                        className="w-full pl-6 pr-6 py-5 rounded-xl focus:ring-4 focus:ring-orchid-500/20 transition-all duration-300 text-lg bg-dark-800/80 backdrop-blur-sm placeholder:text-gray-400 text-white"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="bg-red-500/10 rounded-xl p-4 backdrop-blur-sm"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        </div>
                        <p className="text-red-400 font-medium">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Clone Button */}
                <motion.button
                  onClick={handleClone}
                  disabled={isCloning || !url.trim()}
                  className={`group relative w-full py-5 px-8 rounded-xl text-lg font-semibold transition-all duration-300 overflow-hidden ${
                    isCloning || !url.trim()
                      ? 'bg-dark-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orchid-600 to-purple-600 text-white shadow-orchid-lg hover:shadow-glow-orchid'
                  }`}
                  whileHover={!isCloning && url.trim() ? { scale: 1.02 } : {}}
                  whileTap={!isCloning && url.trim() ? { scale: 0.98 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  {/* Button glow effect */}
                  {!isCloning && url.trim() && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orchid-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  )}
                  
                  <div className="relative flex items-center justify-center gap-3">
                    {isCloning ? (
                      <>
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{
                                duration: 1.4,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                        <span>Starting AI Analysis...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-6 h-6" />
                        <span>Clone with AI</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Quick Test Links */}
                <div className="pt-6">
                  <p className="text-sm text-gray-400 mb-4 text-center font-medium">
                    Try these examples
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {quickTests.map((test, index) => (
                      <motion.button
                        key={test.name}
                        onClick={() => setUrl(test.url)}
                        className="group px-4 py-2 text-sm bg-dark-800/70 hover:bg-dark-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200 backdrop-blur-sm"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                      >
                        <span className="relative">
                          {test.name}
                          <div className="absolute inset-0 bg-gradient-to-r from-orchid-400/0 via-orchid-400/20 to-orchid-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="w-full max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          {/* Featured capability */}
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            <motion.div
              key={currentFeature}
              className="relative max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative bg-dark-900/60 backdrop-blur-xl rounded-2xl p-8 shadow-neural">
                <motion.div 
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${features[currentFeature].gradient} flex items-center justify-center mb-6 mx-auto shadow-glow-orchid`}
                  animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {React.createElement(features[currentFeature].icon, { className: "w-8 h-8 text-white" })}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {features[currentFeature].title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {features[currentFeature].description}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setCurrentFeature(index)}
              >
                <div className={`h-full bg-dark-900/40 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 ${
                  currentFeature === index 
                    ? 'shadow-glow-orchid' 
                    : 'hover:shadow-orchid-lg'
                }`}>
                  <motion.div 
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {React.createElement(feature.icon, { className: "w-6 h-6 text-white" })}
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-orchid-300 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-200">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
