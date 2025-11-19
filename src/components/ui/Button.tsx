import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles = "relative px-8 py-3 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background overflow-hidden group";

  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:scale-105 border border-transparent",
    ghost: "bg-transparent text-text-muted hover:text-text-main hover:bg-surface-hover/50 backdrop-blur-sm border border-transparent",
    outline: "bg-transparent text-text-main border border-surface-hover hover:border-primary/50 hover:bg-surface-hover/30 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(56,189,248,0.1)]"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
};
