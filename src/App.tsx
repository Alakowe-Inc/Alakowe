import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import RootLayout from './layouts/RootLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Home from './pages/LandingPage/Home'
import BrowseBooks from './pages/LandingPage/BrowseBooks'
import BookDetail from './pages/LandingPage/BookDetail'
import Blog from './pages/LandingPage/Blog'
import Contact from './pages/LandingPage/Contact'
import FAQ from './pages/LandingPage/FAQ'
import HowItWorks from './pages/LandingPage/HowItWorks'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Cart from './pages/LandingPage/Cart'
import NotFound from './pages/NotFound'
import SellerOverview from './pages/Dashboard/Seller/SellerOverview'
import SellerListings from './pages/Dashboard/Seller/SellerListings'
import SellerOrders from './pages/Dashboard/Seller/SellerOrders'
import SellerEarnings from './pages/Dashboard/Seller/SellerEarnings'
import SellerPayment from './pages/Dashboard/Seller/SellerPayment'
import BuyerOrders from './pages/Dashboard/Buyer/BuyerOrders'
import AccountProfile from './pages/Dashboard/Account/AccountProfile'
import ChangePassword from './pages/Dashboard/Account/ChangePassword'
import DeleteAccount from './pages/Dashboard/Account/DeleteAccount'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'browse', element: <BrowseBooks /> },
      { path: 'books/:id', element: <BookDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'blog', element: <Blog /> },
      { path: 'contact', element: <Contact /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'how-it-works', element: <HowItWorks /> },
    ],
  },
  { path: 'login', element: <Login /> },
  { path: 'register', element: <Register /> },
  {
    path: 'dashboard',
    element: <DashboardLayout />,
    children: [
      { path: 'seller', element: <SellerOverview /> },
      { path: 'seller/listings', element: <SellerListings /> },
      { path: 'seller/orders', element: <SellerOrders /> },
      { path: 'seller/earnings', element: <SellerEarnings /> },
      { path: 'seller/payment', element: <SellerPayment /> },
      { path: 'buyer', element: <BuyerOrders /> },
      { path: 'account', element: <AccountProfile /> },
      { path: 'account/password', element: <ChangePassword /> },
      { path: 'account/delete', element: <DeleteAccount /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  )
}

export default App
