import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Customer-facing
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/LandingPage/Home";
import BrowseBooks from "./pages/LandingPage/BrowseBooks";
import BookDetail from "./pages/LandingPage/BookDetail";
import Blog from "./pages/LandingPage/Blog";
import Contact from "./pages/LandingPage/Contact";
import FAQ from "./pages/LandingPage/FAQ";
import HowItWorks from "./pages/LandingPage/HowItWorks";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Cart from "./pages/LandingPage/Cart";
import Checkout from "./pages/LandingPage/Checkout";
import PaymentSuccess from "./pages/LandingPage/PaymentSuccess";
import PaymentFailed from "./pages/LandingPage/PaymentFailed";
import OrderStatus from "./pages/LandingPage/OrderStatus";
import Dispute from "./pages/LandingPage/Dispute";
import Profile from "./pages/LandingPage/Profile";
import Sell from "./pages/LandingPage/Sell";
import ListBook from "./pages/LandingPage/ListBook";
import ListingSubmitted from "./pages/LandingPage/ListingSubmitted";
import MyListings from "./pages/LandingPage/MyListings";
import EditListing from "./pages/LandingPage/EditListing";
import SellerOrders from "./pages/LandingPage/SellerOrders";
import SellerDropoff from "./pages/LandingPage/SellerDropoff";
import MyPurchases from "./pages/LandingPage/MyPurchases";
import SellerEarnings from "./pages/LandingPage/SellerEarnings";
import SellerStorefront from "./pages/LandingPage/SellerStorefront";
import RequestBook from "./pages/LandingPage/RequestBook";
import MyRequests from "./pages/LandingPage/MyRequests";
import AllRequests from "./pages/LandingPage/AllRequests";
import CustomerService from "./pages/LandingPage/CustomerService";
import ShippingReturns from "./pages/LandingPage/ShippingReturns";
import PrivacyPolicy from "./pages/LandingPage/PrivacyPolicy";
import TermsConditions from "./pages/LandingPage/TermsConditions";
import NotFound from "./pages/NotFound";

// Admin
import { AdminLayout } from "@/admin/components/AdminLayout";
import AdminLogin from "@/admin/pages/AdminLogin";
import { RequireAdmin } from "@/admin/pages/RequireAdmin";
import Dashboard from "@/admin/pages/Dashboard";
import Users from "@/admin/pages/Users";
import UserProfile from "@/admin/pages/UserProfile";
import Listings from "@/admin/pages/Listings";
import Orders from "@/admin/pages/Orders";
import Inventory from "@/admin/pages/Inventory";
import Payments from "@/admin/pages/Payments";
import PaymentDetail from "@/admin/pages/PaymentDetail";
import Pickups from "@/admin/pages/Pickups";
import DropoffBooks from "@/admin/pages/DropoffBooks";
import DropoffCentres from "@/admin/pages/DropoffCentres";
import DropoffDetail from "@/admin/pages/DropoffDetail";
import Analytics from "@/admin/pages/Analytics";
import Settings from "@/admin/pages/Settings";
import OrderDetail from "@/admin/pages/OrderDetail";
import ListingDetail from "@/admin/pages/ListingDetail";
import PickupDetail from "@/admin/pages/PickupDetail";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const adminWrap = (el: React.ReactNode) => (
  <RequireAdmin>
    <AdminLayout>{el}</AdminLayout>
  </RequireAdmin>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Customer site */}
              <Route path="/" element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path="browse" element={<BrowseBooks />} />
                <Route path="books/:id" element={<BookDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="payment/success" element={<PaymentSuccess />} />
                <Route path="payment/failed" element={<PaymentFailed />} />
                <Route path="order/:orderId" element={<OrderStatus />} />
                <Route path="order/:orderId/dispute" element={<Dispute />} />
                <Route path="account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="sell" element={<Sell />} />
                <Route path="list" element={<ProtectedRoute><ListBook /></ProtectedRoute>} />
                <Route path="listing-submitted" element={<ListingSubmitted />} />
                <Route path="my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
                <Route path="my-listings/:id/edit" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
                <Route path="my-sales" element={<ProtectedRoute><SellerOrders /></ProtectedRoute>} />
                <Route path="my-sales/:id/dropoff" element={<ProtectedRoute><SellerDropoff /></ProtectedRoute>} />
                <Route path="my-earnings" element={<ProtectedRoute><SellerEarnings /></ProtectedRoute>} />
                <Route path="request" element={<ProtectedRoute><RequestBook /></ProtectedRoute>} />
                <Route path="my-purchases" element={<ProtectedRoute><MyPurchases /></ProtectedRoute>} />
                <Route path="my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
                <Route path="requests" element={<AllRequests />} />
                <Route path="store/:email" element={<SellerStorefront />} />
                <Route path="customer-service" element={<CustomerService />} />
                <Route path="shipping" element={<ShippingReturns />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<TermsConditions />} />
                <Route path="blog" element={<Blog />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="how-it-works" element={<HowItWorks />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={adminWrap(<Dashboard />)} />
              <Route path="/admin/users" element={adminWrap(<Users />)} />
              <Route path="/admin/users/:id" element={adminWrap(<UserProfile />)} />
              <Route path="/admin/sellers" element={<Navigate to="/admin/users" replace />} />
              <Route path="/admin/listings" element={adminWrap(<Listings />)} />
              <Route path="/admin/listings/:id" element={adminWrap(<ListingDetail />)} />
              <Route path="/admin/orders" element={adminWrap(<Orders />)} />
              <Route path="/admin/orders/:id" element={adminWrap(<OrderDetail />)} />
              <Route path="/admin/inventory" element={adminWrap(<Inventory />)} />
              <Route path="/admin/payments" element={adminWrap(<Payments />)} />
              <Route path="/admin/payments/:id" element={adminWrap(<PaymentDetail />)} />
              <Route path="/admin/pickups" element={adminWrap(<Pickups />)} />
              <Route path="/admin/pickups/:id" element={adminWrap(<PickupDetail />)} />
              <Route path="/admin/dropoffs" element={<Navigate to="/admin/dropoffs/books" replace />} />
              <Route path="/admin/dropoffs/books" element={adminWrap(<DropoffBooks />)} />
              <Route path="/admin/dropoffs/books/:id" element={adminWrap(<DropoffDetail />)} />
              <Route path="/admin/dropoffs/centres" element={adminWrap(<DropoffCentres />)} />
              <Route path="/admin/analytics" element={adminWrap(<Analytics />)} />
              <Route path="/admin/reports" element={<Navigate to="/admin/analytics" replace />} />
              <Route path="/admin/settings" element={adminWrap(<Settings />)} />
              <Route path="/admin/insights" element={<Navigate to="/admin/dashboard" replace />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
