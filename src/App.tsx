import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/LandingPage/Home";
import BrowseBooks from "./pages/LandingPage/BrowseBooks";
import BookDetail from "./pages/LandingPage/BookDetail";
import Contact from "./pages/LandingPage/Contact";
import FAQ from "./pages/LandingPage/FAQ";
import HowItWorks from "./pages/LandingPage/HowItWorks";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Cart from "./pages/LandingPage/Cart";
import ShippingDetails from "./pages/LandingPage/Checkout/ShippingDetails";
import CheckoutSummary from "./pages/LandingPage/Checkout/CheckoutSummary";
import PaymentProcessing from "./pages/LandingPage/Checkout/PaymentProcessing";
import { CheckoutProvider } from "./context/CheckoutContext";
import PaymentSuccess from "./pages/LandingPage/PaymentSuccess";
import PaymentFailed from "./pages/LandingPage/PaymentFailed";
import OrderStatus from "./pages/LandingPage/OrderStatus";
import Dispute from "./pages/LandingPage/Dispute";
import DisputeTracking from "./pages/LandingPage/DisputeTracking";
import Profile from "./pages/LandingPage/Profile";
import ShippingAddresses from "./pages/LandingPage/ShippingAddresses";

import Sell from "./pages/LandingPage/Sell";
import ListBook from "./pages/LandingPage/ListBook";
import ListingSubmitted from "./pages/LandingPage/ListingSubmitted";
import MyListings from "./pages/LandingPage/MyListings";
import MyListingDetail from "./pages/LandingPage/MyListingDetail";
import EditListing from "./pages/LandingPage/EditListing";
import SellerOrders from "./pages/LandingPage/SellerOrders";
import SellerDropoff from "./pages/LandingPage/SellerDropoff";
import MyPurchases from "./pages/LandingPage/MyPurchases";
import SellerEarnings from "./pages/LandingPage/SellerEarnings";
import SellerStorefront from "./pages/LandingPage/SellerStorefront";
import CustomerService from "./pages/LandingPage/CustomerService";
import ShippingReturns from "./pages/LandingPage/ShippingReturns";
import PrivacyPolicy from "./pages/LandingPage/PrivacyPolicy";
import TermsConditions from "./pages/LandingPage/TermsConditions";
import RequestBook from "./pages/LandingPage/RequestBook";
import MyRequests from "./pages/LandingPage/MyRequests";
import AllRequests from "./pages/LandingPage/AllRequests";
import SampleStorefront from "./pages/LandingPage/SampleStorefront";
import NotFound from "./pages/NotFound";
import DropOffLocations from "./pages/LandingPage/DropOffLocations";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
      <style>{`
        :root {
          --toastify-color-light: #6B6FFF;
          --toastify-text-color-light: #ffffff;
          --toastify-color-progress-light: rgba(255,255,255,0.4);
          --toastify-icon-color-success: #ffffff;
          --toastify-icon-color-error: #ffffff;
          --toastify-icon-color-info: #ffffff;
          --toastify-icon-color-warning: #ffffff;
        }
        .Toastify__toast {
          background: #6B6FFF !important;
          color: #ffffff !important;
          border-radius: 12px !important;
          font-family: inherit !important;
          box-shadow: 0 8px 24px rgba(107,111,255,0.35) !important;
        }
        .Toastify__toast-body {
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          color: #ffffff !important;
        }
        .Toastify__close-button {
          color: rgba(255,255,255,0.8) !important;
        }
        .Toastify__progress-bar {
          background: rgba(255,255,255,0.4) !important;
        }
        .Toastify__toast-icon svg {
          fill: #ffffff !important;
        }
      `}</style>
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path="browse" element={<BrowseBooks />} />
                <Route path="books/:id" element={<BookDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<ProtectedRoute><CheckoutProvider><ShippingDetails /></CheckoutProvider></ProtectedRoute>} />
                <Route path="checkout/summary" element={<ProtectedRoute><CheckoutProvider><CheckoutSummary /></CheckoutProvider></ProtectedRoute>} />
                <Route path="checkout/processing" element={<ProtectedRoute><CheckoutProvider><PaymentProcessing /></CheckoutProvider></ProtectedRoute>} />
                <Route path="payment/success" element={<PaymentSuccess />} />
                <Route path="payment/failed" element={<PaymentFailed />} />
                <Route path="order/:orderId" element={<OrderStatus />} />
                <Route path="order/:orderId/dispute" element={<Dispute />} />
                <Route path="order/:orderId/dispute/track" element={<DisputeTracking />} />
                <Route path="account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="account/shipping-addresses" element={<ProtectedRoute><ShippingAddresses /></ProtectedRoute>} />

                <Route path="sell" element={<Sell />} />
                <Route path="list" element={<ProtectedRoute><ListBook /></ProtectedRoute>} />
                <Route path="request-book" element={<ProtectedRoute><RequestBook /></ProtectedRoute>} />
                <Route path="request" element={<ProtectedRoute><RequestBook /></ProtectedRoute>} />
                <Route path="my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
                <Route path="listing-submitted" element={<ListingSubmitted />} />
                <Route path="my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
                <Route path="my-listings/:id" element={<ProtectedRoute><MyListingDetail /></ProtectedRoute>} />
                <Route path="my-listings/:id/edit" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
                <Route path="my-sales" element={<ProtectedRoute><SellerOrders /></ProtectedRoute>} />
                <Route path="my-sales/:id/dropoff" element={<ProtectedRoute><SellerDropoff /></ProtectedRoute>} />
                <Route path="my-earnings" element={<ProtectedRoute><SellerEarnings /></ProtectedRoute>} />
                <Route path="my-purchases" element={<ProtectedRoute><MyPurchases /></ProtectedRoute>} />
                <Route path="store/sample" element={<SampleStorefront />} />
                <Route path="store/:slug" element={<SellerStorefront />} />
                <Route path="sample-store" element={<SampleStorefront />} />
                <Route path="customer-service" element={<CustomerService />} />
                <Route path="shipping" element={<ShippingReturns />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<TermsConditions />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="how-it-works" element={<HowItWorks />} />
                <Route path="dropoff-locations" element={<DropOffLocations />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
  </QueryClientProvider>
);

export default App;
