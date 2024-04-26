import React, { useState } from 'react';
import './search.css';
import { Link } from 'react-router-dom';
import NavBar from './navbar';
import { AuthProvider } from './contexts/authContext';

const Search = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) {
      alert('Please enter a query');
      return;
    }
    setIsLoading(true);
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(search)}&key=AIzaSyA-PpwqzBUD3-6-6hfUJ3lWfvpbrw11vTY`;
      const response = await fetch(url);
      const data = await response.json();
      const sortedBooks = data.items
        ? data.items.map((book) => ({
            id: book.id,
            title: book.volumeInfo.title,
            isbn13:
              book.volumeInfo.industryIdentifiers?.find((identifier) => identifier.type === 'ISBN_13')?.identifier ||
              'ISBN not available',
            authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
            publishedDate: book.volumeInfo.publishedDate,
            image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150',
            infoLink: book.volumeInfo.infoLink,
          }))
        : [];
      setResults(sortedBooks);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <AuthProvider>
      <div className="main-wrapper">
        <NavBar />
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <div className="search">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter a book title or author"
                className="search-input"
              />
            </div>
          </form>
          <div className="search-results">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              results.map((book) => (
                <Link to={`/book/${book.id}/${book.isbn13}`} className="bookLink" key={book.id}>
                  <div className="book-item">
                    <img src={book.image} alt={book.title} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default Search;
