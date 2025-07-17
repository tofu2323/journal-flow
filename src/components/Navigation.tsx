import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // ホーム画面では非表示
  if (location.pathname === '/') {
    return null
  }

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: 'var(--space-4) 0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '768px',
        margin: '0 auto',
        padding: '0 var(--space-4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--gray-600)',
            padding: 'var(--space-2)',
            borderRadius: 'var(--radius-lg)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--gray-100)'
            e.currentTarget.style.color = 'var(--gray-800)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.color = 'var(--gray-600)'
          }}
        >
          ← 戻る
        </button>
        
        {/* Home Link */}
        <Link 
          to="/" 
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--primary-600)',
            textDecoration: 'none',
            letterSpacing: '-0.025em',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--primary-700)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--primary-600)'
          }}
        >
          Journal Flow 🌊
        </Link>
        
        {/* Spacer for centering */}
        <div style={{ width: '80px' }}></div>
      </div>
    </nav>
  )
}

export default Navigation