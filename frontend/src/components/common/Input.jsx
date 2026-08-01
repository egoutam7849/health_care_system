import React from 'react';

export function Input({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-[11px] font-bold text-txt-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-txt-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          className={`w-full dark-input rounded-xl text-xs py-2 ${Icon ? 'pl-9' : 'px-3'} pr-3 ${error ? 'border-accent-red focus:ring-accent-red' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] text-accent-red font-semibold">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  options = [],
  icon: Icon,
  className = '',
  children,
  ...props
}) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-[11px] font-bold text-txt-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-txt-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          className={`w-full dark-input rounded-xl text-xs py-2 ${Icon ? 'pl-9' : 'px-3'} pr-8 appearance-none cursor-pointer ${className}`}
          {...props}
        >
          {children || options.map(opt => (
            <option key={opt.value || opt} value={opt.value || opt} className="bg-dark-shell text-txt-primary">
              {opt.label || opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
