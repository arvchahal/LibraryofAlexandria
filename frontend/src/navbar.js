import React from 'react';
import { Link } from 'react-router-dom';
import { ImBooks } from "react-icons/im"; // users library with books they have read
import { CiSearch } from "react-icons/ci"; //search icon for searching different books
import { HiBuildingLibrary } from "react-icons/hi2"; //library icon returns to the homepage
import { IconContext } from 'react-icons';
import "./navbar.css"

const NavBar = () => {
  return (
    <IconContext.Provider value={{ size: "30px", color:"#90bdc9" }}>
      <div className='homebar'>
        <div className="iconWithText">
          <Link to="/Main" className="Home">
            <HiBuildingLibrary className='libraryicon'/>
            <span>Home</span>
          </Link>
        </div>
        <div className="iconWithText">
          <Link to="/Search" className='Search'>
            <CiSearch/>
            <span>Search</span>
          </Link>
        </div>
        <div className="iconWithText">
          <Link to="/Library" className="Your_Library">
            <ImBooks className='bookicon'/>
            <span>Your Books</span>
          </Link>
        </div>
        <div className="iconWithText">
          <Link to="/Reccomendations" className="Reccs">
            <span>Recommendations</span>
          </Link>
        </div>
        <div className='iconWithText'>
          <Link to="/Register" className="SignIn">
            <span>Log In</span>
          </Link>
        </div>
      </div>
    </IconContext.Provider>
  );
}

export default NavBar;
