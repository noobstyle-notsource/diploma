import React from 'react';
import { motion } from 'motion/react';

export const Scanlines = ({ density = 40 }: { density?: number }) => (
  <div 
    className="scanlines" 
    style={{ opacity: density / 100 }} 
  />
);

export const TerminalBorder = ({ 
  children, 
  className = "", 
  ...props 
}: { 
  children: React.ReactNode, 
  className?: string 
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={`terminal-border bg-[var(--color-terminal-bg)] p-4 relative overflow-hidden box-border ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CrtIdleEffects = () => (
  <>
    <div className="crt-scan-bar" />
    <div className="crt-fuzz-line" style={{ animationDelay: '2s', opacity: 0.3 }} />
    <div className="crt-fuzz-line" style={{ animationDelay: '5s', opacity: 0.1, height: '2px' }} />
  </>
);

export const RetroSignal = () => {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-10 overflow-hidden z-[97]">
      <motion.svg 
        viewBox="0 0 1000 1000" 
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 0 500 Q 250 400 500 500 T 1000 500"
          fill="none"
          stroke="var(--color-terminal-green)"
          strokeWidth="2"
          animate={{
            d: [
              "M 0 500 Q 250 400 500 500 T 1000 500",
              "M 0 500 Q 250 600 500 500 T 1000 500",
              "M 0 500 Q 250 400 500 500 T 1000 500",
            ],
            opacity: [0.1, 0.5, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.path
          d="M 500 0 Q 400 250 500 500 T 500 1000"
          fill="none"
          stroke="var(--color-terminal-green)"
          strokeWidth="1"
          animate={{
            d: [
              "M 500 0 Q 400 250 500 500 T 500 1000",
              "M 500 0 Q 600 250 500 500 T 500 1000",
              "M 500 0 Q 400 250 500 500 T 500 1000",
            ],
            opacity: [0.05, 0.2, 0.05]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </motion.svg>
    </div>
  );
};

export const BlinkingCursor = () => <span className="blink inline-block w-2 h-4 bg-[var(--color-terminal-green)] ml-1 align-middle" />;

export const GlitchButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  className = "",
  disabled = false
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost',
  className?: string,
  disabled?: boolean
}) => {
  const base = "font-mono uppercase tracking-widest py-3 px-6 transition-all duration-75 relative group overflow-hidden ";
  const styles = {
    primary: "bg-[var(--color-terminal-green)] text-black font-bold border-2 border-[var(--color-terminal-green)] hover:bg-white hover:border-white",
    secondary: "bg-[var(--color-terminal-dim)] text-[var(--color-terminal-green)] border-2 border-[var(--color-terminal-green)] hover:bg-[var(--color-terminal-green)] hover:text-black",
    outline: "border-2 border-[var(--color-terminal-green)] text-[var(--color-terminal-green)] hover:bg-[var(--color-terminal-green)] hover:text-black",
    ghost: "text-[var(--color-terminal-green)] hover:underline"
  };

  return (
    <button 
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Corner accents for the terminal vibe */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-current opacity-50" />
      <div className="absolute top-0 right-0 w-1 h-1 bg-current opacity-50" />
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-current opacity-50" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-current opacity-50" />
    </button>
  );
};

export const TerminalInput = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder,
  onKeyDown,
  icon: Icon
}: { 
  label: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  type?: string,
  placeholder?: string,
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
  icon?: any
}) => {
  return (
    <div className="flex flex-col space-y-2 mb-6">
      <label className="text-xs uppercase opacity-80 flex items-center gap-2">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </label>
      <div className="relative border-b-2 border-[var(--color-terminal-green)] group">
        <input
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent py-2 pl-0 pr-6 focus:outline-none placeholder:opacity-30"
        />
        <div className="absolute right-0 bottom-2 text-[var(--color-terminal-green)] blink font-bold">_</div>
      </div>
    </div>
  );
};

export const ProgressBar = ({ 
  label, 
  value, 
  maxLabel, 
  className = "" 
}: { 
  label: string, 
  value: number | string, 
  maxLabel?: string, 
  className?: string 
}) => {
  const percent = typeof value === 'number' ? value : 0;
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between text-[10px] font-bold uppercase">
        <span>{label}</span>
        <span>{maxLabel || `${value}%`}</span>
      </div>
      <div className="h-4 border border-[var(--color-terminal-green)] bg-black p-0.5 overflow-hidden">
        <div 
          className="h-full bg-[var(--color-terminal-green)] shadow-[0_0_10px_#00FF41]" 
          style={{ width: `${percent}%` }} 
        />
      </div>
    </div>
  );
};
