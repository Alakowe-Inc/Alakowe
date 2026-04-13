import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import RootLayout from './layouts/RootLayout'
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
