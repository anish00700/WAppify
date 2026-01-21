import { BehaviorBadge } from '@/lib/advancedAnalytics';
import { motion } from 'framer-motion';

interface BehaviorCardProps {
    participant: string;
    badges: BehaviorBadge[];
}

export const BehaviorCard = ({ participant, badges }: BehaviorCardProps) => {
    if (!badges.length) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                    {participant[0]?.toUpperCase()}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{participant}</h3>
                    <p className="text-xs text-gray-500">{badges.length} Detected Trait{badges.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            <div className="space-y-3">
                {badges.map((badge) => (
                    <div
                        key={badge.id}
                        className={`p-3 rounded-xl border flex items-start gap-3 ${badge.color} bg-opacity-50 border-opacity-60`}
                    >
                        <span className="text-2xl">{badge.icon}</span>
                        <div>
                            <p className="font-bold text-sm mb-0.5">{badge.label}</p>
                            <p className="text-xs opacity-90 leading-tight">{badge.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
