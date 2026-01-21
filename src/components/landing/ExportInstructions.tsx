import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, FileText, Download } from 'lucide-react';

type Platform = 'ios' | 'android';

interface Step {
    text: string;
    highlights: string[];
}

const instructions: Record<Platform, Step[]> = {
    ios: [
        {
            text: 'Open the chat & tap the Contact Name at the top.',
            highlights: ['Contact Name'],
        },
        {
            text: 'Scroll down and tap Export Chat.',
            highlights: ['Export Chat'],
        },
        {
            text: 'Select "Without Media" (this keeps the file small).',
            highlights: ['Without Media'],
        },
        {
            text: 'Save to "Files" & upload the .txt file here.',
            highlights: [],
        },
    ],
    android: [
        {
            text: 'Tap the Three Dots (⋮) > More > Export Chat.',
            highlights: ['Three Dots (⋮)', 'Export Chat'],
        },
        {
            text: 'Select "Without Media".',
            highlights: ['Without Media'],
        },
        {
            text: 'Save the file & upload the .txt file here.',
            highlights: [],
        },
    ],
};

function StepText({ text, highlights }: { text: string; highlights: string[] }) {
    if (highlights.length === 0) {
        return <span>{text}</span>;
    }

    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    highlights.forEach((highlight) => {
        const index = remaining.toLowerCase().indexOf(highlight.toLowerCase());
        if (index !== -1) {
            // Add text before highlight
            if (index > 0) {
                parts.push(<span key={key++}>{remaining.substring(0, index)}</span>);
            }
            // Add highlighted text
            const actualText = remaining.substring(index, index + highlight.length);
            parts.push(
                <span key={key++} className="text-primary font-semibold">
                    {actualText}
                </span>
            );
            remaining = remaining.substring(index + highlight.length);
        }
    });

    // Add remaining text
    if (remaining) {
        parts.push(<span key={key++}>{remaining}</span>);
    }

    return <>{parts}</>;
}

export function ExportInstructions() {
    const [activePlatform, setActivePlatform] = useState<Platform>('ios');

    return (
        <section className="py-16 px-4">
            <div className="container mx-auto max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
                        <FileText className="w-4 h-4" />
                        Quick Setup Guide
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                        How to Export Your Chat
                    </h2>
                    <p className="text-muted-foreground">
                        Follow these simple steps to get your WhatsApp chat as a .txt file
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="rounded-3xl p-8 shadow-lifted border border-border/50 bg-white/70 backdrop-blur-xl"
                >
                    {/* Tab Triggers - Segmented Control */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-secondary/50">
                            <button
                                onClick={() => setActivePlatform('ios')}
                                className={`
                  relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
                  ${activePlatform === 'ios'
                                        ? 'text-white shadow-soft'
                                        : 'text-slate-500 hover:text-foreground'
                                    }
                `}
                            >
                                {activePlatform === 'ios' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary rounded-xl"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <Smartphone className="w-4 h-4" />
                                    iPhone (iOS)
                                </span>
                            </button>

                            <button
                                onClick={() => setActivePlatform('android')}
                                className={`
                  relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
                  ${activePlatform === 'android'
                                        ? 'text-white shadow-soft'
                                        : 'text-slate-500 hover:text-foreground'
                                    }
                `}
                            >
                                {activePlatform === 'android' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary rounded-xl"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <Smartphone className="w-4 h-4" />
                                    Android
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Content Area with AnimatePresence */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePlatform}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            {instructions[activePlatform].map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                    className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <p className="text-foreground leading-relaxed pt-1">
                                        <StepText text={step.text} highlights={step.highlights} />
                                    </p>
                                </motion.div>
                            ))}

                            {/* Download Tip */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/20"
                            >
                                <div className="flex items-start gap-3">
                                    <Download className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground mb-1">
                                            Pro Tip
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            The export creates a{' '}
                                            <code className="px-1.5 py-0.5 rounded bg-secondary text-primary font-mono text-xs">
                                                chat.txt
                                            </code>{' '}
                                            file. Make sure to select "Without Media" to keep the file size
                                            small and processing fast!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
