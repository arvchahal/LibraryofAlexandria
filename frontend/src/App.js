import React from 'react';
import './App.css';
import { ImBooks } from "react-icons/im"; // users library with books they have read
import { CiSearch } from "react-icons/ci"; //search icon for searching different books
import { HiBuildingLibrary } from "react-icons/hi2"; //library icon returns to the homepage
import { IoIosThumbsUp } from "react-icons/io"; //thumbs up for the recommendations for the user
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';

function App() {
  return (
    <IconContext.Provider value={{ size: "30px", color:"#FA7202" }}>
      <div className="App">
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
          <ImBooks/>
          <span>Your Books</span>
          </Link>
        </div>

        <div className="iconWithText">
          <Link to ="/Reccomendations" className ="Reccs">
          <IoIosThumbsUp/>
          <span>Recommendations</span>
          </Link>
        </div>

        <div className='iconWithText'>
        <Link to ="/Register" className ="SignIn">
          
          <span>Log In</span>
          </Link>

        </div>
      </div>
    </IconContext.Provider>
  );
}

export default App;
