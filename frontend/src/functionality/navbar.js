import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ImBooks } from "react-icons/im";  // Import icon for books
import { CiSearch } from "react-icons/ci";  // Import icon for search
import { HiBuildingLibrary } from "react-icons/hi2";  // Import icon for building/library
import { IconContext } from 'react-icons';
import { useAuth } from './contexts/authContext'; // Adjust the path as necessary
import { auth } from './firebase/firebase'; // Import auth from Firebase, adjust path as needed
import { signOut } from "firebase/auth"; // Import signOut from Firebase
import "./navbar.css"; // Import your custom CSS

const NavBar = () => {
  const { currentUser } = useAuth(); // Get current user from context
  const navigate = useNavigate(); // Hook to program navigation
  console.log(currentUser)
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to home or login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <IconContext.Provider value={{ size: "30px", color:"#90bdc9" }}>
      <div className='homebar'>
        <div className="iconWithText">
          <Link to="/Main" className="Home">
            <HiBuildingLibrary className='libraryicon'/> {/* Icon for Home */}
            <span>Home</span>
          </Link>
        </div>
        <div className="iconWithText">
          <Link to="/Search" className='Search'>
            <CiSearch/> {/* Icon for Search */}
            <span>Search</span>
          </Link>
        </div>
        <div className="iconWithText">
          <Link to="/Library" className="Your_Library">
            <ImBooks className='bookicon'/> {/* Icon for Library */}
            <span>Your Books</span>
          </Link>
        </div>
        <div className="iconWithText">
          <Link to="/Recommendations" className="Reccs">
            <span>Recommendations</span> {/* Link to Recommendations */}
          </Link>
        </div>
        <div className='iconWithText'>
          {currentUser ? (
            <a href="/" onClick={handleLogout} className="logout">
              Log Out
            </a>
          ) : (
            <a href="/Register" className="authButton">
              Log In
            </a>
          )}
        </div>
      </div>
    </IconContext.Provider>
  );
}

export default NavBar;
