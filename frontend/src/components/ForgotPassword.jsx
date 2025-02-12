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
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              className={`mt-1 p-2 border rounded w-full bg-[#2c2c2c] text-white ${error ? 'border-red-500' : 'border-gray-300'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          </div>

          {/* Send Link Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:hover:bg-pink-400 disabled:bg-pink-400 disabled:cursor-not-allowed focus:outline-none"
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
          <p className="text-sm text-gray-600">
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
