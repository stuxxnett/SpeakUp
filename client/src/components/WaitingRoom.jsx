import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WaitingRoom = ({ socket, user }) => {
  const [status, setStatus] = useState('Searching for peers...');
  const navigate = useNavigate();
  
  useEffect(() => {
    // 1. Tell the server we want to join
    socket.emit('join_queue', user);

    // 2. Listen for a match
    socket.on('match_found', (data) => {
      setStatus(`Match Found! Redirecting...`);
      setTimeout(() => {
        navigate(`/room/${data.roomId}`); 
      }, 2000);
    });

    // Cleanup: Leave queue if they close the component
    return () => {
      socket.off('match_found');
    };
  }, [socket, user]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
      {/* Pulse Animation */}
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
        <div className="relative w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white">
          <span className="text-4xl">🔍</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2">{status}</h2>
      <p className="text-gray-300 mb-8">Matching you with others...</p>

      <button 
        onClick={() => window.location.reload()} 
        className="px-6 py-2 bg-red-500/20 text-red-200 rounded-full hover:bg-red-500/40 border border-red-500/50 transition"
      >
        Cancel & Exit
      </button>
    </div>
  );
};

export default WaitingRoom;