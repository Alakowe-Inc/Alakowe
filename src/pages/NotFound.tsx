import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-4xl text-main">404</h1>
      <p className="text-main/60">Page not found.</p>
      <Link to="/" className="text-secondary underline">Go home</Link>
    </div>
  )
}

export default NotFound
