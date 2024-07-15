import React from 'react';
//import backgroundImage from "./components/nigtlibrary.webp";
import { Link } from 'react-router-dom';
import "./homePage.css"

const HomePage = () => {
  return (

      <header className="header">
        <h1>Welcome to The Library of Alexandria</h1>
        <Link to="/Main" className="Enter">Press to Enter</Link>
      </header>
    
  );
}

export default HomePage;
