import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string;
  subtext?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'danger' | 'neutral';
  badgeText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'neutral',
  badgeText
}) => {
  const variantStyles = {
    primary: {
      border: 'border-blue-100',
      bgIcon: 'bg-blue-50 text-blue-600',
      valueColor: 'text-slate-900',
    },
    success: {
      border: 'border-emerald-100',
      bgIcon: 'bg-emerald-50 text-emerald-600',
      valueColor: 'text-emerald-700',
    },
    danger: {
      border: 'border-rose-100',
      bgIcon: 'bg-rose-50 text-rose-600',
      valueColor: 'text-rose-700',
    },
    neutral: {
      border: 'border-slate-200',
      bgIcon: 'bg-slate-100 text-slate-700',
      valueColor: 'text-slate-900',
    }
  }[variant];

  return (
    <div
      id={id}
      className={`bg-white rounded-xl border ${variantStyles.border} p-5 shadow-xs transition-shadow hover:shadow-md flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-600 truncate">{title}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${variantStyles.bgIcon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3">
        <div className={`text-2xl font-bold tracking-tight ${variantStyles.valueColor}`}>
          {value}
        </div>
        {(subtext || badgeText) && (
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            {badgeText && (
              <span className="inline-flex items-center px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-700">
                {badgeText}
              </span>
            )}
            {subtext && <span className="truncate">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
