import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'; 
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';
import Signup from './pages/Signup';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;