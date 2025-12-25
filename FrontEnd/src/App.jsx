import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Index from './pages';
import SignUp from './pages/SignUp.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Logout from './pages/Logout.jsx';


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
    }
  ]);


  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  )
}

export default App


