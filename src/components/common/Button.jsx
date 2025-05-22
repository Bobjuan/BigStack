import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  type = 'button',
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'font-medium transition-all duration-200 rounded-md';
  
  const variants = {
    primary: 'bg-[#2f3542] hover:bg-[#3a4052] text-white',
    secondary: 'bg-[#4b5563] hover:bg-[#6b7280] text-white',
    danger: 'bg-[#e53e3e] hover:bg-[#c53030] text-white',
  };

  const variantStyle = variants[variant] || variants.primary;
  const buttonStyles = `${baseStyles} ${variantStyle} ${className}`;

  return (
    <button
      type={type}
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button; 