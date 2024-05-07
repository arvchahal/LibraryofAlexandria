import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../../firebase/firebase';
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = React.createContext({
  currentUser: null,
  currentUserToken: null, // Add token to the context
  userLoggedIn: false,
  loading: true
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserToken, setCurrentUserToken] = useState(null); // State to store the token
  const [userLoggedIn, setLogin] = useState(false);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async user => {
          if (user) {
              setCurrentUser(user);
              setLogin(true);
              const token = await user.getIdToken(); // Fetch the token
              setCurrentUserToken(token); // Store the token
          } else {
              setCurrentUser(null);
              setCurrentUserToken(null); // Clear the token when there is no user
              setLogin(false);
          }
          setIsLoading(false);
      });
      return () => unsubscribe();
  }, []);

  const value = {
      currentUser,
      currentUserToken, // Provide the token through context
      userLoggedIn,
      loading,
  };

  return (
      <AuthContext.Provider value={value}>
          {!loading && children}
      </AuthContext.Provider>
  );
}

export default useAuth;