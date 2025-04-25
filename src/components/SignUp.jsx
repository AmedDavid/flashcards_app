import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signUp } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import Card from './Card';
import { Eye, EyeOff } from 'lucide-react';

// Sign-up form component with enhanced validation
function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be 8+ characters with an uppercase letter and a number');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    setLoading(true);
    try {
      const user = await signUp(name, email, password);
      login(user);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Failed to sign up');
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
        <h2 className="text-2xl font-bold text-center dark:text-gray-100">Join FlashCards</h2>
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
            <label className="block text-sm font-medium dark:text-gray-200 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary"
              aria-label="Full name"
              required
              disabled={loading}
            />
          </div>
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
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mr-2"
              aria-label="Agree to terms and conditions"
              disabled={loading}
            />
            <label className="text-sm dark:text-gray-200">
              I agree to the{' '}
              <Link
                to="/terms"
                className="text-primary hover:underline dark:text-indigo-300"
                aria-label="Terms and conditions"
              >
                Terms and Conditions
              </Link>
            </label>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-indigo-700"
            ariaLabel="Sign up"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
        <p className="text-center text-sm dark:text-gray-200">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="text-primary hover:underline dark:text-indigo-300"
            aria-label="Sign in"
          >
            Sign In
          </Link>
        </p>
      </Card>
    </motion.div>
  );
}



export default SignUp;