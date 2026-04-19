import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import RootLayout from './layouts/RootLayout'
import Home from './pages/LandingPage/Home'
import BrowseBooks from './pages/LandingPage/BrowseBooks'
import BookDetail from './pages/LandingPage/BookDetail'
import Blog from './pages/LandingPage/Blog'
import Contact from './pages/LandingPage/Contact'
import FAQ from './pages/LandingPage/FAQ'
import HowItWorks from './pages/LandingPage/HowItWorks'
import Login from './pages/Auth/Login'
import Cart from './pages/LandingPage/Cart'
import Checkout from './pages/LandingPage/Checkout'
import PaymentSuccess from './pages/LandingPage/PaymentSuccess'
import PaymentFailed from './pages/LandingPage/PaymentFailed'
import OrderStatus from './pages/LandingPage/OrderStatus'
import Dispute from './pages/LandingPage/Dispute'
import Profile from './pages/LandingPage/Profile'
import Sell from './pages/LandingPage/Sell'
import ListBook from './pages/LandingPage/ListBook'
import ListingSubmitted from './pages/LandingPage/ListingSubmitted'
import MyListings from './pages/LandingPage/MyListings'
import EditListing from './pages/LandingPage/EditListing'
import SellerOrders from './pages/LandingPage/SellerOrders'
import SellerEarnings from './pages/LandingPage/SellerEarnings'
import RequestBook from './pages/LandingPage/RequestBook'
import MyRequests from './pages/LandingPage/MyRequests'
import AllRequests from './pages/LandingPage/AllRequests'
import CustomerService from './pages/LandingPage/CustomerService'
import ShippingReturns from './pages/LandingPage/ShippingReturns'
import PrivacyPolicy from './pages/LandingPage/PrivacyPolicy'
import TermsConditions from './pages/LandingPage/TermsConditions'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'browse', element: <BrowseBooks /> },
      { path: 'books/:id', element: <BookDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <ProtectedRoute><Checkout /></ProtectedRoute> },
      { path: 'payment/success', element: <PaymentSuccess /> },
      { path: 'payment/failed', element: <PaymentFailed /> },
      { path: 'order/:orderId', element: <OrderStatus /> },
      { path: 'order/:orderId/dispute', element: <Dispute /> },
      { path: 'account', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: 'sell', element: <Sell /> },
      { path: 'list', element: <ProtectedRoute><ListBook /></ProtectedRoute> },
      { path: 'listing-submitted', element: <ListingSubmitted /> },
      { path: 'my-listings', element: <ProtectedRoute><MyListings /></ProtectedRoute> },
      { path: 'my-listings/:id/edit', element: <ProtectedRoute><EditListing /></ProtectedRoute> },
      { path: 'my-sales', element: <ProtectedRoute><SellerOrders /></ProtectedRoute> },
      { path: 'my-earnings', element: <ProtectedRoute><SellerEarnings /></ProtectedRoute> },
      { path: 'request', element: <ProtectedRoute><RequestBook /></ProtectedRoute> },
      { path: 'my-requests', element: <ProtectedRoute><MyRequests /></ProtectedRoute> },
      { path: 'requests', element: <AllRequests /> },
      { path: 'customer-service', element: <CustomerService /> },
      { path: 'shipping', element: <ShippingReturns /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <TermsConditions /> },
      { path: 'blog', element: <Blog /> },
      { path: 'contact', element: <Contact /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'how-it-works', element: <HowItWorks /> },
    ],
  },
  { path: 'login', element: <Login /> },
  {
    path: '*',
    element: <NotFound />,
  },
])

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
