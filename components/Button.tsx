import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold py-3 px-6 rounded-xl transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-fifo-red text-white hover:bg-fifo-darkRed border-2 border-transparent",
    secondary: "bg-fifo-yellow text-fifo-darkRed hover:bg-yellow-400 border-2 border-transparent",
    outline: "bg-transparent border-2 border-fifo-red text-fifo-red hover:bg-red-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};