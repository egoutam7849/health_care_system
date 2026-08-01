import React from 'react';

export function PageHeader({ 
  title, 
  description, 
  stats = [], 
  actions = [] 
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
      {/* Title & Description */}
      <div className="flex-1">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        )}

        {/* Mini-Stats Row */}
        {stats.length > 0 && (
          <div className="flex flex-wrap items-center gap-6 mt-4">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-base font-black text-slate-800 dark:text-slate-200">{stat.value}</span>
                  {stat.trend && (
                    <span className={`text-[10px] font-bold ${stat.trendColor || 'text-emerald-500'}`}>
                      {stat.trend}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {actions.map((action, i) => {
            const Icon = action.icon;
            if (action.primary) {
              return (
                <button
                  key={i}
                  onClick={action.onClick}
                  className="flex items-center gap-2 px-4 py-2 bg-domain-clinical text-white font-bold text-xs rounded-xl shadow-md shadow-domain-clinical/20 hover:bg-blue-600 transition-colors"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{action.label}</span>
                </button>
              );
            }
            return (
              <button
                key={i}
                onClick={action.onClick}
                className="flex items-center gap-2 px-4 py-2 layer-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors"
              >
                {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
