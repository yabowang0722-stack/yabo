import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { resizeImage } from '../utils/imageUtils';

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, selectedImage, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = async (file: File) => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
      });
      reader.readAsDataURL(file);
      const originalBase64 = await base64Promise;
      
      // Resize to ensure it's within API limits and faster to process
      const resizedBase64 = await resizeImage(originalBase64);
      onImageSelect(resizedBase64);
    } catch (err) {
      console.error("Image processing error:", err);
      // Fallback to original if resizing fails
      const reader = new FileReader();
      reader.onloadend = () => onImageSelect(reader.result as string);
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold uppercase tracking-wider text-zinc-500">
        1. Upload Toy with Packaging Placeholder
      </label>
      
      <AnimatePresence mode="wait">
        {!selectedImage ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className="border-2 border-dashed border-zinc-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all group"
          >
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform">
              {isProcessing ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
            </div>
            <div className="text-center">
              <p className="font-semibold text-zinc-900">{isProcessing ? "Processing..." : "Upload toy photo"}</p>
              <p className="text-xs text-zinc-500 mt-1">White areas will be identified as packaging</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 group"
          >
            <img
              src={selectedImage}
              alt="Selected toy"
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={onClear}
                className="bg-white text-zinc-900 p-3 rounded-full hover:scale-110 transition-transform shadow-xl"
              >
                <X size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
