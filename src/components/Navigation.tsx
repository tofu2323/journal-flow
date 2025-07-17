import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()

  // ホーム画面では非表示
  if (location.pathname === '/') {
    return null
  }

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '768px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link 
          to="/" 
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#4f46e5',
            textDecoration: 'none'
          }}
        >
          Journal Flow 🌊
        </Link>
        
        {location.pathname === '/list' && (
          <button style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6b7280'
          }}>
            •••
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navigation