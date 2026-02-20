import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaMicrophone, FaHistory, FaStar, FaBolt } from 'react-icons/fa';
import io from 'socket.io-client';
import WaitingRoom from '../components/WaitingRoom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [socket, setSocket] = useState(null);

  // 1. Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  // 2. Initialize Socket Connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Cleanup when leaving dashboard
    return () => newSocket.close();
  }, []);

  const handleJoinQueue = () => {
    setIsSearching(true);
  };

  if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-blue-600">{user.username}</span>! 👋
          </h1>
          <p className="text-gray-500 mt-2">Ready to improve your communication skills today?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            icon={<FaBolt className="text-yellow-500" />} 
            label="Total Sessions" 
            value={user.total_sessions || 0} 
            desc="Keep the streak alive!"
          />
          <StatCard 
            icon={<FaStar className="text-blue-500" />} 
            label="Avg Rating" 
            value={user.avg_rating || "0.0"} 
            desc="Based on peer reviews"
          />
          <StatCard 
            icon={<FaHistory className="text-purple-500" />} 
            label="Speaking Time" 
            value="0m" 
            desc="Total minutes practiced"
          />
        </div>

        {/* Main Action Area */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left Column: Quick Actions */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Join Queue Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg transform transition hover:scale-[1.01]">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Join a Random GD</h2>
                  <p className="text-blue-100 mb-6 max-w-lg">
                    Connect with 4-6 random peers. Discuss topics like "AI in Healthcare" or "Remote Work".
                  </p>
                  <button 
                    onClick={handleJoinQueue}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition flex items-center gap-2"
                  >
                    <FaMicrophone /> Start Matching
                  </button>
                </div>
                <div className="hidden md:block opacity-30">
                  <FaMicrophone size={100} />
                </div>
              </div>
            </div>

            {/* Recent History Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p>No sessions yet. Join your first GD to see analytics!</p>
              </div>
            </div>

          </div>

          {/* Right Column: Tips or Leaderboard */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Daily Tips 💡</h3>
            <ul className="space-y-4">
              <li className="text-sm text-gray-600 pb-3 border-b border-gray-50">
                <span className="font-semibold text-gray-800 block mb-1">Maintain Eye Contact</span>
                Even in video calls, look at the camera, not just the screen.
              </li>
              <li className="text-sm text-gray-600 pb-3 border-b border-gray-50">
                <span className="font-semibold text-gray-800 block mb-1">Structure Your Thought</span>
                Use the "PREP" method: Point, Reason, Example, Point.
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800 block mb-1">Listen Actively</span>
                Don't just wait for your turn to speak. React to others.
              </li>
            </ul>
          </div>

        </div>
      </main>

      {/* Render Waiting Room Overlay if Searching */}
      {isSearching && socket && (
        <WaitingRoom socket={socket} user={user} />
      )}
    </div>
  );
};

// Helper Component for Stats
const StatCard = ({ icon, label, value, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gray-50 rounded-lg text-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-3">{desc}</p>
  </div>
);

export default Dashboard;