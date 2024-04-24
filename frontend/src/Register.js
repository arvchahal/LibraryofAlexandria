import React, { useState } from 'react';

const Register = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Only necessary for registration

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', email, password);
    // Implement login functionality here
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registering with:', username, email, password);
    // Implement registration functionality here
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        <div className="container">
          {!isLogin && (
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
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
  );
}

export default Register;
