// import CategorySelector from '../components/CategorySelector';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

//home page for loggedin users (testing for now)
function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSelect = (category) => {
        navigate('/flashcards/${category}');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">
                Welcome {user.name} to FlashCards
                {/* <CategorySelector onSelect={handleSelect} /> */}
            </h1>
        </div>
    )
}

export default Home;