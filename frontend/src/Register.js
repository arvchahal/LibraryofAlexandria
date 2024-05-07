import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/authContext'; // Adjust the import path according to your project structure
import { doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword } from './firebase/auth.js';
import './Register.css';
import NavBar from './navbar.js';
//import auth from "./firebase/firebase.js"

const Register = () => {
  const { currentUser, setCurrentUserToken } = useAuth(); // Assuming useAuth provides a way to set the current user token
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [redirect, setRedirect] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await doSignInWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken(); // Fetch the Firebase auth token
      setCurrentUserToken(token); // Store the token using a context method or similar approach
      setRedirect(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await doCreateUserWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken(); // Fetch the Firebase auth token after registration
      setCurrentUserToken(token); // Store the token
      setRedirect(true);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  // Redirect when logged in
  useEffect(() => {
    if (currentUser) {
      setRedirect(true);
    }
  }, [currentUser]);

  if (redirect) {
    return <Navigate to="/Main" replace={true} />;
  }

  return (
    <AuthProvider>
      <div>
        <NavBar />
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <div className="container">
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            <button type="button" onClick={toggleForm}>
              {isLogin ? 'Need to create an account?' : 'Already have an account?'}
            </button>
          </div>
        </form>
      </div>
    </AuthProvider>
  );
}

export default Register;
