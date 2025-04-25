import CreateFlashcard from '../components/CreateFlashcard';

// Page to create a new flashcard with enhanced layout
function Create() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <CreateFlashcard />
      </div>
    </div>
  );
}

export default Create;