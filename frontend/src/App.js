import React from 'react';
import './App.css';
import { ImBooks } from "react-icons/im"; // users library with books they have read
import { CiSearch } from "react-icons/ci"; //search icon for searching different books
import { HiBuildingLibrary } from "react-icons/hi2"; //library icon returns to the homepage
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';

function App() {
  return (
    
    <IconContext.Provider value={{ size: "30px", color:"#90bdc9" }}>
      <div className="App">
        <div className='homebar'>
        <div className="iconWithText">
          <Link to="/Main" className="Home"> 
            <HiBuildingLibrary className='libraryicon'/>
            <span>Home</span>
          </Link>
        </div>
        <div className="iconWithText">
          <Link to ="/Search" className='Search'>
            <CiSearch/>
            <span>Search</span>
          </Link>
        </div>


        <div className="iconWithText">
          <Link to ="/Library" className = "Your_Library">
          <ImBooks className = 'bookicon'/>
          <span>Your Books</span>
          </Link>
        </div>

        <div className="iconWithText">
          <Link to ="/Reccomendations" className ="Reccs">
          
          <span>Recommendations</span>
          </Link>
        </div>

        <div className='iconWithText'>
        <Link to ="/Register" className ="SignIn">
          
          <span>Log In</span>
          </Link>

        </div>
        </div>

        {/* Latest Releases Section */}
        <div className='section'>
          <div className='section-title'>Latest Releases</div>
          <div className='book-grid'>
  
          </div>
        </div>

        {/* NYT Best Sellers Section */}
        <div className='section'>
          <div className='section-title'>NYT Best Sellers</div>
          <div className='book-grid'>

          </div>
        </div>

        {/* Timeless Classics Section */}
        <div className='section'>
          <div className='section-title'>Timeless Classics</div>
          <div className='book-grid'>

          </div>
        </div>
        
      </div>
    </IconContext.Provider>
  );
}

export default App;
