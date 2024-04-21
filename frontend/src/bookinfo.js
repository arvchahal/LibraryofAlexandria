import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./bookinfo.css"
const BookInfo = () => {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        // Assuming you have the correct API key and the URL is formed properly
        const res = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyA-PpwqzBUD3-6-6hfUJ3lWfvpbrw11vTY`
        const response = await fetch(res);
        const data = await response.json();
        // Assuming the API returns a single book object in data
        if (data.items) {
          const bookData = {
            title: data.items[0].volumeInfo.title,
            description: data.items[0].volumeInfo.description,
            authors: data.items[0].volumeInfo.authors ? data.items[0].volumeInfo.authors.join(', ') : 'Unknown Author',
            publishedDate: data.items[0].volumeInfo.publishedDate,
            image: data.items[0].volumeInfo.imageLinks ? data.items[0].volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150',
            infoLink: data.items[0].volumeInfo.infoLink
          };

          setBook(bookData);
         
        }
        else {
          setBook(null);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Fetching book data error:", error);
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [isbn]); // Dependency array to rerun the effect if id changes

  if (isLoading) return <div>Loading...</div>;
  if (!book) return <div className="error-message">Sorry, book not found.</div>;

  return (
    <div className="container">
      <div className="title">
        <h1>{book.title}</h1>
        <p>Authors: {book.authors}</p>
      </div>
      <div className="bookImage">
        <img src={book.image} alt={`Cover of ${book.title}`} />
      </div>
      <div className="bookDescription">
        <h2>{book.description}</h2>
      </div>
      <div className="libButton">
        <h2>Add to bookshelf</h2>
      </div>
    </div>
  );
}

export default BookInfo;
