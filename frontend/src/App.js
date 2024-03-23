import './App.css';
import { ImBooks } from "react-icons/im"; // users librabry with books they have read
import { CiSearch } from "react-icons/ci"; //search icon for searching different books
import { HiBuildingLibrary } from "react-icons/hi2"; //library icon returns to the homepage
import { IoIosThumbsUp } from "react-icons/io"; //thumbs up for the reccomendations for the user


function App() {
  return (
    <div className="App">
      <HiBuildingLibrary size = "30px"/>
      <CiSearch size = "30px"/>
      <ImBooks size = "30px"/>
      <IoIosThumbsUp size = "30px"/>

    </div>
  );
}

export default App;