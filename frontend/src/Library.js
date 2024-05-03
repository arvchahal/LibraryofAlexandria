import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Correct import of Link
import { useAuth } from './contexts/authContext';
import NavBar from './navbar';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase/firebase';
import './library.css'
const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login'); // Redirect to login if no user is logged in
    } else {
      const booksRef = ref(db, 'userBooks/' + currentUser.uid);
      onValue(booksRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedBooks = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setBooks(loadedBooks);
        } else {
          setBooks([]);
        }
        setLoading(false);
      }, {
        onlyOnce: true
      });
    }
  }, [currentUser, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='lib'>
      <NavBar/>
      <div className="book-grid-lib">
        {books.length > 0 ? (
          books.map(book => (
            <div key={book.id} className="book-item-lib">
              <Link to={`/book/${book.id}/${book.isbn13}`}>
                <img src={book.image || 'https://via.placeholder.com/150'} alt={`Cover of ${book.title}`} />
                
              </Link>
            </div>
          ))
        ) : (
          <p className='empty'>This library is empty. Add some books.</p>
        )}
      </div>
    </div>
  );
}

export default Library;
