import CategorySelector from '../components/CategorySelector';
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    // const handleSelect = (category) => {
    //     navigate('flashcards/${category}');
    // };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">
                Welcome to FlashCards
                {/* <CategorySelector onSelect={handleSelect} /> */}
            </h1>
        </div>
    )
}

export default Home;