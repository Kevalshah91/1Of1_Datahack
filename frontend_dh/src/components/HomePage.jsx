import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  FaRobot,
  FaBook,
  FaChartLine,
  FaUpload,
  FaBrain,
  FaLightbulb,
  FaGraduationCap,
  FaUserGraduate,
  FaClock,
  FaMobile,
  FaLaptop,
  FaCloudUploadAlt,
  FaChartBar,
  FaComments,
  FaCheck,
} from "react-icons/fa";
import { HiSparkles, HiCursorClick, HiLightningBolt } from "react-icons/hi";

const FeatureCard = ({ icon: Icon, title, description }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <Icon className="text-4xl text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const SpotlightCard = ({ title, description, icon: Icon }) => (
  <div className="relative p-6 bg-white rounded-xl shadow-lg overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">
      <Icon className="text-4xl text-purple-600 group-hover:text-white transition-colors duration-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-white transition-colors duration-300 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 group-hover:text-white transition-colors duration-300">
        {description}
      </p>
    </div>
  </div>
);

const Timeline = () => {
  const items = [
    {
      title: "Upload Materials",
      description: "Easily upload your study materials or textbooks.",
      icon: FaCloudUploadAlt,
    },
    {
      title: "AI Processing",
      description: "Our advanced AI analyzes and processes your content.",
      icon: FaRobot,
    },
    {
      title: "Generate Study Aids",
      description: "Receive personalized summaries, flashcards, and quizzes.",
      icon: FaLightbulb,
    },
    {
      title: "Learn & Practice",
      description: "Use the generated materials to enhance your learning.",
      icon: FaUserGraduate,
    },
    {
      title: "Track Progress",
      description: "Monitor your improvement and identify areas for focus.",
      icon: FaChartBar,
    },
  ];

  return (
    <div className="relative">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="mb-8 flex"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
            <item.icon className="text-xl" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-semibold text-gray-800">
              {item.title}
            </h4>
            <p className="text-gray-600">{item.description}</p>
          </div>
        </motion.div>
      ))}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-purple-200" />
    </div>
  );
};

const TestimonialCard = ({ quote, author, role }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <p className="text-gray-600 italic mb-4">"{quote}"</p>
    <div className="flex items-center">
      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
        {author[0]}
      </div>
      <div className="ml-3">
        <p className="text-gray-800 font-semibold">{author}</p>
        <p className="text-gray-600 text-sm">{role}</p>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-r from-white to-purple-100 text-blue-900">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-extrabold sm:text-6xl md:text-7xl mb-6">
              <span className="block">Master Your Studies</span>
              <span className="block text-yellow-300">with 1of1</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl sm:text-2xl md:mt-5 md:max-w-3xl">
              Transform your study materials into interactive learning
              experiences tailored just for you.
            </p>
            <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-md shadow"
              >
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Get Started for Free
                </a>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3"
              >
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-500 hover:bg-purple-600 md:py-4 md:text-lg md:px-10"
                >
                  Watch Demo
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl italic">
              Supercharge Your Studies
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Harness the power of AI to transform your learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={FaRobot}
              title="AI-Generated Content"
              description="Our advanced AI creates concise summaries and relevant practice quizzes from your study materials."
            />
            <FeatureCard
              icon={FaBook}
              title="Personalized Learning"
              description="Tailored study materials based on your preferences, learning style, and progress."
            />
            <FeatureCard
              icon={FaUpload}
              title="Easy Uploads"
              description="Effortlessly upload your textbooks, lecture notes, and other study materials for AI processing."
            />
            <FeatureCard
              icon={FaChartLine}
              title="Progress Tracking"
              description="Monitor your study progress and quiz performance to optimize your learning strategy."
            />
            <FeatureCard
              icon={FaBrain}
              title="Adaptive Learning"
              description="Our system adapts to your learning pace and focuses on areas where you need more practice."
            />
            <FeatureCard
              icon={FaLightbulb}
              title="Study Insights"
              description="Gain valuable insights into your learning patterns and receive personalized study tips."
            />
            <FeatureCard
              icon={FaClock}
              title="Time Management"
              description="Optimize your study schedule with AI-powered time management recommendations."
            />
            <FeatureCard
              icon={FaMobile}
              title="Mobile Learning"
              description="Access your study materials anytime, anywhere with our mobile-friendly platform."
            />
            <FeatureCard
              icon={FaComments}
              title="AI Tutor Chat"
              description="Get instant answers to your questions with our AI-powered tutoring chatbot."
            />
          </div>
        </div>
      </section>

      {/* Spotlight Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold sm:text-5xl italic">
              Spotlight Features
            </h2>
            <p className="mt-4 max-w-2xl text-xl mx-auto">
              Discover the cutting-edge tools that set us apart.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <SpotlightCard
              icon={HiSparkles}
              title="AI-Powered Summaries"
              description="Get concise, accurate summaries of your study materials in seconds."
            />
            <SpotlightCard
              icon={FaGraduationCap}
              title="Smart Flashcards"
              description="Interactive flashcards that adapt to your learning progress."
            />
            <SpotlightCard
              icon={FaBrain}
              title="Concept Maps"
              description="Visualize complex topics with AI-generated concept maps."
            />
            <SpotlightCard
              icon={HiCursorClick}
              title="Interactive Quizzes"
              description="Engage with dynamic quizzes that adapt to your knowledge level."
            />
            <SpotlightCard
              icon={HiLightningBolt}
              title="Spaced Repetition"
              description="Optimize your memory retention with scientifically-proven review schedules."
            />
            <SpotlightCard
              icon={FaLaptop}
              title="Virtual Study Groups"
              description="Collaborate with peers in AI-moderated virtual study sessions."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl italic">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Start your journey to smarter studying in just a few simple steps.
            </p>
          </div>

          <Timeline />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl italic">
              What Our Users Say
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Hear from students who have transformed their learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              quote="This AI-powered study tool has completely transformed my learning experience. I've never felt more prepared for exams!"
              author="Sarah Johnson"
              role="Computer Science Student"
            />
            <TestimonialCard
              quote="The personalized study plans and adaptive quizzes have helped me improve my grades significantly. Highly recommended!"
              author="Michael Chen"
              role="Medical Student"
            />
            <TestimonialCard
              quote="As a working professional pursuing an MBA, this platform has made it possible for me to study efficiently in my limited free time."
              author="Emily Rodriguez"
              role="MBA Candidate"
            />
          </div>
        </div>
      </section>

      {/* CTA Section (continued) */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            <span className="block">Ready to revolutionize your learning?</span>
            <span className="block mt-2">
              Start using our AI Study Material Generator today.
            </span>
          </h2>
          <p className="mt-4 text-lg leading-6">
            Join thousands of students who have transformed their learning
            experience.
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 sm:w-auto"
          >
            Sign up for free
          </motion.a>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl italic">
              Choose Your Plan
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Select the perfect plan to suit your learning needs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                name: "Basic",
                price: "Free",
                features: [
                  "AI-generated summaries",
                  "Basic flashcards",
                  "Limited quizzes",
                ],
              },
              {
                name: "Pro",
                price: "$9.99/month",
                features: [
                  "Everything in Basic",
                  "Advanced concept maps",
                  "Unlimited quizzes",
                  "Progress tracking",
                ],
              },
              {
                name: "Premium",
                price: "$19.99/month",
                features: [
                  "Everything in Pro",
                  "AI tutor chat",
                  "Personalized study plans",
                  "Virtual study groups",
                ],
              },
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-xl overflow-hidden"
              >
                <div className="px-6 py-8 sm:p-10 sm:pb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">
                      {plan.price}
                    </span>
                    {plan.name !== "Basic" && (
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    )}
                  </div>
                </div>
                <div className="px-6 pt-6 pb-8 sm:p-10 sm:pt-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <FaCheck className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">
                          {feature}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-8 block w-full bg-purple-600 text-white rounded-md py-3 px-6 text-center font-medium hover:bg-purple-700"
                  >
                    Get started
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Product
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Resources
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2024 AI Study Material Generator. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-purple-600 text-white rounded-full p-4 shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <FaGraduationCap className="h-6 w-6" />
        </motion.button>
      </motion.div>

      {/* Glassmorphic Testimonial */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="fixed bottom-20 left-8 max-w-md p-6 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl"
      >
        <p className="text-gray-800 italic mb-4">
          "This AI-powered study tool has completely transformed my learning
          experience. I've never felt more prepared for exams!"
        </p>
        <p className="text-gray-900 font-semibold">- G5</p>
      </motion.div>
    </div>
  );
};

export default HomePage;
