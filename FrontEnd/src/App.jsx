import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Index from './pages';
import SignUp from './pages/SignUp.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Logout from './pages/Logout.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Products from './pages/Products.jsx';
import Profile from './pages/Profile.jsx';


const App = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Index />
      // for guest or new users
    },
    {
      path: "/signup",
      element: <SignUp />
      // for new users to create an account
    },
    {
      path: "/login",
      element: <Login />
      // for existing users to log in
    },
    {
      path: "/home",
      element: <Home />
      // for authenticated users
    },
    {
      path: "/logout",
      element: <Logout />
      // to log out users
    },
    {
      path: "/products",
      element: <Products />
      // to view all products
    },
    {
      path: "/product/:id",
      element: <ProductDetails />
      // to view product details
    },
    {
      path: "/profile",
      element: <Profile />
      // to view user profile
    }
  ]);


  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  )
}

export default App


