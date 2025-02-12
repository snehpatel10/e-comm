import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import axios from 'axios'; // Import axios

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [isResetFailed, setIsResetFailed] = useState(false); // New state for failed reset

  const { userInfo } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for password matching and non-empty fields
    if (!password || !confirmPassword) {
      setError('Both fields are required');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      try {
        // Send API request to reset password
        const response = await axios.post('/api/users/reset-password', { password });

        if (response.data.success) {
          // If password reset is successful, show success message
          setIsResetSuccess(true);
        } else {
          setError(response.data.message || 'An error occurred');
          setIsResetFailed(true); // Mark the reset as failed
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
        setIsResetFailed(true); // Mark the reset as failed
      }
    }
  };

  // Redirect to login after 3 seconds if reset is successful
  useEffect(() => {
    if (isResetSuccess) {
      setTimeout(() => {
        navigate('/login', { replace: true }); // Redirect to login page
      }, 3000); // 3 seconds delay
    }

    if (isResetFailed) {
      // Redirect to forgot password page after 4 seconds on failure
      setTimeout(() => {
        navigate('/forgot-password', { replace: true }); // Redirect to forgot-password page
      }, 4000); // 4 seconds delay
    }
  }, [isResetSuccess, isResetFailed, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-8">Reset Your Password</h1>
        <form onSubmit={handleSubmit}>
          {/* Enter Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Enter your new password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                className={`mt-1 p-2 border rounded w-full bg-[#2c2c2c] text-white ${error ? 'border-red-500' : 'border-gray-300'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              {password && (
                <span
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <IoEyeOff className='text-black' /> : <IoEye className='text-black' />}
                </span>
              )}
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
              Confirm your new password
            </label>
            <div className="relative">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                className={`mt-1 p-2 border rounded w-full bg-[#2c2c2c] text-white ${error ? 'border-red-500' : 'border-gray-300'}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
              {confirmPassword && (
                <span
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                >
                  {isConfirmPasswordVisible ? <IoEyeOff className='text-black' /> : <IoEye className='text-black' />}
                </span>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 focus:outline-none"
          >
            Reset Password
          </button>
        </form>

        {isResetSuccess && (
          <div className="mt-4 text-green-500 text-sm text-center">
            <p>Password has been reset successfully. Redirecting to login...</p>
          </div>
        )}

        {isResetFailed && (
          <div className="mt-4 text-red-500 text-sm text-center">
            <p>Password reset failed. Redirecting to forgot password page...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
