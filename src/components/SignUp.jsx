import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../services/auth';
import { useAuth } from '../context/AuthContext';

// Sign-up form component
function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signUp(name, email, password);
      login(user);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };



  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Sign Up</h2>
      {/* show form errors */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-600 dark:text-gray-100"
            aria-label="Full name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-600 dark:text-gray-100"
            aria-label="Email address"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-600 dark:text-gray-100"
            aria-label="Password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-indigo-700 transition"
          aria-label="Sign up"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center dark:text-gray-200">
        Already have an account? <Link to="/signin" className="text-primary hover:underline">Sign In</Link>
      </p>
    </div>
  );
}



export default SignUp;