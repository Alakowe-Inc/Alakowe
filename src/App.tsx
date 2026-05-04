import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
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
import SellerDropoff from './pages/LandingPage/SellerDropoff'
import MyPurchases from './pages/LandingPage/MyPurchases'
import SellerEarnings from './pages/LandingPage/SellerEarnings'
import SellerStorefront from './pages/LandingPage/SellerStorefront'
import RequestBook from './pages/LandingPage/RequestBook'
import MyRequests from './pages/LandingPage/MyRequests'
import AllRequests from './pages/LandingPage/AllRequests'
import CustomerService from './pages/LandingPage/CustomerService'
import ShippingReturns from './pages/LandingPage/ShippingReturns'
import PrivacyPolicy from './pages/LandingPage/PrivacyPolicy'
import TermsConditions from './pages/LandingPage/TermsConditions'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/pages/AdminLogin'
import { AdminAuthGuard } from './pages/admin/AdminAuth'
import { AdminLayout } from './components/admin/AdminLayout'
import Dashboard from './pages/admin/pages/Dashboard'
import Users from './pages/admin/pages/Users'
import Sellers from './pages/admin/pages/Sellers'
import Orders from './pages/admin/pages/Orders'
import Listings from './pages/admin/pages/Listings'
import Payments from './pages/admin/pages/Payments'
import Pickups from './pages/admin/pages/Pickups'
import DropOffs from './pages/admin/pages/DropOffs'
import Inventory from './pages/admin/pages/Inventory'
import Analytics from './pages/admin/pages/Analytics'
import Insights from './pages/admin/pages/Insights'
import Reports from './pages/admin/pages/Reports'
import Settings from './pages/admin/pages/Settings'
import AdminNotFound from './pages/admin/pages/NotFound'

function adminRoute(page: React.ReactNode) {
  return (
    <AdminAuthGuard>
      <AdminLayout>{page}</AdminLayout>
    </AdminAuthGuard>
  )
}

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
      { path: 'my-sales/:id/dropoff', element: <ProtectedRoute><SellerDropoff /></ProtectedRoute> },
      { path: 'my-earnings', element: <ProtectedRoute><SellerEarnings /></ProtectedRoute> },
      { path: 'request', element: <ProtectedRoute><RequestBook /></ProtectedRoute> },
      { path: 'my-purchases', element: <ProtectedRoute><MyPurchases /></ProtectedRoute> },
      { path: 'my-requests', element: <ProtectedRoute><MyRequests /></ProtectedRoute> },
      { path: 'requests', element: <AllRequests /> },
      { path: 'store/:email', element: <SellerStorefront /> },
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
  { path: 'admin/login', element: <AdminLogin /> },
  { path: 'admin', element: <AdminAuthGuard><Navigate to="/admin/dashboard" replace /></AdminAuthGuard> },
  { path: 'admin/dashboard', element: adminRoute(<Dashboard />) },
  { path: 'admin/users', element: adminRoute(<Users />) },
  { path: 'admin/sellers', element: adminRoute(<Sellers />) },
  { path: 'admin/orders', element: adminRoute(<Orders />) },
  { path: 'admin/listings', element: adminRoute(<Listings />) },
  { path: 'admin/payments', element: adminRoute(<Payments />) },
  { path: 'admin/pickups', element: adminRoute(<Pickups />) },
  { path: 'admin/drop-offs', element: adminRoute(<DropOffs />) },
  { path: 'admin/inventory', element: adminRoute(<Inventory />) },
  { path: 'admin/analytics', element: adminRoute(<Analytics />) },
  { path: 'admin/insights', element: adminRoute(<Insights />) },
  { path: 'admin/reports', element: adminRoute(<Reports />) },
  { path: 'admin/settings', element: adminRoute(<Settings />) },
  { path: 'admin/*', element: <AdminNotFound /> },
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
