'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Eye, 
  Code, 
  Copy, 
  Sparkles,
  AlertCircle,
  Download,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  Brain,
  Palette,
  Layers,
  FileCode,
  ExternalLink,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import Toast from '../../../components/Toast';

interface CloneResult {
  clone_id: string;
  status: 'processing' | 'completed' | 'error';
  url: string;
  html?: string;
  css?: string;
  javascript?: string;
  error?: string;
  created_at: string;
  completed_at?: string;
}

interface ProgressStage {
  name: string;
  description: string;
  completed: boolean;
  current: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

export default function ClonePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<CloneResult | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeTab, setActiveTab] = useState('preview');
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [copiedCode, setCopiedCode] = useState('');
  const [showToast, setShowToast] = useState(false);

  const cloneId = params.id as string;
  const url = searchParams.get('url') || '';

  const stages: ProgressStage[] = [
    { 
      name: 'Spinning up preview...', 
      description: 'Initializing AI analysis pipeline and setting up environment...', 
      completed: false, 
      current: false, 
      icon: Sparkles,
      color: 'from-orchid-500 to-purple-600'
    },
    { 
      name: 'Analyzing website structure', 
      description: 'Crawling and extracting page data, assets, and content...', 
      completed: false, 
      current: false, 
      icon: Globe,
      color: 'from-purple-500 to-violet-600'
    },
    { 
      name: 'Understanding design patterns', 
      description: 'AI is analyzing layout, components, and user interactions...', 
      completed: false, 
      current: false, 
      icon: Brain,
      color: 'from-violet-500 to-orchid-600'
    },
    { 
      name: 'Processing visual elements', 
      description: 'Extracting colors, typography, spacing, and visual hierarchy...', 
      completed: false, 
      current: false, 
      icon: Palette,
      color: 'from-orchid-600 to-purple-500'
    },
    { 
      name: 'Generating clean code', 
      description: 'Creating semantic HTML, optimized CSS, and JavaScript...', 
      completed: false, 
      current: false, 
      icon: FileCode,
      color: 'from-purple-600 to-violet-500'
    },
    { 
      name: 'Finalizing and optimizing', 
      description: 'Polishing output and ensuring responsive compatibility...', 
      completed: false, 
      current: false, 
      icon: Zap,
      color: 'from-violet-600 to-orchid-500'
    }
  ];

  // Enhanced progress calculation
  const updateProgressStages = (elapsed: number) => {
    const totalTime = 45000; // 45 seconds estimated total time
    const stageTime = totalTime / stages.length;
    
    return stages.map((stage, index) => {
      const stageStart = index * stageTime;
      const stageEnd = (index + 1) * stageTime;
      
      return {
        ...stage,
        completed: elapsed > stageEnd,
        current: elapsed >= stageStart && elapsed <= stageEnd && !result
      };
    });
  };

  const calculateProgress = (elapsed: number) => {
    if (result?.status === 'completed') return 100;
    if (result?.status === 'error') return 0;
    
    const totalTime = 45000;
    const baseProgress = Math.min((elapsed / totalTime) * 90, 90);
    const randomFactor = Math.sin(elapsed / 2000) * 3;
    return Math.min(baseProgress + randomFactor, 95);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);
      setProgress(calculateProgress(elapsed));
    }, 100);

    return () => clearInterval(timer);
  }, [startTime, result]);

  useEffect(() => {
    if (!cloneId) return;

    let pollCount = 0;
    const maxPolls = 150;
    
    const pollStatus = async () => {
      try {
        if (result || pollCount >= maxPolls) return;
        
        pollCount++;
        const response = await fetch(`http://localhost:8000/clone/${cloneId}/status`);
        if (response.ok) {
          const data = await response.json();
          
          if (data.status === 'completed') {
            const resultResponse = await fetch(`http://localhost:8000/clone/${cloneId}/result`);
            if (resultResponse.ok) {
              const resultData = await resultResponse.json();
              setResult(resultData);
              setProgress(100);
            }
          } else if (data.status === 'error') {
            setError(data.error || 'Unknown error occurred');
          }
        }
      } catch (err) {
        console.error('Error polling status:', err);
      }
    };

    const getPollingInterval = () => {
      if (pollCount < 10) return 2000;
      if (pollCount < 30) return 3000;
      return 5000;
    };

    const scheduleNextPoll = () => {
      if (result || pollCount >= maxPolls) return;
      
      setTimeout(() => {
        pollStatus().then(() => {
          if (!result && pollCount < maxPolls) {
            scheduleNextPoll();
          }
        });
      }, getPollingInterval());
    };
    
    pollStatus().then(() => {
      if (!result && pollCount < maxPolls) {
        scheduleNextPoll();
      }
    });

    const timeout = setTimeout(() => {
      if (!result) {
        setError('Clone process timed out. Please try again.');
      }
    }, 300000);

    return () => clearTimeout(timeout);
  }, [cloneId, result]);

  const currentStages = updateProgressStages(elapsedTime);
  
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const estimatedTimeLeft = Math.max(0, 45 - Math.floor(elapsedTime / 1000));

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      setShowToast(true);
      setTimeout(() => {
        setCopiedCode('');
        setShowToast(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadCode = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const downloadAllFiles = async () => {
    if (!result) {
      console.error('No result data available for download');
      return;
    }
    
    console.log('Starting ZIP download process...');
    
    try {
      // Dynamic import of JSZip
      console.log('Loading JSZip...');
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      let filesAdded = 0;
      
      // Add HTML file
      if (result.html && result.html.trim()) {
        zip.file('index.html', result.html);
        filesAdded++;
        console.log('Added index.html to ZIP');
      }
      
      // Add CSS file
      if (result.css && result.css.trim()) {
        zip.file('styles.css', result.css);
        filesAdded++;
        console.log('Added styles.css to ZIP');
      }
      
      // Add JavaScript file
      if (result.javascript && result.javascript.trim()) {
        zip.file('script.js', result.javascript);
        filesAdded++;
        console.log('Added script.js to ZIP');
      }
      
      // Add a complete HTML file with embedded CSS and JS
      if (result.html) {
        const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloned Website</title>
  <style>
${result.css || '/* No CSS styles */'}
  </style>
</head>
<body>
${result.html}
  <script>
${result.javascript || '// No JavaScript'}
  </script>
</body>
</html>`;
        zip.file('complete.html', completeHtml);
        filesAdded++;
        console.log('Added complete.html to ZIP');
      }
      
      console.log(`ZIP contains ${filesAdded} files. Generating ZIP...`);
      
      // Generate ZIP file and download
      const content = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6
        }
      });
      
      console.log('ZIP generated successfully, size:', content.size, 'bytes');
      
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cloned-website.zip';
      document.body.appendChild(a);
      a.click();
      
      console.log('ZIP download initiated: cloned-website.zip');
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
    } catch (error) {
      console.error('Error creating ZIP file:', error);
      console.log('Falling back to individual file downloads...');
      
      // Fallback: download files individually if JSZip fails
      const files = [
        { content: result.html || '', filename: 'index.html', type: 'text/html' },
        { content: result.css || '', filename: 'styles.css', type: 'text/css' },
        { content: result.javascript || '', filename: 'script.js', type: 'text/javascript' }
      ];
      
      files.forEach((file, index) => {
        if (file.content.trim()) {
          setTimeout(() => {
            console.log(`Downloading individual file: ${file.filename}`);
            const blob = new Blob([file.content], { type: file.type });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }, index * 100);
        }
      });
    }
  };

  const getDeviceFrameClass = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-80 h-[600px]';
      case 'tablet':
        return 'w-[600px] h-[800px]';
      default:
        return 'w-full h-[800px]';
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 -left-20 w-96 h-96 bg-orchid-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
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
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          className="sticky top-0 z-50 bg-dark-950/90 backdrop-blur-xl"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2 px-4 py-2 bg-dark-900/80 hover:bg-dark-800 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </motion.button>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orchid-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-white">Website Clone</h1>
                    <p className="text-sm text-gray-400 truncate max-w-md">{url}</p>
                  </div>
                </div>
              </div>

              {result?.status === 'completed' && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Completed
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {!result ? (
            /* Progress Section */
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Progress Header */}
              <div className="text-center">
                <motion.div
                  className="inline-flex items-center gap-2 px-6 py-3 bg-dark-900/80 backdrop-blur-xl rounded-full mb-8"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <RefreshCw className="w-5 h-5 text-orchid-400 animate-spin" />
                  <span className="text-orchid-300 font-medium">AI Processing in Progress</span>
                </motion.div>
                
                {/* Large Status Display */}
                <motion.div 
                  className="max-w-md mx-auto mb-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-dark-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-neural">
                    <motion.div 
                      className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-orchid-500 to-purple-600 flex items-center justify-center shadow-glow-orchid"
                      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {currentStages.find(s => s.current)?.icon ? 
                        React.createElement(currentStages.find(s => s.current)!.icon, { className: "w-10 h-10 text-white" }) :
                        <RefreshCw className="w-10 h-10 text-white animate-spin" />
                      }
                    </motion.div>
                    
                    <motion.h2 
                      className="text-2xl font-bold text-white mb-3"
                      key={currentStages.find(s => s.current)?.name || 'processing'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {currentStages.find(s => s.current)?.name || 'Processing...'}
                    </motion.h2>
                    
                    <motion.p 
                      className="text-gray-400 leading-relaxed"
                      key={currentStages.find(s => s.current)?.description || 'working'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      {currentStages.find(s => s.current)?.description || 'AI is working on your website clone...'}
                    </motion.p>
                  </div>
                </motion.div>

                <h3 className="text-xl text-gray-300 mb-2">
                  Cloning Your Website
                </h3>
                <p className="text-gray-400">
                  Our AI is analyzing and recreating your website with pixel-perfect accuracy
                </p>
              </div>

              {/* Progress Bar */}
              <div className="max-w-3xl mx-auto">
                <motion.div 
                  className="bg-dark-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-neural"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orchid-500 to-purple-600 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-lg font-semibold text-white">Overall Progress</span>
                    </div>
                    <motion.span 
                      className="text-2xl font-bold text-orchid-400"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {Math.round(progress)}%
                    </motion.span>
                  </div>
                  
                  <div className="relative mb-6">
                    <div className="w-full bg-dark-800 rounded-full h-4 overflow-hidden shadow-inner">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-orchid-500 via-purple-500 to-violet-500 rounded-full relative overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            ease: "linear" 
                          }}
                        />
                      </motion.div>
                    </div>
                    
                    {/* Progress indicators */}
                    <div className="absolute -top-1 left-0 w-full flex justify-between">
                      {[0, 20, 40, 60, 80, 100].map((mark) => (
                        <motion.div
                          key={mark}
                          className={`w-2 h-6 rounded-full ${
                            progress >= mark ? 'bg-orchid-400' : 'bg-dark-700'
                          }`}
                          animate={progress >= mark ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.5 }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <motion.div 
                      className="flex items-center gap-2 px-4 py-2 bg-dark-800/60 rounded-xl"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Clock className="w-4 h-4 text-orchid-400" />
                      <span className="text-gray-300">Elapsed: {formatTime(elapsedTime)}</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-2 px-4 py-2 bg-orchid-500/10 rounded-xl"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Sparkles className="w-4 h-4 text-orchid-400" />
                      <span className="text-orchid-300 font-medium">
                        ETA: ~{estimatedTimeLeft}s
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {currentStages.map((stage, index) => (
                  <motion.div
                    key={stage.name}
                    className={`relative p-6 rounded-2xl backdrop-blur-sm transition-all duration-500 ${
                      stage.completed 
                        ? 'bg-dark-900/60 shadow-glow-orchid' 
                        : stage.current
                        ? 'bg-dark-900/80 shadow-orchid'
                        : 'bg-dark-900/40'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          stage.completed 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : stage.current
                            ? `bg-gradient-to-r ${stage.color} text-white`
                            : 'bg-dark-800 text-gray-500'
                        }`}
                        animate={stage.current ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {stage.completed ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          React.createElement(stage.icon, { className: "w-6 h-6" })
                        )}
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-2 ${
                          stage.completed ? 'text-emerald-400' 
                          : stage.current ? 'text-orchid-400' 
                          : 'text-gray-400'
                        }`}>
                          {stage.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {stage.description}
                        </p>
                      </div>
                      
                      {stage.current && (
                        <motion.div
                          className="w-2 h-2 bg-orchid-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="max-w-2xl mx-auto bg-red-500/10 rounded-2xl p-6 backdrop-blur-sm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-400 mb-1">Error</h3>
                        <p className="text-red-300">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Results Section */
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Results Header */}
              <div className="text-center">
                <motion.div
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/20 backdrop-blur-xl rounded-full mb-6"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">Clone Completed Successfully</span>
                </motion.div>
                
                <h2 className="text-3xl font-bold text-white mb-2">
                  Your Website Clone is Ready
                </h2>
                <p className="text-gray-400">
                  Preview your cloned website and download the generated code
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex justify-center">
                <div className="flex items-center bg-dark-900/80 backdrop-blur-xl rounded-2xl p-1">
                  {[
                    { id: 'preview', label: 'Preview', icon: Eye },
                    { id: 'html', label: 'HTML', icon: Code },
                    { id: 'css', label: 'CSS', icon: Palette },
                    { id: 'js', label: 'JavaScript', icon: FileCode }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-orchid-600 to-purple-600 text-white shadow-orchid'
                          : 'text-gray-400 hover:text-white hover:bg-dark-800'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {React.createElement(tab.icon, { className: "w-4 h-4" })}
                      <span>{tab.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[600px]"
                >
                  {activeTab === 'preview' ? (
                    /* Preview Tab */
                    <div className="space-y-6">
                      {/* Device Selector */}
                      <div className="flex justify-center">
                        <div className="flex items-center bg-dark-900/80 backdrop-blur-xl rounded-xl p-1">
                          {[
                            { id: 'desktop', label: 'Desktop', icon: Monitor },
                            { id: 'tablet', label: 'Tablet', icon: Tablet },
                            { id: 'mobile', label: 'Mobile', icon: Smartphone }
                          ].map((device) => (
                            <motion.button
                              key={device.id}
                              onClick={() => setPreviewDevice(device.id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                previewDevice === device.id
                                  ? 'bg-orchid-600 text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-dark-800'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {React.createElement(device.icon, { className: "w-4 h-4" })}
                              <span>{device.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Preview Frame */}
                      <div className="flex justify-center">
                        <motion.div 
                          className={`bg-dark-900 rounded-2xl p-6 shadow-neural ${getDeviceFrameClass()}`}
                          layout
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-inner">
                            {result?.html ? (
                              <iframe
                                srcDoc={`
                                  <!DOCTYPE html>
                                  <html>
                                    <head>
                                      <style>${result.css || ''}</style>
                                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    </head>
                                    <body>
                                      ${result.html}
                                      <script>${result.javascript || ''}</script>
                                    </body>
                                  </html>
                                `}
                                className="w-full h-full border-0"
                                title="Website Preview"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                  <p>No preview available</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>

                      {/* Preview Actions */}
                      <div className="flex justify-center gap-4">
                        <motion.button
                          onClick={() => window.open(url, '_blank')}
                          className="flex items-center gap-2 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View Original</span>
                        </motion.button>
                        
                        {result?.html && (
                          <motion.button
                            onClick={downloadAllFiles}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orchid-600 to-purple-600 hover:from-orchid-700 hover:to-purple-700 text-white rounded-xl shadow-orchid hover:shadow-glow-orchid transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Download className="w-4 h-4" />
                            <span>Download All Files</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Code Tabs */
                    <div className="bg-dark-900/60 backdrop-blur-xl rounded-2xl">
                      <div className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orchid-500 to-purple-600 rounded-lg flex items-center justify-center">
                            {activeTab === 'html' && <Code className="w-4 h-4 text-white" />}
                            {activeTab === 'css' && <Palette className="w-4 h-4 text-white" />}
                            {activeTab === 'js' && <FileCode className="w-4 h-4 text-white" />}
                          </div>
                          <h3 className="text-lg font-semibold text-white">
                            {activeTab.toUpperCase()} Code
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <motion.button
                            onClick={() => {
                              const content = activeTab === 'html' ? result?.html : 
                                           activeTab === 'css' ? result?.css : 
                                           result?.javascript;
                              if (content) copyToClipboard(content, activeTab);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </motion.button>
                          
                          <motion.button
                            onClick={() => {
                              const content = activeTab === 'html' ? result?.html : 
                                           activeTab === 'css' ? result?.css : 
                                           result?.javascript;
                              const extension = activeTab === 'html' ? 'html' : 
                                              activeTab === 'css' ? 'css' : 'js';
                              if (content) downloadCode(content, `cloned-website.${extension}`);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-orchid-600 hover:bg-orchid-700 text-white rounded-lg shadow-orchid transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <pre className="bg-dark-950 rounded-xl p-6 overflow-auto max-h-96 text-sm">
                          <code className="text-gray-300 font-mono leading-relaxed">
                            {activeTab === 'html' && (result?.html || 'No HTML code available')}
                            {activeTab === 'css' && (result?.css || 'No CSS code available')}
                            {activeTab === 'js' && (result?.javascript || 'No JavaScript code available')}
                          </code>
                        </pre>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <Toast 
            message={`${copiedCode.toUpperCase()} code copied to clipboard!`}
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 