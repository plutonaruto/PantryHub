import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import './index.css';
import { AuthProvider } from "./firebase/AuthProvider";
//import { MarketplaceFormProvider } from "./context/MarketplaceFormContext";
import { Toaster } from 'react-hot-toast';
import { RecipeProvider } from './context/RecipeContext';
import { NotificationProvider } from './context/NotificationContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <RecipeProvider>
          {/* <MarketplaceFormProvider> */}
            <RouterProvider router={router} />
            <Toaster position="top-center" reverseOrder={false} />
          {/* </MarketplaceFormProvider> */}
        </RecipeProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode> 
);
