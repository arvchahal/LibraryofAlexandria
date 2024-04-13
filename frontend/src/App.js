import React, { useState, useEffect } from 'react';
import './App.css';
import { ImBooks } from "react-icons/im"; // users library with books they have read
import { CiSearch } from "react-icons/ci"; //search icon for searching different books
import { HiBuildingLibrary } from "react-icons/hi2"; //library icon returns to the homepage
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import {classicNovels} from './constants'

function App() {
  const [summer, setSummer] = useState([]);
  const[classics, setClassics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nyt, setnyt] = useState([])




  
  function getRandomBooks(n = 6, inp) {
    const shuffled = inp.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  useEffect(() =>{
  fetchsummer();
  fetchBooksClassics();
  fetchNYT();
  
},[])
const fetchsummer = async () => {
  setIsLoading(true);
  try {
    // Update the query to focus on 'fantasy' genre
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:fantasy&maxResults=10&key=AIzaSyA-PpwqzBUD3-6-6hfUJ3lWfvpbrw11vTY`);

    const data = await response.json();
    if (data.items) {
      // Map items to extract necessary book information and sort them by publication date
      const sortedBooks = data.items
        .map(book => ({
          id: book.id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
          publishedDate: book.volumeInfo.publishedDate,
          image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150',
          infoLink: book.volumeInfo.infoLink
        }))
        .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)); // Sorting by date, newest first

      setSummer(sortedBooks);
    } else {
      setSummer([]); // Ensure to set to empty array if no items are found
    }
    setIsLoading(false);
  } catch (error) {
    console.error('Failed to fetch books:', error);
    setSummer([]);
    setIsLoading(false);
  }
};


  const fetchBooksClassics = async() => {
    setIsLoading(true);
    const random = getRandomBooks(10,classicNovels);
    const books = await Promise.all(random.map(book=>{
      const query = `intitle:"${book.title}" inauthor:"${book.author}"`;
      return fetchBooks(query);
    }));
    setClassics(books.flat());
    setIsLoading(false);


  }

  const fetchNYT = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=LeCRVkW6ihsaQ385MnU3n2yWcjucscvW');
      const data = await response.json();
      if (data.results && data.results.lists) {
        const lists = data.results.lists.map(list => list.books).flat();
        setnyt(lists)
        setIsLoading(false);
        return data.results.lists||[]; // Adjusted to access lists correctly based on the typical API response
      } 
    } catch (error) {
      console.log("NYT error"); // Keeping your original error handling style
      setIsLoading(false);
      return []; // Ensuring the function returns an empty array on error
    }
  }


  const fetchBooks = async(query) =>{
    try{
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=6&key=AIzaSyA-PpwqzBUD3-6-6hfUJ3lWfvpbrw11vTY`);
      const data = await response.json();
      if (data.items) {
        // Sort books by published date in descending order
        data.items.sort((a, b) => {
          const dateA = a.volumeInfo.publishedDate ? new Date(a.volumeInfo.publishedDate) : new Date(0); // Use epoch date as fallback
          const dateB = b.volumeInfo.publishedDate ? new Date(b.volumeInfo.publishedDate) : new Date(0); // Use epoch date as fallback
          return dateB - dateA; // Descending order
        });
  
        // Filter unique titles and take only the first few if needed
        let seenTitles = new Set();
        let lst = data.items.filter(book => {
          let title = book.volumeInfo.title;
          if (!seenTitles.has(title)) {
            seenTitles.add(title);
            return true;
          }
          return false;
        });
  
        // Optionally slice the array if you need only a specific number of books
         lst = lst.slice(0, 6);
         console.log(lst.length)
        return lst.slice(0,1);
      }
      return []; // Return an empty array if no items are found
    }
    catch(error){
      console.error("Query error:", error);
      return [];
    }
  };
  
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
          <div className='section-title'>Summer Fantasy</div>
          <div className='book-grid'>
          {isLoading ? (
              <div>Loading...</div>
              ) : (
                summer.slice(0, 6).map((book) => (
                  <div key={book.id} className='book-item'>a
                    <img src={book.image} alt={book.title || 'Book title'} />
                  </div>)))}
          </div>
        </div>

        {/* NYT Best Sellers Section */}
        <div className='section'>
          <div className='section-title'>NYT Best Sellers</div>
            <div className='book-grid'>
            {isLoading ? (
              <div>Loading...</div>
              ) : (
                nyt.slice(0, 6).map((book) => (
                  <div key={book.id} className='book-item'>
                    <img src={book.book_image} alt={book.title || 'Book title'} />
                  </div>)))}

            </div>
        </div>


        {/* Timeless Classics Section */}
        <div className='section'>
          <div className='section-title'>Timeless Classics</div>
            <div className='book-grid'>
              {isLoading ? (
              <div>Loading...</div>
              ) : (
                classics.slice(0, 6).map((book) => (
                  <div key={book.id} className='book-item'>
                    <img src={book.volumeInfo?.imageLinks?.thumbnail} alt={book.volumeInfo?.title || 'Book title'} />
                  </div>)))}
          </div>
        </div>

        
      </div>
    </IconContext.Provider>
  );
}

export default App;
