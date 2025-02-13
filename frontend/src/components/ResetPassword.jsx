import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [isResetFailed, setIsResetFailed] = useState(false);

  const { userInfo } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError('Both fields are required');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      try {
        const response = await axios.post('/api/users/reset-password', { password });

        if (response.data.success) {
          setIsResetSuccess(true);
        } else {
          setError(response.data.message || 'An error occurred');
          setIsResetFailed(true);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
        setIsResetFailed(true);
      }
    }
  };

  useEffect(() => {
    if (isResetSuccess) {
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    }

    if (isResetFailed) {
      setTimeout(() => {
        navigate('/forgot-password', { replace: true });
      }, 4000);
    }
  }, [isResetSuccess, isResetFailed, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-8">Reset Your Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd" />
              </svg>
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                className={`grow p-2 rounded w-full  text-white ${error ? 'border-red-500' : 'border-gray-300'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              {password && (
                <span
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <IoEyeOff className='text-black' /> : <IoEye className='text-black' />}
                </span>
              )}
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd" />
              </svg>
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                className={`grow p-2  rounded w-full text-white ${error ? 'border-red-500' : 'border-gray-300'}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
              {confirmPassword && (
                <span
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                >
                  {isConfirmPasswordVisible ? <IoEyeOff className='text-black' /> : <IoEye className='text-black' />}
                </span>
              )}
            </label>
          </div>

          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

          <button
              disabled={isResetSuccess || isResetFailed}
              type="submit"
              className="btn btn-primary text-white w-full my-4 disabled:bg-disabled-bg disabled:text-black disabled:cursor-not-allowed"
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
