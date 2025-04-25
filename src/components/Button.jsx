import { motion } from 'framer-motion';

// Reusable button component with animations
function Button({ children, onClick, className, ariaLabel, type = 'button' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
}

export default Button;