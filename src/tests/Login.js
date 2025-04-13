import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tryCatch } from './tryCatch'; // Assuming this is a utility for try-catch blocks

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For navigating after a successful login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading spinner or disable button while loading

    const { data, error: apiError } = await tryCatch(
      axios.post('/api/session', {
        model: {
          timeout: 259200, // Set the timeout as 259200 (could be for 3 days or as per API documentation)
        },
        auth: [
          [
            "password",
            {
              username,
              password,
            },
          ],
        ],
      })
    );

    // If there's an error, show it
    if (apiError) {
      setError(apiError.message || "An unknown error occurred.");
    } else if (data && data.token) {
      // Handle successful login (e.g., store the token and navigate to dashboard)
      localStorage.setItem('authToken', data.token);
      navigate('/dashboard'); // Replace with the actual route
    } else {
      setError("Login failed. Unknown error.");
    }

    setIsLoading(false); // Reset loading state after the request
  };

  return (
    <div className="login-container">
      <h2>GoodX Auth</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Submit'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;

