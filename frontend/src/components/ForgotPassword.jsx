import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux'
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate()
  const {userInfo} = useSelector(state => state.auth)

  useEffect(() => {
    if(userInfo) {
      navigate('/')
    }
  }, [userInfo, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (email) {
      setError(''); 
      
      try {
        setLoading(true)
        const response = await axios.post('/api/users/forgot-password', { email });

        if (response.status === 200) {
          // Simulate OTP sent on success
          setIsOtpSent(true);
          console.log('Reset link sent to:', email);
          setLoading(false)
        }
      } catch (err) {
        // Handle errors (e.g., user not found, server error)
        setError('Something went wrong. Please try again.');
        console.error('Error:', err);
        setLoading(false)
      }
    } else {
      setError('Email is required');
      setLoading(false)
    }
  };

  return ( 
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-8">Forgot Your Password?</h1>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-6">
              <label className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="text"
                  className={`grow p-3 bg-[#2c2c2c] text-white focus:outline-none transition-all ${error.email ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                />
              </label>
              {error.email && <div className="text-red-500 text-sm mt-1">{error.email}</div>}
            </div>

          {/* Send Link Button */}
          <button
              type="submit"
              className="w-full btn btn-primary mb-2 p-3 text-white disabled:bg-disabled-bg disabled:cursor-not-allowed disabled:text-black"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
        </form>

        {isOtpSent && (
          <div className="mt-4 text-green-500 text-sm text-center">
            <p>Reset link has been sent to your email. Please check your inbox. You can close this tab now.</p>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className=" text-gray-400">
            Remembered your password?{" "}
            <Link to="/login" className="text-pink-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
