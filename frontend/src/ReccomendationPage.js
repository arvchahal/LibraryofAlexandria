import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './navbar';
import { useAuth } from './contexts/authContext';
import BACKEND_URL from './config';
import "./ReccomendationPage.css";

const RecommendationPage = () => {
  const { currentUser, currentUserToken } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookDetailsFromGoogleBooks = useCallback((books) => {
    if (books.length === 0) {
      setError("No recommendations available.");
      setLoading(false);
      return;
    }

    const delayBetweenRequests = 10;

    const fetchBook = (book, index) => new Promise((resolve, reject) => setTimeout(async () => {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(book.title)}&key=AIzaSyA-PpwqzBUD3-6-6hfUJ3lWfvpbrw11vTY`);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const volumeInfo = data.items[0].volumeInfo;
          resolve({
            id: data.items[0].id,
            title: volumeInfo.title,
            isbn13: volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier || 'No ISBN-13',
            isbn10: volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_10")?.identifier || 'No ISBN-10',
            description: volumeInfo.description || 'No description available',
            authors: volumeInfo.authors?.join(', ') || 'Unknown Author',
            publishedDate: volumeInfo.publishedDate || 'No publication date',
            image: volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150',
            infoLink: volumeInfo.infoLink || '#'
          });
        } else {
          reject('No data found for this book');
        }
      } catch (error) {
        console.error('Failed to fetch book details:', error);
        reject(error.toString());
      }
    }, index * delayBetweenRequests));

    Promise.all(books.map((book, index) => fetchBook(book, index)))
      .then(booksDetails => {
        setRecommendations(booksDetails);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch book details: ' + error);
        setLoading(false);
      });
  }, []);

  const generateRecommendations = useCallback(async (userId, token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/get-user-books/${userId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('fetched')
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Backend data:', data);  // Log the received data
  
      if (data.recommendations && data.recommendations.length > 0) {
        fetchBookDetailsFromGoogleBooks(data.recommendations);
      } else {
        setError('No recommendations found');
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to generate new recommendations:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [fetchBookDetailsFromGoogleBooks]);
  
  

  const checkFirebaseForRecommendations = useCallback((userId) => {
    const firebaseURL = `https://libofalex-8397c-default-rtdb.firebaseio.com/userRecs/${userId}.json`;
    fetch(firebaseURL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch from Firebase');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.recommendations && data.recommendations.length > 0) {
          
          fetchBookDetailsFromGoogleBooks(data.recommendations.slice(0, 3).map(title => ({ title })));
        } else {
          console.log('ok')
          generateRecommendations(userId, currentUserToken);
        }
      })
      .catch(error => {
        console.error('Failed to fetch recommendations from Firebase:', error);
        setError('Failed to fetch recommendations');
        setLoading(false);
      });
  }, [currentUserToken, generateRecommendations, fetchBookDetailsFromGoogleBooks]);
  
  useEffect(() => {
    if (currentUser && currentUserToken) {
      checkFirebaseForRecommendations(currentUser.uid);
    } else {
      setLoading(false);
    }
  }, [currentUser, currentUserToken, checkFirebaseForRecommendations]);

  return (
    <div>
      <NavBar />
      {loading && <div className="loading">Loading recommendations...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && recommendations.length > 0 ? (
        <div className="content">
          <div className="book-grid-rec">
            {recommendations.map((book, index) => (
              <Link key={index} to={`/book/${book.id}/${book.isbn10}/${book.isbn13}`} className="book-item-rec">
                <img src={book.image} alt={`Cover of ${book.title}`} />
              </Link>
            ))}
          </div>
          <button className="generate-button" onClick={() => generateRecommendations(currentUser.uid, currentUserToken)}>Generate New Recommendations</button>
        </div>
      ) : (
        !loading && <div className="no-recommendations">{error || "No recommendations available. Please add more books or log in to see recommendations."}</div>
      )}
    </div>
  );
};

export default RecommendationPage;
