import { motion } from 'framer-motion';

// Reusable button component with animations and disabled state (new features)
function Button({ children, onClick, className, ariaLabel, type = 'button', disabled = false }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

export default Button;