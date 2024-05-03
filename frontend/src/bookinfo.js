import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from './navbar';
import "./bookinfo.css";
import { AuthProvider, AuthContext } from './contexts/authContext';
import { db } from './firebase/firebase'; // Ensure you import your Firebase config correctly
import { ref, set, onValue, remove } from 'firebase/database';

const BookInfo = () => {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookInLibrary, setIsBookInLibrary] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const res = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyA-PpwqzBUD3-6-6hfUJ3lWfvpbrw11vTY`;
        const response = await fetch(res);
        const data = await response.json();

        if (data.items) {
          const bookData = {
            title: data.items[0].volumeInfo.title,
            isbn13: data.items[0].volumeInfo.industryIdentifiers.find(id => id.type === "ISBN_13")?.identifier,
            description: data.items[0].volumeInfo.description,
            authors: data.items[0].volumeInfo.authors ? data.items[0].volumeInfo.authors.join(', ') : 'Unknown Author',
            publishedDate: data.items[0].volumeInfo.publishedDate,
            image: data.items[0].volumeInfo.imageLinks ? data.items[0].volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150',
            infoLink: data.items[0].volumeInfo.infoLink
          };

          setBook(bookData);
        } else {
          setBook(null);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Fetching book data error:", error);
        setIsLoading(false);
      }
    };

    fetchDetails();

    if (currentUser) {
      const bookRef = ref(db, `userBooks/${currentUser.uid}/${isbn}`);
      onValue(bookRef, (snapshot) => {
        setIsBookInLibrary(snapshot.exists());
      });
    }
  }, [currentUser, isbn]); // Dependency array to rerun the effect if id or currentUser changes

  const handleAddBook = async () => {
    if (currentUser) {
      const bookRef = ref(db, `userBooks/${currentUser.uid}/${isbn}`);
      await set(bookRef, book);
      setIsBookInLibrary(true);
      console.log("Book added to library successfully");
      navigate('/Library'); // Navigate to library page
    } else {
      navigate('/Register'); // Redirect to login page if not logged in
    }
  };

  const deleteBookFromLibrary = async () => {
    if (currentUser) {
      const bookRef = ref(db, `userBooks/${currentUser.uid}/${isbn}`);
      await remove(bookRef);
      setIsBookInLibrary(false);
      navigate('/Library');
      console.log("Book removed from library successfully");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!book) return <div className="error-message">Sorry, book not found.</div>;

  return (
    <AuthProvider>
      <div>
        <NavBar/>
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
          {isBookInLibrary ? (
            <button className="libButton" onClick={deleteBookFromLibrary}>
              Remove from bookshelf
            </button>
          ) : (
            <button className="libButton" onClick={handleAddBook}>
              Add to bookshelf
            </button>
          )}
        </div>
      </div>
    </AuthProvider>
  );
};

export default BookInfo;
