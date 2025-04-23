# FlashCards

FlashCards is an application designed to help users study and master various subjects through creating, reviewing, and testing flashcards. Built with modern web technologies, it offers a responsive, accessible, and user-friendly experience with features like user authentication, spaced repetition, dark mode, offline caching, and gamification.

## Team
- **Virginia Manegene** (Group Leader) - Flashcard, FlashcardList components, Flashcards page, animations, accessibility enhancements.
- **David Amedi** - Project setup, json-server integration, Landing page, CategorySelector, CreateFlashcard, ProgressChart components, Quiz, Create, and Progress pages.
- **Duncan Kariuki** - Figma Design, Home page, Landing Page, QuizMode, multiple-choice quiz option.


## Features
- **User Authentication** - Sign up, sign in, and manage profiles with persistent user data.
- **Landing Page** - Engaging introduction with calls-to-action for new and returning users.
- **Flashcards Management** - Create, edit, delete, and review flashcards organized by categories.
- **Quiz Mode** - Test knowledge with a spaced repetition system to prioritize difficult cards.
- **Progress Tracking** - Visualize learning progress with charts and earn badges for milestones.
- **Dark Mode** - Toggle between light and dark themes, saved in localStorage.
- **Offline Mode** - Cache flashcards and progress for offline use, syncing when online.
- **Gamification** - Earn badges (e.g., "Quiz Master" for 10 correct answers).
- **Responsive Design** - Fully responsive UI for mobile, tablet, and desktop.
- **Accessibility** - ARIA labels, keyboard navigation, and high-contrast visuals.

## Tech Stack
- **Frontend** - React, Vite, Tailwind CSS, Framer Motion (animations), Recharts (charts), Lucide React (icons).
- **Backend** - json-server (mock API for flashcards, categories, progress, badges, users).
- **Package Manager** - Npm.
- **Routing** - React Router.
- **Deployment** - Vercel .

## Project Structure
```
flashcards/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   ├── Navbar.jsx (done)
│   │   ├── Flashcard.jsx
│   │   ├── FlashcardList.jsx
│   │   ├── QuizMode.jsx
│   │   ├── CreateFlashcard.jsx
│   │   ├── ProgressChart.jsx
│   │   ├── CategorySelector.jsx
│   │   ├── SignIn.jsx (done)
│   │   ├── SignUp.jsx (done)
│   │   └── Profile.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Home.jsx
│   │   ├── Flashcards.jsx
│   │   ├── Quiz.jsx
│   │   ├── Create.jsx
│   │   ├── Progress.jsx
│   │   ├── SignInPage.jsx (done)
│   │   ├── SignUpPage.jsx (done)
│   │   └── ProfilePage.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js (done)
│   ├── context/
│   │   └── AuthContext.jsx (done)
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx (done)
├── db.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## Setup Instructions
1. **Make Sure Node is Installed**:
   ```bash
   node -v
   ```
2. **Clone the Repository**:
   ```bash
   git clone https://github.com/AmedDavid/flashcards_app.git
   cd flashcards_app
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Run json-server**:
   ```bash
   npm run server
   ```
   - Ensures the mock API runs on `http://localhost:3001`.
5. **Run the Development Server**:
   ```bash
   npm run start
   ```
   - Opens the app at `http://localhost:5173`.
6. **Test the App**:
   - Sign up or sign in to access features.
   - Create categories and flashcards.
   - Review flashcards, take quizzes, and track progress.

## Collaborators Setup Instructions
Each member clones the repo to their local machine to start working.

1. **Accept the Invite**:
    - Check your email or GitHub notifications for Virginia’s invite.
    - Accept it to gain access to the FlashCards repo.

2. **Clone the Repo**:
   ```bash
   git clone https://github.com/AmedDavid/flashcards_app.git
   cd flashcards_app
   ```

3. Install Dependencies:

    ```bash
    npm install
    ```

4. Verify Setup:
    - Run the development server:
    ```bash
    npm run start
    ```
    - Run json-server:
    ```bash
    npm run server
    ```

    - Open http://localhost:5173 to confirm the app works.

5. Create Individual Branches (All Members)
Each member creates a feature branch for their tasks to avoid conflicts.

1. Create a Branch:
- Use a descriptive branch name based on your task (e.g., feature/home-page-virginia, feature/flashcards-david, feature/quiz-duncan).

- Example (David creating a branch for flashcards):
```bash
git checkout -b feature/flashcards-david
```

2. Work on Your Feature:
- Implement your assigned components/pages (e.g., David: Flashcard.jsx, FlashcardList.jsx; Duncan: QuizMode.jsx, CreateFlashcard.jsx; Virginia: Home.jsx, CategorySelector.jsx).
- Test locally to ensure functionality.
- Commit changes frequently:
```bash
git add .
git commit -m "Add Flashcard component with flip animation"
```
3. Push Your Branch:
- Push your branch to GitHub
```bash
git push origin feature/flashcards-david
```
4. Create Pull Requests (All Members)
Once your feature is complete, create a pull request for review.

    1. Create a PR:
    - Go to the FlashCards repo on GitHub.
    - You’ll see a prompt for your recently pushed branch (e.g., feature/flashcards-david).
    - Click “Compare & pull request”.
    - Add a title (e.g., “Add Flashcard and FlashcardList Components”).
    - Add a description:
        - What you added/changed.
        - Link to relevant Figma designs or tasks.
        - Example:

        ```bash
        Added Flashcard and FlashcardList components with Tailwind styling and flip animation.
        - Implements flashcard display and navigation.
        - Matches Figma design for Flashcard View.
        - Tested locally with json-server.
        ```

    - Assign reviewers (Virginia and Duncan for David’s PR).
    - Click “Create pull request”.

    2. Resolve Conflicts (if any):
    - If your branch conflicts with main, GitHub will notify you.
    - Pull the latest main locally:
    ```bash
    git checkout main
    git pull origin main
    git checkout feature/flashcards-david
    git merge main
    ```

    - Resolve conflicts in your code editor, then commit and push:
    ```bash
    git add .
    git commit -m "Resolve merge conflicts"
    git push origin feature/flashcards-david
    ```

---
I will Review and Approve Pull Requests
---

5. Sync with Main Branch (All Members)
After a PR is merged, update your local main and feature branches.

    1. Update Local Main:

    ```bash
    git checkout main
    git pull origin main
    ```

    2. Update Your Feature Branch:
    
    ```bash
    git checkout feature/your-branch
    git merge main
    ```
    - Resolve conflicts if any, then push:

    ```bash
    git push origin feature/your-branch
    ```

## API Endpoints
- **Users**: `GET/POST/PATCH /users` (manage user accounts).
- **Flashcards**: `GET/POST/PATCH/DELETE /flashcards` (CRUD for flashcards).
- **Categories**: `GET/POST /categories` (list or create categories).
- **Progress**: `GET/POST /progress` (track quiz results).
- **Badges**: `GET/PATCH /badges` (manage user badges).

## Deployment
The front-end will be deployed in vercel and the json-server will be deployed in Render

## Collaboration Workflow
- **Repository Setup** - David created the `flashcards` repo and invited David and Duncan as collaborators.
- **Branching** - Each member works on feature branches (e.g., `feature/flashcards-david`).
- **Pull Requests** - Submit PRs for review; require at least one approval before merging into `main`.

## Notes
- **Authentication**: Client-side for MVP using json-server.
- **Offline Support**: Flashcards and progress are cached in localStorage, syncing when online.
- **Accessibility**: ARIA labels and keyboard navigation ensure inclusivity.
- **Future Enhancements**:
  - Add password reset functionality.
  - Implement multiple-choice quizzes.
  - Integrate a real backend (Node.js, MongoDB).

## Acknowledgments
Thank you to our instructors and peers for guidance and feedback throughout the development process. FlashCards was built with passion to make learning engaging and effective!