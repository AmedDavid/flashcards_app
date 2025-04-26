import { motion } from 'framer-motion';

// Reusable card component with animations
function Card({ children, className, onClick, ariaLabel, role = 'region' }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg ${className}`}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </motion.div>
  );
}

export default Card;