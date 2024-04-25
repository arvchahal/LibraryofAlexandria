import React, { useState, useEffect } from 'react';
import './App.css';
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import NavBar from './navbar';
import {classicNovels} from './constants'
import { AuthProvider } from './contexts/authContext';

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
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:fantasy+subject:%22Young%20Adult%20Fiction%22&maxResults=40&orderBy=newest&key=AIzaSyA-PpwqzBUD3-6-6hfUJ3lWfvpbrw11vTY`);

    const data = await response.json();
    if (data.items) {
      // Map items to extract necessary book information and sort them by publication date
      const sortedBooks = data.items
        .map(book => ({
          id: book.id,
          title: book.volumeInfo.title,
          isbn13: book.volumeInfo.industryIdentifiers?.find(identifier => identifier.type === "ISBN_13")?.identifier || "ISBN not available",

          authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
          publishedDate: book.volumeInfo.publishedDate,
          image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150',
          infoLink: book.volumeInfo.infoLink
        }))
        .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)); // Sorting by date, newest first
      const ag= getRandomBooks(40,sortedBooks)  
      setSummer(ag);
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
      } }
     catch (error) {
      console.log("NYT error"); // Keeping your original error handling style
      setIsLoading(false);
      return []; // Ensuring the function returns an empty array on error
    }
  }


  const fetchBooks = async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40&key=AIzaSyA-PpwqzBUD3-6-6hfUJ3lWfvpbrw11vTY`);
      const data = await response.json();
      if (data.items) {
        const sortedBooks = data.items
          .map(book => ({
            id: book.id,
            title: book.volumeInfo.title,
            isbn13: book.volumeInfo.industryIdentifiers?.find(identifier => identifier.type === "ISBN_13")?.identifier || "ISBN not available",

            authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
            publishedDate: book.volumeInfo.publishedDate,
            image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150',
            infoLink: book.volumeInfo.infoLink
          }))
          .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)); // Sorting by date, newest first
  
        // Optionally slice the array if you need only a specific number of books
        const filteredBooks = sortedBooks.slice(0, 1); // Assuming you want the top 6
        setIsLoading(false);
        return filteredBooks;
      } else {
        setIsLoading(false);
        return []; // Return an empty array if no items are found
      }
    } catch (error) {
      console.error('Query error:', error);
      setIsLoading(false);
      return [];
    }
  };
  
  
  return (
    <AuthProvider>
    <IconContext.Provider value={{ size: "30px", color:"#90bdc9" }}>
      <div className="App">
      <NavBar />

        {/* Latest Releases Section */}
        <div className='section'>
          <div className='section-title'>Summer Fantasy</div>
          <div className='book-grid'>
          {isLoading ? (
              <div>Loading...</div>
              ) : (
                
                summer.slice(0, 6).map((book) => (

                  <Link to ={`/book/${book.id}/${book.isbn13}`} className='bookLink'>
                  <div key={book.id} className='book-item'>
                    <img src={book.image} alt={book.title || 'Book title'} />
                  </div></Link>)))}
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
                  <Link to ={`/book/${book.id}/${book.primary_isbn13}`} className='bookLink'>
                  <div key={book.id} className='book-item'>
                    <img src={book.book_image} alt={book.title || 'Book title'} />
                  </div>
                  </Link>)))}

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
                  <Link to ={`/book/${book.id}/${book.isbn13}`} className='bookLink'>
                  <div key={book.id} className='book-item'>
                    <img src={book.image} alt={book.title || 'Book title'} />
                  </div></Link>)))
                  }
          </div>
        </div>

        
      </div>
    </IconContext.Provider>
    </AuthProvider>
  );
}

export default App;
