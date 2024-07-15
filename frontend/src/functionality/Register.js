import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/authContext'; // Adjust the import path according to your project structure
import { doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword } from './firebase/auth.js';
import './Register.css';
import NavBar from './navbar.js';

const Register = () => {
  const { currentUser, setCurrentUserToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await doSignInWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      setCurrentUserToken(token);
      setRedirect(true);
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        alert("Incorrect email or password.");
      } else {
        console.error('Login failed:', error);
      }
      setError('Login failed: ' + error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await doCreateUserWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      setCurrentUserToken(token);
      setRedirect(true);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert("Already have an account with this email.");
      } else {
        console.error('Registration failed:', error);
      }
      setError('Registration failed: ' + error.message);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

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
          {error && <p className="error-message">Incorrect Password or Not a valid account</p>}
        </form>
      </div>
    </AuthProvider>
  );
}

export default Register;
