import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#333',
          border: '1px solid #ccc',
          padding: '12px',
          fontSize: '14px',
        },
        success: {
          style: {
            background: '#d1fae5',
            color: '#065f46',
          },
        },
        error: {
          style: {
            background: '#fee2e2',
            color: '#991b1b',
          },
        },
      }}
    />
  </React.StrictMode>,
);
