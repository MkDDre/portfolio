import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './components/App';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import CartPage from './components/pages/CartPage';
import RegisterPage from './components/pages/RegisterPage';
import ProviderPortalPage from './components/pages/ProviderPortalPage';
import AdminPortalPage from './components/pages/AdminPortalPage';
import MyReservationsPage from './components/pages/MyReservationsPage';
import { AuthContextProvider } from './contexts/AuthContext';
import { CartContextProvider } from './contexts/CartContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'my-reservations', element: <MyReservationsPage /> },
      { path: 'provider', element: <ProviderPortalPage /> },
      { path: 'admin', element: <AdminPortalPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen bg-background text-foreground">
      <AuthContextProvider>
        <CartContextProvider>
          <RouterProvider router={router} />
        </CartContextProvider>
      </AuthContextProvider>
    </div>
  </React.StrictMode>,
);
