import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subValue?: string;
  isLoading?: boolean;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  subValue, 
  isLoading = false,
  colorClass = "text-brand-600"
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          {isLoading ? (
            <div className="h-8 w-24 bg-slate-100 animate-pulse rounded"></div>
          ) : (
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
          )}
          {subValue && !isLoading && (
            <span className="text-xs text-slate-400 font-medium">{subValue}</span>
          )}
        </div>
      </div>
      <div className={`p-2 bg-slate-50 rounded-lg ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
  );
};