import React, { useState, useEffect } from 'react';
import NavBar from './navbar';
import { useAuth } from './contexts/authContext'; // Ensure this is the correct import path for your useAuth hook
import BACKEND_URL from './config';

const RecommendationPage = () => {
  const { currentUser, currentUserToken } = useAuth(); // Also get the currentUserToken from the context
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUserToken) { // Ensure both user and token are available
      fetchRecommendations(currentUser.uid, currentUserToken);
    } else {
      setLoading(false);
    }
  }, [currentUser, currentUserToken]); // Include currentUserToken in the dependency array

  const fetchRecommendations = (userId, token) => {
    fetch(`${BACKEND_URL}/get-user-books/${userId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Convert object to array
      const booksArray = Object.values(data);
      setRecommendations(booksArray);
      setLoading(false);
    })
    .catch(error => {
      console.error('Failed to fetch recommendations:', error);
      setLoading(false);
    });
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <p>Loading recommendations...</p>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      {recommendations.length > 0 ? (
        <div>
          <h2>Book Recommendations</h2>
          <ul>
            {recommendations.map((book, index) => (
              <li key={book.isbn10 || index}>
                <img src={book.image} alt={`Cover of the book ${book.title}`} style={{ width: '100px', height: '150px' }} />
                <div>{book.title}</div> {/* Optionally display the book title */}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No recommendations available. Please check Add more books or log in to see recommendations.</p>
      )}
    </div>
  );
};

export default RecommendationPage;
