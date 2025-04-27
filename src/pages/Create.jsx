import CreateFlashcard from '../components/CreateFlashcard';
import { Helmet } from 'react-helmet-async';

// Page to create a new flashcard with enhanced layout
function Create() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Create Flashcards</title>
        <meta name="description" content="Build custom flashcards for any subject with Flashcards." />
        <link rel="canonical" href="https://flashcards-app-steel.vercel.app/create" />
      </Helmet>
      <div className="container mx-auto px-4">
        <CreateFlashcard />
      </div>
    </div>
  );
}

export default Create;