import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../../firebase/firebase';
import { onAuthStateChanged } from "firebase/auth";
// import { doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword, doPasswordReset } from '../../firebase/auth'; // Adjust the path as necessary

export const AuthContext = React.createContext({
  currentUser: null,
  userLoggedIn: false,
  loading: true
});

export function useAuth(){
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setLogin] = useState(false);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, user => {
          if (user) {
              setCurrentUser(user);
              setLogin(true);
          } else {
              setCurrentUser(null);
              setLogin(false);
          }
          setIsLoading(false);
      });
      return () => unsubscribe();
  }, []);

  const value = {
      currentUser,
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