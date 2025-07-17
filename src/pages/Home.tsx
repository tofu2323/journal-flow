import { Link } from 'react-router-dom'
import { useState } from 'react'

// Mock data - 後でIndexedDBから取得
const mockEntries = [
  {
    id: '1',
    type: 'pleasant-event',
    date: '2025-01-17',
    preview: '今日は久しぶりに友人と会って、とても楽しい時間を過ごしました。カフェで話していると、時間があっという間に...',
    emoji: '☀️'
  },
  {
    id: '2', 
    type: 'formal-practice',
    date: '2025-01-16',
    preview: '20分間のボディスキャン瞑想を行いました。最初は雑念が多かったのですが、徐々に体の感覚に集中できるように...',
    emoji: '🧘‍♂️'
  }
]

const Home = () => {
  const [showNewEntryMenu, setShowNewEntryMenu] = useState(false)
  
  const journalTypes = [
    { type: 'formal-practice', title: 'フォーマル実践', emoji: '🧘‍♂️' },
    { type: 'informal-practice', title: 'インフォーマル実践', emoji: '🚶' },
    { type: 'pleasant-event', title: '快な出来事', emoji: '☀️' },
    { type: 'unpleasant-event', title: '不快な出来事', emoji: '☁️' },
    { type: 'difficult-communication', title: '困難なコミュニケーション', emoji: '🗣️' }
  ]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return '今日'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨日'
    } else {
      return date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      paddingBottom: '100px' // FABのスペース確保
    }}>
      {/* Header Stats */}
      <div style={{ 
        padding: '1rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          maxWidth: '768px',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              backgroundColor: '#e0e7ff', 
              borderRadius: '12px', 
              padding: '0.5rem',
              marginBottom: '0.25rem',
              display: 'inline-block'
            }}>
              📝
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>今年のエントリー</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              backgroundColor: '#fce7f3', 
              borderRadius: '12px', 
              padding: '0.5rem',
              marginBottom: '0.25rem',
              display: 'inline-block'
            }}>
              ✍️
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>156</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>書いた文字数</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              backgroundColor: '#ddd6fe', 
              borderRadius: '12px', 
              padding: '0.5rem',
              marginBottom: '0.25rem',
              display: 'inline-block'
            }}>
              📅
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>ジャーナル日数</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ maxWidth: '768px', margin: '0 auto', padding: '1rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          color: '#1f2937'
        }}>
          January 2025
        </h2>

        {mockEntries.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌊</div>
            <h3 style={{ marginBottom: '0.5rem' }}>最初のジャーナルを書いてみましょう</h3>
            <p>思いついた時にサクッと記録して、フロー状態でジャーナリングしましょう</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockEntries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '1rem' 
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{entry.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      lineHeight: '1.6',
                      color: '#374151',
                      marginBottom: '0.75rem'
                    }}>
                      {entry.preview}
                    </p>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{formatDate(entry.date)}</span>
                      <span>•••</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000
      }}>
        <button
          onClick={() => setShowNewEntryMenu(!showNewEntryMenu)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)'
          }}
        >
          {showNewEntryMenu ? '×' : '+'}
        </button>

        {/* New Entry Menu */}
        {showNewEntryMenu && (
          <div style={{
            position: 'absolute',
            bottom: '70px',
            right: '0',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '1rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            minWidth: '200px',
            animation: 'fadeInUp 0.2s ease-out'
          }}>
            <div style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              新しいジャーナル
            </div>
            {journalTypes.map((type) => (
              <Link
                key={type.type}
                to={`/journal/${type.type}`}
                onClick={() => setShowNewEntryMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{type.emoji}</span>
                <span style={{ fontSize: '0.9rem' }}>{type.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Home