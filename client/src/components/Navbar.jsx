import { Link, useNavigate, useLocation } from 'react-router-dom'; // 1. Import useLocation

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 2. This hook makes the component re-render on route change

  // Because of 'location', this line runs again every time you change pages!
  const token = localStorage.getItem('token'); 

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');  
    navigate('/login'); // This will now trigger the Navbar to update immediately
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition">
          SpeakUp
        </Link>

        {/* Dynamic Buttons */}
        <div className="flex items-center gap-4">
          {token ? (
            // --- VIEW FOR LOGGED IN USERS ---
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition font-medium">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            // --- VIEW FOR GUESTS ---
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition font-medium">
                Log In
              </Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium shadow-lg shadow-blue-500/30">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;