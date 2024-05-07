import React, { useState, useEffect, useContext } from 'react';
import NavBar from './navbar';
import { useAuth } from './contexts/authContext'; // Ensure this is the correct import path for your useAuth hook
import { BACKEND_URL } from './config';

const RecommendationPage = () => {
  const { currentUser } = useAuth(); // Assuming useAuth returns the currentUser object
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchRecommendations(currentUser.uid);
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchRecommendations = (userId) => {
    fetch(`${BACKEND_URL}/get-user-books/${userId}`) // Adjust this API endpoint as necessary
      .then(response => response.json())
      .then(data => {
        setRecommendations(data);
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
      {recommendations ? (
        <div>
          <h2>Book Recommendations</h2>
          <ul>
            {recommendations.map(rec => (
              <li key={rec.id}>{rec.title}</li> // Assuming recommendations have an 'id' and 'title'
            ))}
          </ul>
        </div>
      ) : (
        <p>Please log in to get book recommendations.</p>
      )}
    </div>
  );
};

export default RecommendationPage;
