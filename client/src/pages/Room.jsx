import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';
import Peer from 'simple-peer'; 
import io from 'socket.io-client';

// ---------------------------------------------------------
// 1. GLOBAL VARIABLES (Nuclear Option)
// These exist outside React, so they NEVER get deleted by re-renders
// ---------------------------------------------------------
const socket = io('http://localhost:5000', { autoConnect: false });
let peer = null; // We will store the peer connection here

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [stream, setStream] = useState(null);
  const [partnerStream, setPartnerStream] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Initializing...");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [timer, setTimer] = useState(900);
  
  // Refs for UI
  const myVideo = useRef();
  const partnerVideo = useRef();

  useEffect(() => {
    // 2. CONNECT SOCKET MANUALLY
    if (!socket.connected) {
      socket.connect();
    }
    setConnectionStatus(`Connected (ID: ${socket.id})`);

    // 3. GET CAMERA
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }

        // 4. SETUP LISTENERS (With clean slate)
        socket.off('user_joined');
        socket.off('incoming_call');
        socket.off('call_accepted');

        socket.on('user_joined', (userId) => {
            console.log("👋 New User Joined:", userId);
            setConnectionStatus(`New User Joined. Calling...`);
            callUser(userId, currentStream);
        });

        socket.on('incoming_call', (data) => {
            console.log("📞 Incoming Call from:", data.from);
            setConnectionStatus(`Incoming Call...`);
            answerCall(data, currentStream);
        });

        socket.on('call_accepted', (signal) => {
            console.log("✅ Call Accepted. Final Handshake.");
            setConnectionStatus("Connected!");
            peer?.signal(signal);
        });

        // 5. JOIN ROOM
        console.log("🚀 Joining Room:", roomId);
        socket.emit('join_room', roomId);
      })
      .catch(err => {
        console.error("Camera Error:", err);
        setConnectionStatus("Camera Failed");
      });

      // Timer Logic
      const interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

    // CLEANUP
    return () => {
      clearInterval(interval);
      // Note: We do NOT disconnect socket here to prevent "ghosting" on quick refreshes
      // But we do destroy the peer to stop the camera
      if (peer) {
        peer.destroy();
        peer = null;
      }
    };
  }, [roomId]); 

  // --- WebRTC Functions ---

  const callUser = (id, currentStream) => {
    peer = new Peer({
      initiator: true,
      trickle: false,
      stream: currentStream,
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    });

    peer.on('signal', (data) => {
      console.log("⚡ Generating Offer Signal...");
      socket.emit('call_user', {
        userToCall: id,
        signalData: data,
        from: socket.id,
      });
    });

    peer.on('stream', (userStream) => {
      console.log("📺 Stream Received (Initiator)");
      setPartnerStream(userStream);
      setConnectionStatus("Connected!");
    });

    peer.on('error', (err) => {
        console.error("Peer Error:", err);
        setConnectionStatus("Peer Error: " + err.message);
    });
  };

  const answerCall = (data, currentStream) => {
    peer = new Peer({
      initiator: false,
      trickle: false,
      stream: currentStream,
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    });

    peer.on('signal', (signalData) => {
      console.log("⚡ Generating Answer Signal...");
      socket.emit('answer_call', { signal: signalData, to: data.from });
    });

    peer.on('stream', (userStream) => {
      console.log("📺 Stream Received (Answerer)");
      setPartnerStream(userStream);
      setConnectionStatus("Connected!");
    });

    peer.on('error', (err) => {
        console.error("Peer Error:", err);
        setConnectionStatus("Peer Error: " + err.message);
    });

    // Fire the signal to start the handshake
    peer.signal(data.signal);
  };

  // Toggle Functions
  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoMuted(!videoTrack.enabled);
    }
  };

  // Attach Partner Stream
  useEffect(() => {
    if (partnerVideo.current && partnerStream) {
      partnerVideo.current.srcObject = partnerStream;
    }
  }, [partnerStream]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-4 bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex items-center gap-4">
           <h1 className="text-xl font-bold">Room: {roomId.slice(0, 8)}...</h1>
           <span className={`text-xs px-2 py-1 rounded ${connectionStatus === 'Connected!' ? 'bg-green-500' : 'bg-yellow-500'}`}>
              {connectionStatus}
           </span>
        </div>
        
        <div className="bg-gray-700 px-4 py-2 rounded-lg font-mono text-xl font-bold border border-gray-600">
            {formatTime(timer)}
        </div>

        <button onClick={() => window.location.href='/dashboard'} className="bg-red-600 px-4 py-2 rounded flex items-center gap-2">
            <FaPhoneSlash /> Leave
        </button>
      </header>

      {/* VIDEO GRID */}
      <div className="grid md:grid-cols-2 gap-4 h-[80vh]">
        {/* MY VIDEO */}
        <div className="relative bg-black rounded-lg overflow-hidden border border-gray-700">
           <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover transform scale-x-[-1]" />
           <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-sm">You</div>
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
             <button onClick={toggleAudio} className={`p-3 rounded-full ${isAudioMuted ? 'bg-red-500' : 'bg-gray-700'}`}>
               {isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
             </button>
             <button onClick={toggleVideo} className={`p-3 rounded-full ${isVideoMuted ? 'bg-red-500' : 'bg-gray-700'}`}>
               {isVideoMuted ? <FaVideoSlash /> : <FaVideo />}
             </button>
           </div>
        </div>

        {/* PARTNER VIDEO */}
        <div className="relative bg-black rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
           {!partnerStream && (
             <div className="text-center">
                <div className="animate-spin text-4xl mb-2 text-blue-500">⏳</div>
                <p className="text-gray-300">Waiting for peer...</p>
             </div>
           )}
           <video playsInline ref={partnerVideo} autoPlay controls className="w-full h-full object-cover" />
           {partnerStream && <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-sm">Peer</div>}
        </div>
      </div>
    </div>
  );
};

export default Room;