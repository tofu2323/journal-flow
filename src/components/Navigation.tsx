import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-title">
          Journal Flow 🌊
        </Link>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            ホーム
          </Link>
          <Link 
            to="/list" 
            className={`nav-link ${location.pathname === '/list' ? 'active' : ''}`}
          >
            振り返り
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation