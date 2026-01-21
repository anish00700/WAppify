import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2, Check, AlertCircle } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function FileUploadZone() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const { processChat, error } = useChat();
  const navigate = useNavigate();

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.txt')) {
      return;
    }

    setUploadState('processing');
    
    try {
      const text = await file.text();
      await processChat(text);
      setUploadState('success');
      
      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch {
      setUploadState('error');
    }
  }, [processChat, navigate]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-xl mx-auto"
    >
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-48 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer group",
          isDragActive 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-primary/50 hover:bg-secondary/50",
          uploadState === 'processing' && "pointer-events-none",
          uploadState === 'success' && "border-primary bg-primary/5",
          uploadState === 'error' && "border-destructive bg-destructive/5"
        )}
      >
        <input
          type="file"
          accept=".txt"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploadState === 'processing'}
        />
        
        <AnimatePresence mode="wait">
          {uploadState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div 
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                  isDragActive 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                )}
                animate={isDragActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Upload className="w-7 h-7" />
              </motion.div>
              <div className="text-center">
                <p className="text-foreground font-medium">
                  {isDragActive ? "Drop your chat file here" : "Drop your WhatsApp export here"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse • .txt files only
                </p>
              </div>
            </motion.div>
          )}

          {uploadState === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-foreground font-medium">Processing locally...</p>
                <p className="text-sm text-muted-foreground mt-1">Analyzing your chat on device</p>
              </div>
              {/* Progress bar */}
              <div className="w-48 h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}

          {uploadState === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Check className="w-7 h-7" />
              </motion.div>
              <p className="text-foreground font-medium">Analysis complete!</p>
            </motion.div>
          )}

          {uploadState === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-destructive text-destructive-foreground flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="text-center">
                <p className="text-foreground font-medium">Something went wrong</p>
                <p className="text-sm text-destructive mt-1">{error || "Please try again"}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </label>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <FileText className="w-3.5 h-3.5" />
        <span>Export your WhatsApp chat: Chat → More → Export Chat → Without Media</span>
      </div>
    </motion.div>
  );
}
