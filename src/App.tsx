import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { StyleSelector } from './components/StyleSelector';
import { DesignDisplay } from './components/DesignDisplay';
import { ToyAnalysisView } from './components/ToyAnalysisView';
import { PackagingStyle, ToyAnalysis } from './types';
import { analyzeToy, generatePackaging } from './services/geminiService';
import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PackagingStyle>(PackagingStyle.FUTURISTIC);
  const [analysis, setAnalysis] = useState<ToyAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-analyze when image is uploaded
  useEffect(() => {
    if (selectedImage && !analysis && !isAnalyzing) {
      handleAnalyze();
    }
  }, [selectedImage]);

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeToy(selectedImage);
      setAnalysis(result);
    } catch (err: any) {
      console.error("Analysis error:", err);
      if (err?.message?.includes("429") || err?.message?.includes("RESOURCE_EXHAUSTED") || err?.message?.includes("quota")) {
        setError("The analysis engine is currently busy. We're retrying automatically, but if it persists, please wait a minute and try again.");
      } else {
        setError("Failed to analyze the toy. Please try a different image.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!analysis) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generatePackaging(analysis, selectedStyle, selectedImage || undefined);
      setGeneratedImage(result.imageUrl);
    } catch (err: any) {
      console.error("Generation error:", err);
      if (err?.message?.includes("429") || err?.message?.includes("RESOURCE_EXHAUSTED") || err?.message?.includes("quota")) {
        setError("The design engine is currently busy due to high demand. We're retrying automatically, but if it persists, please wait a minute and try again.");
      } else {
        setError("Failed to generate design. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setAnalysis(null);
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ImageUpload 
                selectedImage={selectedImage} 
                onImageSelect={setSelectedImage} 
                onClear={handleClear}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StyleSelector 
                selectedStyle={selectedStyle} 
                onStyleSelect={setSelectedStyle} 
              />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600"
              >
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </div>

          {/* Middle Column: Analysis & Info */}
          <div className="lg:col-span-3 space-y-6">
            <ToyAnalysisView 
              analysis={analysis} 
              isLoading={isAnalyzing} 
            />
            
            <div className="p-6 bg-zinc-900 rounded-2xl text-white space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Design Tips</h3>
              <ul className="space-y-3">
                {[
                  "White areas in your photo are identified as packaging",
                  "Large themed titles are automatically generated",
                  "Detailed toy descriptions are added to panels",
                  "Try 'Toys R Us' for a classic retail look",
                  "Use 'Pop Mart' for trendy designer art toys",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                    <div className="w-1 h-1 rounded-full bg-zinc-500 mt-1.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DesignDisplay 
                imageUrl={generatedImage} 
                isLoading={isGenerating} 
                onGenerate={handleGenerate}
                canGenerate={!!analysis}
              />
            </motion.div>
          </div>

        </div>
      </main>

      {/* Footer / Credits */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-zinc-200 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 bg-zinc-900 rounded flex items-center justify-center text-white">
              <span className="text-[10px] font-bold">TB</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">ToyBox Designer v1.0</span>
          </div>
          <p className="text-xs text-zinc-400 font-medium">
            Powered by Gemini 2.5 Flash Image & Gemini 3 Flash
          </p>
        </div>
      </footer>
    </div>
  );
}
