import React from 'react';
import { Package, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
            <Package size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">ToyBox</h1>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Designer Studio</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            <Sparkles size={14} className="text-amber-500" />
            AI Powered Design
          </div>
        </div>
      </div>
    </header>
  );
};
