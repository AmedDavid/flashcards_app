import Profile from '../components/Profile';

// simply pass the Profile page
function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">Your Profile</h1>
      <Profile />
    </div>
  );
}

export default ProfilePage;