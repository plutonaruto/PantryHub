import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { RecipeProvider } from './context/RecipeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecipeProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} />
    </RecipeProvider>
  </React.StrictMode>
);
