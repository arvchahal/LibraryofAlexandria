import React from 'react';
import backgroundImage from "./components/nigtlibrary.webp";
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className = "image" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      margin: 'auto', // Ensure no margin
      display: 'block', // Use flex to center the content
      flexDirection: 'column', // Stack children vertically
      justifyContent: 'center', // Center content vertically
    }}>
      <header className="header">
        <h1>Welcome to The Library of Alexandria</h1>
        <Link to="/Main" className="Enter">Press to Enter</Link>
      </header>
      
    </div>
  );
}

export default HomePage;
