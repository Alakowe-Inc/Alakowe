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
import Blog from "./pages/LandingPage/Blog";
import BlogPost from "./pages/LandingPage/BlogPost";
import Contact from "./pages/LandingPage/Contact";
import FAQ from "./pages/LandingPage/FAQ";
import HowItWorks from "./pages/LandingPage/HowItWorks";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
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
import MyListingDetail from "./pages/LandingPage/MyListingDetail";
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
                <Route path="my-listings/:id" element={<ProtectedRoute><MyListingDetail /></ProtectedRoute>} />
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
                <Route path="blog/:slug" element={<BlogPost />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="how-it-works" element={<HowItWorks />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
  </QueryClientProvider>
);

export default App;
