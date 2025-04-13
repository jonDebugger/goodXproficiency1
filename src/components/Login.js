import React, { useState } from 'react';
import { authService } from "../services/authService";
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const asciiArt = ` 
                                                                                                      ██         
                                                                                                    ████         
                                                                             █                     █████         
                                                                           ████                   █████          
                                                                          █████                  ████            
                                                                          █████                ███               
                                                                           █████              ███                
            ███████                                               ██████   █████            ███                  
         ██████████████                                           ██████   █████           ███                   
        ███████████████                                           ██████    █████         ██                     
       ██████      ████    ██████████       █████████       ████████████     ██████      ███                      
      ██████             █████████████    ████████████    ██████ ███████     ██████    ██                        
      ██████   ████████  ██████  ██████   ███████   ███  ██████   ██████      ██████ ███                         
      ██████   ████████ ██████    ██████ ████       ████ ██████   ██████       ████████                          
      ███████     █████ ██████    ██████ ██      ██ ████ ██████   ██████    █    ███████                         
       ████████████████  ██████  ██████   ██      █████  ███████ ███████    █    █████████                       
        ███████████████   ████████████     ███████████    ██████████████    █   ███  ████████                    
          ███████████      █████████        ████████        █████ ██████   ██  ██       ████████                 
                                                                           █████            ███████              
                                                                           ████                  █████           
                                                                          ███                                    
                                                                          ██                                     
                                                                         ██                                      
                                                                        █                                        
`

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);


    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    try {
      const response = await authService.login(username, password);
      console.log('Logged in:', response);
      if (response.error) {
        setError('Login failed. Please check your credentials. ');
      } else {
        setSuccess(true);
        await delay(1000);
        navigate('/dashboard');

        const userData = response.data;
        document.cookie = `uuid=${userData.data.uid};max-age=259200;path=/`; console.log('User ID:', userData.data.uid);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 ">
      <div className='pb-5 min-h-[700px] justify-center p-5 border rounded-md shadow-md'
        style={{
          backgroundColor: '#1e1e2e',
          borderColor: '#585b70', // subtle border
        }}
      >      <div className="bg-[#181825] text-[#a6adc8] px-3 py-1 rounded-t flex items-center">
          <span className="text-xs">login.js</span>
        </div>  <div className="p-4 max-w-full overflow-auto">
          <p>></p>
          <p
            className="font-mono text-xs sm:text-sm whitespace-pre p-4 rounded-md bg-[#1e1e2e] text-[#7e9cd8]"
            style={{ lineHeight: '1.2', fontSize: '8px' }}
          >
            {asciiArt}
          </p>
        </div>

        <form onSubmit={handleLogin} className="login-form font-mono pb-5">
          <h2 className=' border-b-2 border-dashed border-[#f9e2af] pb-2 font-mono text-[#f9e2af]'>
            $ Login:
          </h2>
          <div className="form-group flex items-center space-x-2 pt-5">
            <label htmlFor="username" className="text-[#89dceb] text-sm">$ Username:</label>
            <input
              className="bg-[#313244] text-[#cdd6f4] border border-[#585b70] p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#89b4fa] font-mono text-xs"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group flex items-center space-x-2">
            <label htmlFor="password" className="text-[#89dceb] text-sm">$ Password:</label>
            <input
              className="bg-[#313244] text-[#cdd6f4] border border-[#585b70] p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#89b4fa] font-mono text-xs"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>


          <button className='' type="submit" disabled={loading}
            style={{ color: '#cba6f7', borderColor: '#cba6f7' }}
          >
            {loading ? '[Logging in...]' : '[Login]'}
          </button>
        </form>
        <div className="flex-col border-t-2 border-dashed border-[#f9e2af]">
          <p>>
            {error && (
              <>
                <span className="text-sm font-mono" style={{ color: '#f38ba8' }}>
                  {error}
                </span>
                <br />
                <span>> </span>
              </>
            )}
            {success && (
              <>
                <span className="text-sm success-message font-mono" style={{ color: '#a5e3a4' }}>
                  Login successful!
                </span>
                <br />
                <span>></span>
              </>
            )}
            <span className="blinking-cursor">|</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;


