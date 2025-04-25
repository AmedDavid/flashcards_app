import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
// import { updateUser } from '../services/api';
import { updateUser as updateUserApi } from '../services/api'; //post-fix

// Profile component to view and edit user details

function Profile() {
  const { user, updateUser: updateUserContext } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }
    try {
      const updatedUser = await updateUserApi(user.id, { name, email });
      updateUserContext(updatedUser); // update context
      setSuccess('Profile updated successfully');
      setError('');
    } catch {
      setError('Failed to update profile');
      setSuccess('');
    }
  };


  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Your Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-600 dark:text-gray-100"
            aria-label="Full name"
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
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-indigo-700 transition"
          aria-label="Update profile"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default Profile;