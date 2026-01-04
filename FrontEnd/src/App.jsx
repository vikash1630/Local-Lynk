import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Index from './pages/Index.jsx';
import SignUp from './pages/SignUp.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Logout from './pages/Logout.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Products from './pages/SearchProducts.jsx';
import Profile from './pages/Profile.jsx';
import Community from './pages/Community.jsx';
import Chat from './pages/Chat.jsx';
import MyCart from './pages/MyCart.jsx';
import BuyNow from './pages/BuyNow.jsx';
import CheckOut from './pages/CheckOut.jsx';
import Sellproducts from './pages/Sellproducts.jsx';
import MyProducts from './pages/MyProducts.jsx';
import EditProfile from './pages/EditProfile.jsx';
import MyOrder from './pages/MyOrder.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import GuestProduct from './components/guestProduct.jsx';


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
    },
    {
      path: "/community",
      element: <Community />
      // to view community page
    },
    {
      path: "/chat/:friendId",
      element: <Chat />
      // to view chat page
    },
    {
      path: "/my-cart",
      element: <MyCart />
      // to view user's cart
    },
    {
      path: "/buy-now/:id",
      element: <BuyNow />
      // to view buy now page
    },
    {
      path: "checkout",
      element: <CheckOut />
      // to view checkout page
    },
    {
      path: "sell-products",
      element: <Sellproducts />
      // to view sell products page
    },
    {
      path: "/myproducts",
      element: <MyProducts />
      // to view ALL products sold 
    },
    {
      path: "/EditProfile",
      element: <EditProfile />
      // to edit profile
    },
    {
      path: "/MyOrders",
      element: <MyOrder />
    },
    {
      path: "/about",
      element: <About />
    },
    {
      path: "/Contact",
      element: <Contact />
    },
    {
      path: "/GuestProduct/:id",
      element: <GuestProduct />
    }
    

  ]);


  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  )
}

export default App


