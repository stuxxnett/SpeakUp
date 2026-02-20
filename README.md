# 🎙️ SpeakUp

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=flat&logo=webrtc&logoColor=white)

SpeakUp is a low-latency, Peer-to-Peer (P2P) real-time video conferencing application. Designed with modern WebRTC architecture, it provides seamless 1-on-1 video and audio communication directly between browsers. 

**[Live Demo](https://YOUR_VERCEL_URL_HERE.vercel.app) • [Report a Bug](https://github.com/stuxxnett/SpeakUp/issues)**

---

## ✨ Features

* **Real-Time P2P Video/Audio:** High-quality, low-latency media streaming utilizing WebRTC.
* **Instant Signaling:** Custom Socket.io backend to handle instant SDP offer/answer handshakes.
* **Media Controls:** Users can seamlessly toggle microphone and camera streams during a call.
* **Connection State Recovery:** Built-in safeguards against "ghost" connections and network race conditions.
* **Session Timer:** Built-in call duration tracking.

## 🏗️ Architecture

SpeakUp bypasses traditional, expensive server-routing by using a decentralized P2P architecture. 

1. **The Signaling Server (Node.js/Socket.io):** Acts purely as a "matchmaker". It introduces User A and User B by exchanging their network information (ICE candidates) and session descriptions (SDP).
2. **The Direct Connection (WebRTC):** Once introduced, the server steps aside. High-bandwidth video and audio data flow directly from browser to browser, ensuring the lowest possible latency and zero server-side video processing costs.

## 💻 Tech Stack

* **Frontend:** React.js, Tailwind CSS, Simple-Peer (WebRTC abstraction)
* **Backend:** Node.js, Express.js, Socket.io
* **Deployment:** Vercel (Frontend), Render (Backend)

## 🚀 Local Development

To run this project locally, you will need to start both the frontend and backend servers.

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn

### 1. Setup Backend
```bash
cd server
npm install
npm run dev

The signaling server will start on http://localhost:5000
```

### 2. Setup Frontend
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
The React app will start on http://localhost:5173

🛣️ Future Roadmap
[ ] Group Discussion Mode: Implement a Full-Mesh WebRTC network to support 6-person group calls.

[ ] Screen Sharing: Allow users to replace their camera track with a display media track.

[ ] Real-Time Text Chat: Add a side-channel data connection for text messaging during calls.

👨‍💻 Author
Utkarsh Sharma

GitHub: @stuxxnett

📝 License
This project is licensed under the MIT License.
