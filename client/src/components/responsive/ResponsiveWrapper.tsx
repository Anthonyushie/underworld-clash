import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveWrapperProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveWrapper({ children, className }: ResponsiveWrapperProps) {
  return (
    <div className={cn(
      "w-full min-h-screen",
      // Mobile-first responsive design
      "px-4 py-2 sm:px-6 sm:py-4 lg:px-8 lg:py-6",
      // Grid layout adjustments
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      // Text size adjustments
      "text-sm sm:text-base",
      // Spacing adjustments
      "space-y-2 sm:space-y-4 lg:space-y-6",
      className
    )}>
      {children}
    </div>
  );
}

// Responsive card component
interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveCard({ children, className }: ResponsiveCardProps) {
  return (
    <div className={cn(
      // Base card styles
      "bg-card border border-border rounded-lg shadow-sm",
      // Responsive padding
      "p-3 sm:p-4 lg:p-6",
      // Responsive margins
      "mb-2 sm:mb-4 lg:mb-6",
      // Hover effects
      "hover:shadow-md transition-shadow duration-200",
      className
    )}>
      {children}
    </div>
  );
}

// Responsive grid component
interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function ResponsiveGrid({ 
  children, 
  className, 
  cols = { default: 1, sm: 2, lg: 3, xl: 4 } 
}: ResponsiveGridProps) {
  const gridClasses = [
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={cn(
      "grid gap-2 sm:gap-4 lg:gap-6",
      gridClasses,
      className
    )}>
      {children}
    </div>
  );
}

// Responsive button component
interface ResponsiveButtonProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

export function ResponsiveButton({ 
  children, 
  className, 
  size = 'md',
  onClick,
  disabled,
  variant = 'default'
}: ResponsiveButtonProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm',
    md: 'px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base',
    lg: 'px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg'
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
    ghost: 'text-primary hover:bg-primary/10'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Base styles
        "rounded-md font-medium transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        // Size classes
        sizeClasses[size],
        // Variant classes
        variantClasses[variant],
        className
      )}
    >
      {children}
    </button>
  );
}