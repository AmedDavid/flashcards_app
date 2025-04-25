import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signIn } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import Card from './Card';
import { Eye, EyeOff } from 'lucide-react';

// Sign-in form component with enhanced design
function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      const user = await signIn(email, password);
      login(user);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto"
    >
      <Card className="space-y-6">
        <h2 className="text-2xl font-bold text-center dark:text-gray-100">Sign In to FlashCards</h2>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center"
          >
            {error}
          </motion.p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-200 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary"
              aria-label="Email address"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-200 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary"
                aria-label="Password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-indigo-700"
            ariaLabel="Sign in"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        <div className="flex justify-between text-sm">
          <Link
            to="/forgot-password"
            className="text-primary hover:underline dark:text-indigo-300"
            aria-label="Forgot password"
          >
            Forgot Password?
          </Link>
          <p className="dark:text-gray-200">
            No account?{' '}
            <Link
              to="/signup"
              className="text-primary hover:underline dark:text-indigo-300"
              aria-label="Sign up"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

export default SignIn;