import { useState } from 'react'
import './index.css'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from './pages/Auth/Navigation'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {

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
          backgroundColor: '#444',    // Slightly lighter dark background
          color: '#fff',               // White text
          borderRadius: '8px',         // Rounded corners
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)', // Soft shadow for contrast
          fontSize: '16px',            // Larger font for readability
          padding: '12px 20px',        // Padding for comfort
        }}
        progressStyle={{
          backgroundColor: '#ff9800',  // Bright orange progress bar
        }}
        closeButtonStyle={{
          color: '#fff',  // Light close button
        }}
      />
      <Navigation />
      <main className='py-3'>
        <Outlet />
      </main>
    </>
  )
}

export default App
