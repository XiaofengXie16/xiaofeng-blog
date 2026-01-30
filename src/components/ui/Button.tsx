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
  const baseStyles = "relative px-8 py-3 font-semibold transition-all duration-300 focus:outline-none overflow-hidden group terminal-text tracking-wide";

  const variants = {
    primary: `
      bg-gradient-to-r from-primary to-secondary text-background
      border border-primary/50
      shadow-[0_0_20px_rgba(0,240,255,0.3),inset_0_0_20px_rgba(0,240,255,0.1)]
      hover:shadow-[0_0_40px_rgba(0,240,255,0.5),inset_0_0_30px_rgba(0,240,255,0.2)]
      hover:scale-[1.02]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-secondary before:to-primary before:opacity-0 before:transition-opacity before:duration-300
      hover:before:opacity-100
    `,
    ghost: `
      bg-transparent text-text-muted
      border border-transparent
      hover:text-primary hover:bg-primary/5
    `,
    outline: `
      bg-transparent text-text-main
      border border-white/10
      hover:border-primary/50 hover:text-primary
      hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]
      hover:bg-primary/5
    `
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {variant === 'primary' && (
        <>
          {/* Animated corner accents */}
          <span className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-primary/50 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:border-primary" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-primary/50 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:border-primary" />
        </>
      )}
    </button>
  );
};
