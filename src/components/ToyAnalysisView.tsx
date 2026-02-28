import React from 'react';
import { ToyAnalysis } from '../types';
import { Info, Tag, Users, PackageSearch } from 'lucide-react';
import { motion } from 'motion/react';

interface ToyAnalysisViewProps {
  analysis: ToyAnalysis | null;
  isLoading: boolean;
}

export const ToyAnalysisView: React.FC<ToyAnalysisViewProps> = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200 animate-pulse">
        <div className="h-4 w-32 bg-zinc-200 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-8 bg-zinc-200 rounded" />
          <div className="h-20 bg-zinc-200 rounded" />
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 text-zinc-400 mb-2">
          <PackageSearch size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">AI Analysis Result</span>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900">{analysis.name}</h2>
        <p className="text-zinc-600 mt-2 text-sm leading-relaxed">{analysis.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Tag size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Category</span>
          </div>
          <p className="text-sm font-semibold text-zinc-900">{analysis.category}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Users size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Target Audience</span>
          </div>
          <p className="text-sm font-semibold text-zinc-900">{analysis.targetAudience}</p>
        </div>
      </div>
    </motion.div>
  );
};
