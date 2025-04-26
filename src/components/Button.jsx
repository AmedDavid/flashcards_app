import { motion } from 'framer-motion';
import { forwardRef } from 'react';

// Reusable button component with polymorphic rendering and animations
const Button = forwardRef(
  ({ children, as: Component = 'button', onClick, className, ariaLabel, type = 'button', disabled = false, ...props }, ref) => {
    const MotionComponent = motion(Component);

    // TODO: handle polymorphic rendering for other components like 'a', 'div', etc.

    return (
      <MotionComponent
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        type={Component === 'button' ? type : undefined}
        onClick={onClick}
        className={`px-4 py-2 rounded-lg transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        aria-label={ariaLabel}
        disabled={Component === 'button' ? disabled : undefined}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);

Button.displayName = 'Button';

export default Button;