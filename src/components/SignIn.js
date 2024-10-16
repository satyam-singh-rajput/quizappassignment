// src/components/SignIn.js
import React, { useState } from 'react';
import { useUser } from '../UserContext'; // Import UserContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import "../css/SignIn.css";

const SignIn = () => {
  const { login } = useUser(); // Get login function from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for login error
  const navigate = useNavigate(); // To redirect after successful login

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded admin credentials
    if (email === 'ut@gmail.com' && password === 'utkarsh') {
      // If admin, assign the role "admin"
      login({
        email,
        role: 'admin'
      });
      navigate('/'); // Redirect to home after login
    } else if (email && password) {
      // Assign normal user role for any other credentials
      login({
        email,
        role: 'user'
      });
      navigate('/'); // Redirect to home after login
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Sign In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignIn;
