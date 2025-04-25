// src/pages/ProfilePage.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Profile from '../components/Profile';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 dark:bg-gray-700 rounded-lg shadow-md">
        <p className="dark:text-gray-200">Please sign in to view your profile</p>
        <button
          onClick={() => navigate('/signin')}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-gray-100">Your Profile</h2>
        <button
          onClick={logout}
          className="text-red-500 hover:underline"
        >
          Sign Out
        </button>
      </div>
      <Profile 
        user={currentUser} 
        onEditClick={() => navigate('/edit-profile')} 
      />
    </div>
  );
};

export default ProfilePage;