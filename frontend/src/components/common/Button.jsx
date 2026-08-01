import React from 'react';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size = 'md',        // 'sm' | 'md' | 'lg'
  icon: Icon,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-canvas disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-accent-blue hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 focus:ring-blue-500',
    secondary: 'bg-dark-hover hover:bg-slate-600 text-txt-primary border border-white/10 focus:ring-slate-500',
    ghost: 'bg-transparent hover:bg-dark-hover text-txt-secondary hover:text-txt-primary focus:ring-slate-500',
    danger: 'bg-accent-red hover:bg-red-600 text-white shadow-lg shadow-red-500/20 focus:ring-red-500',
    success: 'bg-accent-emerald hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 focus:ring-emerald-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
