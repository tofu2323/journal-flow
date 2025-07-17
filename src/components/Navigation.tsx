import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-title">
          🌊
        </Link>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1.2rem' }}>🏠</span>
            <span>ホーム</span>
          </Link>
          <Link 
            to="/list" 
            className={`nav-link ${location.pathname === '/list' ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1.2rem' }}>📖</span>
            <span>すべて</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation