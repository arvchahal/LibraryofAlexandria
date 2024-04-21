import React, { useState } from 'react';
import "./search.css";
import { Link } from 'react-router-dom';
import NavBar from "./navbar";

const Search = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) {
      alert("Please enter a query");
      return;
    }
    setIsLoading(true);
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(search)}&key=AIzaSyA-PpwqzBUD3-6-6hfUJ3lWfvpbrw11vTY`;
      const response = await fetch(url);
      const data = await response.json();
      const sortedBooks = data.items ? data.items.map(book => ({
        id: book.id,
        title: book.volumeInfo.title,
        isbn13: book.volumeInfo.industryIdentifiers?.find(identifier => identifier.type === "ISBN_13")?.identifier || "ISBN not available",
        authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
        publishedDate: book.volumeInfo.publishedDate,
        image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150',
        infoLink: book.volumeInfo.infoLink
      })) : [];
      setResults(sortedBooks);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div className='main-wrapper'>
      <NavBar/>


    
      <div className="container">
      
        <form onSubmit={handleSearch} className="searchfunc">
          <div className="search">
            <input
              type="text"
             value={search}
             onChange={e => setSearch(e.target.value)}
            placeholder="Enter a book title or author"
                className="search-input" // Note: Adjust the class name based on your CSS
            />
         </div>
       </form>
        <div className='searchResults'>
          {isLoading ? <p>Loading...</p> : results.map(book => (
           <Link to ={`/book/${book.id}/${book.isbn13}`} className='bookLink'>
            <div key={book.id} className='book-item'>

               <img src={book.image} alt={book.title} />
            </div>
            </Link> ))}
       </div>
     </div>
    </div>
  );
};

export default Search;
