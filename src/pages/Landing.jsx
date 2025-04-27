import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Award, Users, Brain, Clock, Star } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

// Landing page with professional design, animations, and SEO
function Landing() {
  const featuresRef = useRef(null);
  const whyUsRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' });
  const whyUsInView = useInView(whyUsRef, { once: true, margin: '-100px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' });

  // Animation variants for staggered card effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Structured Data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Flashcards',
    url: 'https://flashcards-app-steel.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://flashcards-app-steel.vercel.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Flashcards - Learn Smarter</title>
        <meta
          name="description"
          content="Create, study, and master custom flashcards with Flashcards. Perfect for students, professionals, and lifelong learners."
        />
        <meta
          name="keywords"
          content="flashcards, study app, learning, education, spaced repetition, quiz"
        />
        <link rel="canonical" href="https://flashcards-app-steel.vercel.app/" />
        <meta property="og:title" content="Flashcards - Learn Smarter" />
        <meta
          property="og:description"
          content="Master any subject with custom flashcards, quizzes, and progress tracking."
        />
        <meta property="og:url" content="https://flashcards-app-steel.vercel.app/" />
        <meta property="og:image" content="/assets/logo.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Flashcards - Learn Smarter" />
        <meta
          name="twitter:description"
          content="Master any subject with custom flashcards, quizzes, and progress tracking."
        />
        <meta name="twitter:image" content="/assets/logo.svg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gradient-to-r from-primary to-secondary text-white"
        role="banner"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Spark Your Learning with Flashcards
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            Create custom flashcards, track your progress, and master any subject with our intuitive study app. Perfect for students, professionals, and lifelong learners.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center gap-4"
          >
            <Button
              as={Link}
              to="/signup"
              className="bg-white text-primary px-6 py-3 text-lg font-semibold hover:bg-gray-100"
              ariaLabel="Get started with Flashcards"
            >
              Get Started
            </Button>
            <Button
              as={Link}
              to="/signin"
              className="bg-transparent border-2 border-white text-white px-6 py-3 text-lg font-semibold hover:bg-white hover:text-primary"
              ariaLabel="Sign in to Flashcards"
            >
              Sign In
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="container mx-auto px-4 py-16"
        role="region"
        aria-label="App features"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 dark:text-gray-100"
        >
          Everything You Need to Study Smarter
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={cardVariants}>
            <Card className="space-y-4" ariaLabel="Create Flashcards feature">
              <BookOpen className="w-12 h-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold dark:text-gray-100">Create Flashcards</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Build and organize flashcards for any subject, from biology to history, in just a few clicks.
              </p>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="space-y-4" ariaLabel="Track Progress feature">
              <Award className="w-12 h-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold dark:text-gray-100">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Stay motivated with detailed stats, badges, and insights into your learning journey.
              </p>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="space-y-4" ariaLabel="Learn Smarter feature">
              <Users className="w-12 h-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold dark:text-gray-100">Learn Smarter</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Master tough concepts with spaced repetition and personalized study plans.
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section
        ref={whyUsRef}
        className="py-16 bg-gray-100 dark:bg-gray-800"
        role="region"
        aria-label="Why choose Flashcards"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={whyUsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 dark:text-gray-100"
          >
            Why Flashcards Stands Out
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={whyUsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={cardVariants}>
              <Card className="space-y-4 bg-white dark:bg-gray-700" ariaLabel="Personalized Learning feature">
                <Brain className="w-12 h-12 mx-auto text-secondary" />
                <h3 className="text-xl font-semibold dark:text-gray-100">Personalized Learning</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our app adapts to your pace, focusing on areas where you need the most practice.
                </p>
              </Card>
            </motion.div>
            <motion.div variants={cardVariants}>
              <Card className="space-y-4 bg-white dark:bg-gray-700" ariaLabel="Study Anywhere feature">
                <Clock className="w-12 h-12 mx-auto text-secondary" />
                <h3 className="text-xl font-semibold dark:text-gray-100">Study Anywhere</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Access your flashcards offline and sync your progress when you’re back online.
                </p>
              </Card>
            </motion.div>
            <motion.div variants={cardVariants}>
              <Card className="space-y-4 bg-white dark:bg-gray-700" ariaLabel="Gamified Experience feature">
                <Star className="w-12 h-12 mx-auto text-secondary" />
                <h3 className="text-xl font-semibold dark:text-gray-100">Gamified Experience</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Earn badges and compete with yourself to make learning fun and rewarding.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="py-16 text-center"
        role="region"
        aria-label="Call to action"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-6 dark:text-gray-100"
        >
          Ready to Transform Your Learning?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={ctaInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg mb-8 max-w-xl mx-auto dark:text-gray-200"
        >
          Join thousands of learners who are mastering their subjects with Flashcards. Sign up today and start your journey!
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={ctaInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            as={Link}
            to="/signup"
            className="bg-primary text-white px-8 py-4 text-lg font-semibold hover:bg-indigo-700"
            ariaLabel="Start learning with Flashcards"
          >
            Start Learning Now
          </Button>
        </motion.div>
      </section>
    </div>
  );
}

export default Landing;