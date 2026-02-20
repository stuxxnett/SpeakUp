import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaUsers, FaLock, FaMicrophone, FaRegLightbulb } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-100">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-medium text-sm">
            🚀 The #1 Platform for GD Practice
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Master the Art of <br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Speaking Up.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            "The best way to speak English is to speak."
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Random Match Button */}
            <Link 
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <FaUsers /> Join Random GD
            </Link>

            {/* Custom Room Button */}
            <Link 
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
            >
              <FaLock /> Create Private Room
            </Link>
          </div>
        </div>

        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <FeatureCard 
              icon={<FaUsers className="w-8 h-8 text-blue-600" />}
              title="Real-time Matching"
              desc="Connect with students and professionals worldwide instantly. No waiting, just debating."
            />
            <FeatureCard 
              icon={<FaRegLightbulb className="w-8 h-8 text-yellow-500" />}
              title="Smart Topics"
              desc="Get curated topics ranging from Abstract to Current Affairs to test your critical thinking."
            />
            <FeatureCard 
              icon={<FaMicrophone className="w-8 h-8 text-purple-600" />}
              title="Instant Feedback"
              desc="Receive anonymous peer ratings on your confidence, fluency, and content after every session."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 SpeakUp. Build confidence, one discussion at a time.</p>
        </div>
      </footer>
    </div>
  );
};

// Helper Component for Features
const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

export default Home;