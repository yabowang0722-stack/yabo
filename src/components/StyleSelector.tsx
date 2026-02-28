import React from 'react';
import { PackagingStyle } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StyleSelectorProps {
  selectedStyle: PackagingStyle;
  onStyleSelect: (style: PackagingStyle) => void;
}

const STYLES = [
  { id: PackagingStyle.FUTURISTIC, label: "Futuristic", description: "Sleek & holographic", color: "bg-cyan-500" },
  { id: PackagingStyle.POP_ART, label: "Pop Art", description: "Comic book style", color: "bg-amber-500" },
  { id: PackagingStyle.VINTAGE_WOODEN, label: "Vintage Wooden", description: "Classic heirloom feel", color: "bg-orange-800" },
  { id: PackagingStyle.NEO_MODERNIST, label: "Neo-Modernist", description: "Gradients & glassmorphism", color: "bg-violet-500" },
  { id: PackagingStyle.URBAN_COLLECTIBLE, label: "Urban Art", description: "Street-style graphics", color: "bg-red-600" },
  { id: PackagingStyle.INDUSTRIAL_BRUTALIST, label: "Industrial", description: "Raw & technical", color: "bg-slate-600" },
  { id: PackagingStyle.LEGO_ICONIC, label: "LEGO Iconic", description: "Bold red & brick patterns", color: "bg-red-700" },
  { id: PackagingStyle.MATTEL_VIBRANT, label: "Mattel Vibrant", description: "Glossy & high-energy", color: "bg-pink-600" },
  { id: PackagingStyle.HASBRO_CINEMATIC, label: "Hasbro Cinematic", description: "Dramatic & gritty", color: "bg-blue-900" },
  { id: PackagingStyle.TOYSRUS_PLAYFUL, label: "Toys R Us", description: "Friendly & colorful", color: "bg-blue-500" },
  { id: PackagingStyle.POPMART_COLLECTIBLE, label: "Pop Mart", description: "Designer art toy", color: "bg-pink-400" },
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleSelect }) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold uppercase tracking-wider text-zinc-500">
        2. Choose Design Style
      </label>
      <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style.id)}
            className={cn(
              "relative flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all",
              selectedStyle === style.id
                ? "border-zinc-900 bg-zinc-900 text-white shadow-lg scale-[1.02]"
                : "border-zinc-100 bg-white text-zinc-900 hover:border-zinc-300"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg mb-3 flex items-center justify-center",
              selectedStyle === style.id ? "bg-white/20" : style.color
            )} />
            <p className="font-bold text-sm leading-tight">{style.label}</p>
            <p className={cn(
              "text-[10px] uppercase tracking-wider font-semibold mt-1",
              selectedStyle === style.id ? "text-zinc-400" : "text-zinc-500"
            )}>
              {style.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
