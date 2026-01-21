import { ChatMessage } from '@/lib/chatParser';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { DigitalBookPDF } from './DigitalBookPDF';

interface DigitalBookProps {
    messages: ChatMessage[];
    title: string;
    onClose: () => void;
}

export function DigitalBookPreview({ messages, title, onClose }: DigitalBookProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-300">
            {/* Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-card/80 backdrop-blur-md border-b text-foreground shadow-sm z-[110]">
                <div className="flex items-center gap-4">
                    <Button onClick={onClose} variant="ghost" className="gap-2 pl-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <div className="h-6 w-px bg-border" />
                    <h2 className="font-serif text-xl font-bold">{title}</h2>
                </div>

                <div className="flex gap-4">
                    {/* Direct Download Button */}
                    <PDFDownloadLink
                        document={<DigitalBookPDF messages={messages} title={title} />}
                        fileName={`${title.replace(/\s+/g, '_')}_Book.pdf`}
                        className="no-underline"
                    >
                        {({ loading }) => (
                            <Button disabled={loading} variant="default" className="shadow-sm">
                                <Download className="w-4 h-4 mr-2" />
                                {loading ? 'Generating...' : 'Download PDF'}
                            </Button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            {/* PDF Viewer - Full Screen */}
            <div className="flex-1 w-full bg-muted/30 p-4 md:p-8 overflow-hidden flex items-center justify-center">
                <PDFViewer className="w-full h-full rounded-xl shadow-2xl border bg-white" showToolbar={true}>
                    <DigitalBookPDF messages={messages} title={title} />
                </PDFViewer>
            </div>
        </div>,
        document.body
    );
}
