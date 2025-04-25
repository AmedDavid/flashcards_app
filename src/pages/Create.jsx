import CreateFlashcard from '../components/CreateFlashcard';

// Page to create a new flashcard
function Create() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">Create a New Flashcard</h1>
      <CreateFlashcard />
    </div>
  );
}

export default Create;