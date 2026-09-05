import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ContinueListingBanner } from '../components/ContinueListingBanner'
import { FloatingActions } from '../components/FloatingActions'

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ContinueListingBanner />
      <FloatingActions />
    </div>
  )
}

export default RootLayout
