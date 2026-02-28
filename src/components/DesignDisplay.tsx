import React from 'react';
import { Download, Share2, Wand2, Loader2, MessageSquarePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DesignDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  onGenerate: () => void;
  canGenerate: boolean;
  refinementPrompt: string;
  onRefinementChange: (value: string) => void;
  onRefine: () => void;
}

export const DesignDisplay: React.FC<DesignDisplayProps> = ({ 
  imageUrl, 
  isLoading, 
  onGenerate, 
  canGenerate,
  refinementPrompt,
  onRefinementChange,
  onRefine
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold uppercase tracking-wider text-zinc-500">
          3. Final Packaging Design
        </label>
        {imageUrl && !isLoading && (
          <div className="flex gap-2">
            <button className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">
              <Share2 size={18} />
            </button>
            <a 
              href={imageUrl} 
              download="toy-packaging-design.png"
              className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <Download size={18} />
            </a>
          </div>
        )}
      </div>

      <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-100 border-2 border-zinc-200 shadow-inner group">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-50/80 backdrop-blur-sm z-10"
            >
              <Loader2 size={48} className="text-zinc-900 animate-spin" />
              <div className="text-center">
                <p className="font-bold text-zinc-900">Crafting your design...</p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Applying style layers</p>
              </div>
            </motion.div>
          ) : imageUrl ? (
            <motion.div key="image" className="relative w-full h-full">
              <motion.img
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                src={imageUrl}
                alt="Generated packaging design"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-zinc-900 shadow-sm border border-zinc-200 uppercase tracking-wider">
                  Studio Lighting
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-zinc-900 shadow-sm border border-zinc-200 uppercase tracking-wider">
                  White Background
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-zinc-900 shadow-sm border border-zinc-200 uppercase tracking-wider">
                  Fixed Angle
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-zinc-900 shadow-sm border border-zinc-200 uppercase tracking-wider">
                  Themed Typography
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-zinc-900 shadow-sm border border-zinc-200 uppercase tracking-wider">
                  Description Panel
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="w-20 h-20 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-400 mb-6">
                <Wand2 size={40} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Ready to Design</h3>
              <p className="text-sm text-zinc-500 max-w-xs">
                Upload a toy photo and select a style to generate professional packaging concepts.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onGenerate}
        disabled={!canGenerate || isLoading}
        className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <Loader2 size={24} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 size={24} />
            Generate Design
          </>
        )}
      </button>

      {imageUrl && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 text-zinc-400">
            <MessageSquarePlus size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Refine Design</span>
          </div>
          <p className="text-xs text-zinc-500">
            Want to change something? Describe your modifications below (e.g., "Make the background blue", "Add more stars", "Change font to bold").
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={refinementPrompt}
              onChange={(e) => onRefinementChange(e.target.value)}
              placeholder="Describe changes..."
              className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
              onKeyDown={(e) => e.key === 'Enter' && onRefine()}
            />
            <button
              onClick={onRefine}
              disabled={!refinementPrompt.trim() || isLoading}
              className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 disabled:opacity-50 transition-all"
            >
              Apply
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
