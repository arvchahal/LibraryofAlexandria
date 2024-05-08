import React, { useState, useEffect, useCallback } from 'react';
import NavBar from './navbar';
import { useAuth } from './contexts/authContext'; // Ensure this is the correct import path for your useAuth hook
import BACKEND_URL from './config';

const RecommendationPage = () => {
  const { currentUser, currentUserToken } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookDetailsFromGoogleBooks = useCallback((books) => {
    Promise.all(
      books.map(book =>
        fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(book.title)}&key=AIzaSyA-PpwqzBUD3-6-6hfUJ3lWfvpbrw11vTY`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch book details');
          }
          return response.json();
        })
        .then(result => result.items ? result.items[0].volumeInfo : null)
      )
    )
    .then(booksDetails => {
      setRecommendations(booksDetails.filter(book => book));
      setLoading(false);
    })
    .catch(error => {
      console.error('Failed to fetch book details from Google Books:', error);
      setError(error.message);
      setLoading(false);
    });
  }, []);

  const generateRecommendations = useCallback((userId, token) => {
    fetch(`${BACKEND_URL}/get-user-books/${userId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      if (data.recommendations && data.recommendations.length > 0) {
        fetchBookDetailsFromGoogleBooks(data.recommendations);
      } else {
        setError('No recommendations found');
        setLoading(false);
      }
    })
    .catch(error => {
      console.error('Failed to generate new recommendations:', error);
      setError(error.message);
      setLoading(false);
    });
  }, [fetchBookDetailsFromGoogleBooks]);

  const checkFirebaseForRecommendations = useCallback((userId) => {
    const firebaseURL = `https://libofalex-8397c-default-rtdb.firebaseio.com/userRecs/${userId}/recommendations.json`;
    fetch(firebaseURL)
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          fetchBookDetailsFromGoogleBooks(data.slice(20).map(title => ({ title })));
        } else {
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
      {loading && <p>Loading recommendations...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <div>
          <button onClick={() => generateRecommendations(currentUser.uid, currentUserToken)}>Generate New Recommendations</button>
          {recommendations.length > 0 ? (
            <div>
              <h2>Book Recommendations</h2>
              <ul>
                {recommendations.map((book, index) => (
                  <li key={index}>
                    <img src={book.imageLinks?.thumbnail || 'https://via.placeholder.com/100x150'} alt={`Cover of the book ${book.title}`} style={{ width: '100px', height: '150px' }} />
                    <div>{book.title}</div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No recommendations available. Please check Add more books or log in to see recommendations.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;
