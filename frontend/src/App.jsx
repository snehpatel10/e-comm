import { useState } from 'react';
import './index.css';
import React from 'react';
import { Outlet, useLocation, useMatch } from 'react-router-dom';
import Navigation from './pages/Auth/Navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();

  // Check if the current route matches the reset password pattern
  const isResetPassword = useMatch("/reset-password/:resetToken");

  // Routes where navbar should be hidden
  const hideNavbarRoutes = ['/forgot-password'];

  return (
    <>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#222', // Dark gray background
          color: '#fff',
          borderRadius: '12px', // Ensure rounded corners
          border: '2px solid transparent', // Transparent border for blending effect
          backgroundImage: 'linear-gradient(45deg, #222, #333)', // Subtle gradient for blending with the background
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)', // Deeper shadow for 3D effect
          fontSize: '16px',
          padding: '12px 20px',
          fontFamily: 'Quicksand, sans-serif', // Quicksand font
          transform: 'scale(1) perspective(600px) rotateY(0deg)', // 3D effect transform
          transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out', // smooth transitions
        }}
        progressStyle={{
          backgroundColor: '#ff9800',
        }}
        closeButtonStyle={{
          color: '#fff',
        }}
        onEnter={(toast) => {
          // Adding animation on toast enter for 3D effect
          toast.style.transform = 'scale(1.1) perspective(600px) rotateY(15deg)';
          toast.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4)'; // Deeper shadow on enter
        }}
        onExited={(toast) => {
          // Reset the transform and shadow when the toast exits
          toast.style.transform = 'scale(1) perspective(600px) rotateY(0deg)';
          toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)'; // Reset shadow
        }}
      />

      {/* Hide navbar for /forgot-password or any /reset-password route */}
      {!hideNavbarRoutes.includes(location.pathname) && !isResetPassword && <Navigation />}
      <main className='py-3'>
        <Outlet />
      </main>
    </>
  );
}

export default App;
