import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import BrowseBooks from './pages/BrowseBooks'
import BookDetail from './pages/BookDetail'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'browse', element: <BrowseBooks /> },
      { path: 'books/:id', element: <BookDetail /> },
      { path: 'blog', element: <Blog /> },
      { path: 'contact', element: <Contact /> },
      { path: 'faq', element: <FAQ /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
