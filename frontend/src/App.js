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
  const [nyt, setnyt] = useState([])

  const classicNovels = [
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
    { title: "The Stranger", author: "Albert Camus" },
    // Additional classic novels
    { title: "Jane Eyre", author: "Charlotte Brontë" },
    { title: "Wuthering Heights", author: "Emily Brontë" },
    { title: "Great Expectations", author: "Charles Dickens" },
    { title: "Anna Karenina", author: "Leo Tolstoy" },
    { title: "Madame Bovary", author: "Gustave Flaubert" },
    { title: "The Adventures of Huckleberry Finn", author: "Mark Twain" },
    { title: "Don Quixote", author: "Miguel de Cervantes" },
    { title: "Frankenstein", author: "Mary Shelley" },
    { title: "Brave New World", author: "Aldous Huxley" },
    { title: "Lolita", author: "Vladimir Nabokov" },
    { title: "Ulysses", author: "James Joyce" },
    { title: "The Picture of Dorian Gray", author: "Oscar Wilde" },
    { title: "The Grapes of Wrath", author: "John Steinbeck" },
    { title: "Heart of Darkness", author: "Joseph Conrad" },
    { title: "Les Misérables", author: "Victor Hugo" },
    { title: "One Hundred Years of Solitude", author: "Gabriel García Márquez" },
    { title: "Fahrenheit 451", author: "Ray Bradbury" },
    { title: "Dracula", author: "Bram Stoker" },
    { title: "A Tale of Two Cities", author: "Charles Dickens" }
  ];
  
  function getRandomBooks(n = 6) {
    const shuffled = classicNovels.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  useEffect(() =>{
  fetchBooks('new+release').then((books) => setRels(books));
  fetchBooksClassics();
  fetchNYT();
  
},[])
  const fetchBooksClassics = async() => {
    setIsLoading(true);
    const random = getRandomBooks(10);
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
          <div className='section-title'>Latest Releases</div>
          <div className='book-grid'>
  
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
