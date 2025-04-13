import React, { useState } from 'react';
import {tryCatch } from './tryCatch'

const LoginTest = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    
    const loginResult = await tryCatch(async () => {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: {
            timeout: 259200
          },
          auth: [
            [
              "password",
              {
                username: "applicant_002", // Replace with actual username
                password: "applica_2"  // Replace with actual password
              }
            ]
          ]
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    }, "Login API Call");
    
    if (loginResult.error) {
      setError(loginResult.error.message);
      console.error('Login error:', loginResult.error);
    } else {
      setResponse(loginResult.data);
      console.log('Login response:', loginResult.data);
    }
    
    setLoading(false);
  };
  
  return (
    <div className="login-test">
      <h2>Login API Test</h2>
      <button 
        onClick={handleLogin} 
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Test Login Endpoint'}
      </button>
      
      {error && (
        <div className="error">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {response && (
        <div className="response">
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LoginTest;
