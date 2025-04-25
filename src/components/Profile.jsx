// src/components/Profile.jsx
import { Link } from 'react-router-dom';

const Profile = ({ user, onEditClick }) => {
  return (
    <div className="max-w-md p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Name</label>
          <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-600 rounded dark:text-gray-100">
            {user?.name || 'Not provided'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Email</label>
          <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-600 rounded dark:text-gray-100">
            {user?.email}
          </p>
        </div>
      </div>
      <button
        onClick={onEditClick}
        className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default Profile;