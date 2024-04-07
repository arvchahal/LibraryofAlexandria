import React, { useState, useEffect } from 'react';
import './App.css';
import { ImBooks } from "react-icons/im"; // users library with books they have read
import { CiSearch } from "react-icons/ci"; //search icon for searching different books
import { HiBuildingLibrary } from "react-icons/hi2"; //library icon returns to the homepage
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';

function App() {
  const [latestRels, setRels] = useState([]);
  const[classics, setClassics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const classicNovels =[
  { title: "Pride and Prejudice", author: "Jane Austen" },
  { title: "Moby-Dick", author: "Herman Melville" },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { title: "Crime and Punishment", author: "Fyodor Dostoevsky" },
  { title: "To Kill a Mockingbird", author: "Harper Lee" },
  { title: "1984", author: "George Orwell" },
  { title: "The Catcher in the Rye", author: "J.D. Salinger" },
  { title: "The Odyssey", author: "Homer" },
  { title: "War and Peace", author: "Leo Tolstoy" },
  { title: "The Lord of the Rings", author: "J.R.R. Tolkien" },
  {title: "The Stranger", author:'Albert Camus'}
  



  ]
  function getRandomBooks(n = 6) {
    const shuffled = classicNovels.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  useEffect(() =>{
  fetchBooks('new+release').then((books) => setRels(books));
  fetchBooksClassics();
  
},[])
  const fetchBooksClassics = async() => {
    setIsLoading(true);
    const random = getRandomBooks(6);
    const books = await Promise.all(random.map(book=>{
      const query = `intitle:"${book.title}" inauthor:"${book.author}"`;
      return fetchBooks(query);
    }));
    setClassics(books.flat());
    setIsLoading(false);


  }
  const fetchBooks = async(query) =>{
    try{
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults =6&key=AIzaSyA-PpwqzBUD3-6-6hfUJ3lWfvpbrw11vTY`);
      const data = await response.json();
      return data.items ||[];

    }
    catch(error){
      console.error("query error");
      return;
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
          <div className='section-title'>Latest Releases</div>
          <div className='book-grid'>
  
          </div>
        </div>

        {/* NYT Best Sellers Section */}
        <div className='section'>
          <div className='section-title'>NYT Best Sellers</div>
            <div className='book-grid'>
              {latestRels.map((book)=>
              <div key ={book.id} className = 'book-item'>
                {/* <img src= {book.volumeInfo.imageLinks.thumbnail} alt ={book.volumeInfo.title}/> */}
              </div>
            )}

            </div>
        </div>


        {/* Timeless Classics Section */}
        <div className='section'>
          <div className='section-title'>Timeless Classics</div>
          <div className='book-grid'>
            {isLoading ? (
              <div>Loading...</div>
            ) : 
            (
              classics.map((book) => (
            <div key={book.id} className='book-item'>
              <img src={book.volumeInfo?.imageLinks?.thumbnail} alt={book.volumeInfo?.title || 'Book title'} />
            </div>
            ))
          )}

          </div>
        </div>
        
      </div>
    </IconContext.Provider>
  );
}

export default App;
