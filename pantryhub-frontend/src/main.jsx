import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import './index.css';
import { AuthProvider } from "./firebase/AuthProvider";
//import { MarketplaceFormProvider } from "./components/forms/MarketplaceFormContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {/*<MarketplaceFormProvider> */}
        <RouterProvider router={router} />
    </AuthProvider>
  
  </React.StrictMode>,
);


