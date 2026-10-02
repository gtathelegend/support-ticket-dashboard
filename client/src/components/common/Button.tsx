import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-medium transition-colors rounded-[4px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0C66E4] disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants: Record<string, string> = {
    primary:
      'bg-[#0C66E4] hover:bg-[#0055CC] text-white border border-transparent',
    secondary:
      'bg-white hover:bg-[#F7F8FA] text-[#172B4D] border border-[#DFE1E6]',
    ghost:
      'bg-transparent hover:bg-[#F7F8FA] text-[#44546F] border border-transparent',
    danger:
      'bg-[#FFECEB] hover:bg-[#FFD2CF] text-[#AE2A19] border border-[#FFC3BE]',
  };

  const sizes: Record<string, string> = {
    sm: 'h-7 px-2.5 text-[12px] gap-1',
    md: 'h-9 px-3 text-[13px] gap-1.5',
    lg: 'h-10 px-4 text-sm gap-2',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-3.5 w-3.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
