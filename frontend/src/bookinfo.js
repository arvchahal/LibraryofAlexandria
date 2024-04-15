import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BookInfo = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        // Assuming you have the correct API key and the URL is formed properly
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=YOUR_API_KEY`);
        const data = await response.json();
        // Assuming the API returns a single book object in data
        if (data.volumeInfo) {
          const bookData = {
            title: data.volumeInfo.title,
            authors: data.volumeInfo.authors ? data.volumeInfo.authors.join(', ') : 'Unknown Author',
            publishedDate: data.volumeInfo.publishedDate,
            image: data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150',
            infoLink: data.volumeInfo.infoLink
          };

          setBook(bookData);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Fetching book data error:", error);
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]); // Dependency array to rerun the effect if id changes

  if (isLoading) return <div>Loading...</div>;
  if (!book) return <div>No book found.</div>;

  return (
    <div>
      <h1>{book.title}</h1>
      <img src={book.image} alt={`Cover of ${book.title}`} />
      <p>Authors: {book.authors}</p>
      <p>Add to bookshelf</p>
      {/* You can add more details here */}
    </div>
  );
}

export default BookInfo;
