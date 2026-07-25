import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
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
                <Route path="account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="account/shipping-addresses" element={<ProtectedRoute><ShippingAddresses /></ProtectedRoute>} />

                <Route path="sell" element={<Sell />} />
                <Route path="list" element={<ProtectedRoute><ListBook /></ProtectedRoute>} />
                <Route path="request-book" element={<ProtectedRoute><RequestBook /></ProtectedRoute>} />
                <Route path="listing-submitted" element={<ListingSubmitted />} />
                <Route path="my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
                <Route path="my-listings/:id" element={<ProtectedRoute><MyListingDetail /></ProtectedRoute>} />
                <Route path="my-listings/:id/edit" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
                <Route path="my-sales" element={<ProtectedRoute><SellerOrders /></ProtectedRoute>} />
                <Route path="my-sales/:id/dropoff" element={<ProtectedRoute><SellerDropoff /></ProtectedRoute>} />
                <Route path="my-earnings" element={<ProtectedRoute><SellerEarnings /></ProtectedRoute>} />
                <Route path="my-purchases" element={<ProtectedRoute><MyPurchases /></ProtectedRoute>} />
                <Route path="store/:slug" element={<SellerStorefront />} />
                <Route path="customer-service" element={<CustomerService />} />
                <Route path="shipping" element={<ShippingReturns />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<TermsConditions />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="how-it-works" element={<HowItWorks />} />
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
