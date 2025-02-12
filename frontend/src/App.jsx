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
          backgroundColor: '#444',
          color: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
          fontSize: '16px',
          padding: '12px 20px',
        }}
        progressStyle={{
          backgroundColor: '#ff9800',
        }}
        closeButtonStyle={{
          color: '#fff',
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
