import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  delay?: number;
  color?: string;
  subtitle?: string;
}

export const KPICard = ({ title, value, icon: Icon, trend, delay = 0, color = 'purple', subtitle }: KPICardProps) => {
  const colorClasses = {
    purple: 'from-[#5b68f4] to-[#7c5cfc] shadow-[0_0_20px_rgba(91,104,244,0.3)]',
    cyan: 'from-[#06b6d4] to-[#10d9b4] shadow-[0_0_20px_rgba(16,217,180,0.3)]',
    green: 'from-[#10d9b4] to-[#0dd9b4] shadow-[0_0_20px_rgba(16,217,180,0.3)]',
    pink: 'from-[#ef4464] to-[#fc5c7d] shadow-[0_0_20px_rgba(239,68,100,0.3)]',
    blue: 'from-[#5b68f4] to-[#8b9aff] shadow-[0_0_20px_rgba(91,104,244,0.3)]'
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.2)' }}
      className="bg-white dark:bg-[#1a1b2e] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-white/[0.08]"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-400 mb-2">{title}</p>
          <h3 className="text-gray-900 dark:text-white mb-1">{value}</h3>
          {subtitle && (
            <p className="text-gray-500 dark:text-gray-500">{subtitle}</p>
          )}
          {trend !== undefined && (
            <p className={`mt-1 ${trend >= 0 ? 'text-[#10d9b4]' : 'text-[#ef4464]'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </motion.div>
  );
};
