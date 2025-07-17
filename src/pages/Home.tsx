import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { JournalEntry } from '../types'
import { getJournals, initDB } from '../utils/db'

const Home = () => {
  const [showNewEntryMenu, setShowNewEntryMenu] = useState(false)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  
  const journalTypes = [
    { type: 'formal-practice', title: 'フォーマル実践', emoji: '🧘‍♂️' },
    { type: 'informal-practice', title: 'インフォーマル実践', emoji: '🚶' },
    { type: 'pleasant-event', title: '快な出来事', emoji: '☀️' },
    { type: 'unpleasant-event', title: '不快な出来事', emoji: '☁️' },
    { type: 'difficult-communication', title: '困難なコミュニケーション', emoji: '🗣️' }
  ]

  useEffect(() => {
    loadEntries()
  }, [])

  useEffect(() => {
    filterEntries()
  }, [entries, searchQuery, selectedType])

  const filterEntries = () => {
    let filtered = entries

    // タイプフィルター
    if (selectedType !== 'all') {
      filtered = filtered.filter(entry => entry.type === selectedType)
    }

    // 検索フィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(entry => {
        const preview = getEntryPreview(entry).toLowerCase()
        const journalType = journalTypes.find(j => j.type === entry.type)
        const typeTitle = journalType?.title.toLowerCase() || ''
        return preview.includes(query) || typeTitle.includes(query)
      })
    }

    setFilteredEntries(filtered)
  }

  const loadEntries = async () => {
    try {
      await initDB()
      const allEntries = await getJournals()
      // 最新順にソート
      const sortedEntries = allEntries.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setEntries(sortedEntries)
    } catch (error) {
      console.error('Failed to load entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const getJournalEmoji = (type: string) => {
    const journalType = journalTypes.find(j => j.type === type)
    return journalType?.emoji || '📝'
  }

  const getEntryPreview = (entry: JournalEntry) => {
    switch (entry.type) {
      case 'formal-practice':
      case 'informal-practice':
        return (entry as any).insights || ''
      case 'pleasant-event':
      case 'unpleasant-event':
        return (entry as any).event || ''
      case 'difficult-communication':
        return (entry as any).content || ''
      default:
        return ''
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ja-JP', { 
      month: 'numeric', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTotalWords = () => {
    return entries.reduce((total, entry) => {
      const preview = getEntryPreview(entry)
      return total + (preview ? preview.length : 0)
    }, 0)
  }

  const getUniqueDays = () => {
    const dates = entries.map(entry => entry.date)
    return new Set(dates).size
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      paddingBottom: '100px' // FABのスペース確保
    }}>
      {/* Header Stats */}
      <div style={{ 
        padding: 'var(--space-4)',
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          maxWidth: '768px',
          margin: '0 auto',
          gap: 'var(--space-4)'
        }}>
          <div className="stats-card" style={{ flex: 1 }}>
            <div className="stats-icon" style={{ 
              background: 'linear-gradient(135deg, var(--primary-100) 0%, var(--primary-200) 100%)'
            }}>
              📝
            </div>
            <div className="stats-number">{entries.length}</div>
            <div className="stats-label">今年のエントリー</div>
          </div>
          <div className="stats-card" style={{ flex: 1 }}>
            <div className="stats-icon" style={{ 
              background: 'linear-gradient(135deg, var(--success-50) 0%, var(--success-100) 100%)'
            }}>
              ✍️
            </div>
            <div className="stats-number">{getTotalWords()}</div>
            <div className="stats-label">書いた文字数</div>
          </div>
          <div className="stats-card" style={{ flex: 1 }}>
            <div className="stats-icon" style={{ 
              background: 'linear-gradient(135deg, var(--warning-50) 0%, var(--warning-100) 100%)'
            }}>
              📅
            </div>
            <div className="stats-number">{getUniqueDays()}</div>
            <div className="stats-label">ジャーナル日数</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ maxWidth: '768px', margin: '0 auto', padding: '1rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: 'var(--space-4)',
          color: 'var(--gray-800)',
          letterSpacing: '-0.025em'
        }}>
          {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
        </h2>

        {/* Search and Filter */}
        {entries.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            {/* Search Bar */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <input
                type="text"
                placeholder="🔍 ジャーナルを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Type Filter Buttons */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedType('all')}
                className={`filter-btn ${selectedType === 'all' ? 'active' : ''}`}
              >
                すべて ({entries.length})
              </button>
              {journalTypes.map((type) => {
                const count = entries.filter(e => e.type === type.type).length
                if (count === 0) return null
                return (
                  <button
                    key={type.type}
                    onClick={() => setSelectedType(type.type)}
                    className={`filter-btn ${selectedType === type.type ? 'active' : ''}`}
                  >
                    {type.emoji} {type.title} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        )}

{loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p>読み込み中...</p>
          </div>
        ) : entries.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌊</div>
            <h3 style={{ marginBottom: '0.5rem' }}>最初のジャーナルを書いてみましょう</h3>
            <p>思いついた時にサクッと記録して、フロー状態でジャーナリングしましょう</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ marginBottom: '0.5rem' }}>該当するジャーナルが見つかりません</h3>
            <p>検索条件やフィルターを変更してみてください</p>
            <button 
              onClick={() => {
                setSearchQuery('')
                setSelectedType('all')
              }}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              フィルターをリセット
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {filteredEntries.map((entry) => (
              <Link
                key={entry.id}
                to={`/journal/detail/${entry.id}`}
                className="entry-card"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 'var(--space-4)' 
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{getJournalEmoji(entry.type)}</span>
                  <div style={{ flex: 1 }}>
                    <p className="entry-preview">
                      {getEntryPreview(entry).substring(0, 120)}
                      {getEntryPreview(entry).length > 120 && '...'}
                    </p>
                    <div className="entry-meta">
                      <span>{formatDate(entry.createdAt.toString())}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowNewEntryMenu(!showNewEntryMenu)}
        className="fab"
      >
        {showNewEntryMenu ? '×' : '+'}
      </button>

      {/* New Entry Menu */}
      {showNewEntryMenu && (
        <div style={{
          position: 'fixed',
          bottom: '5rem',
          right: 'var(--space-8)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-4)',
          boxShadow: 'var(--shadow-xl)',
          minWidth: '200px',
          animation: 'fadeInUp 0.2s ease-out',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: 1000
        }}>
          <div style={{ 
            marginBottom: 'var(--space-3)', 
            fontWeight: '600', 
            color: 'var(--gray-700)',
            fontSize: '0.875rem',
            letterSpacing: '0.025em'
          }}>
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
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                color: 'var(--gray-700)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(var(--primary-500), 0.1)'
                e.currentTarget.style.color = 'var(--primary-600)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--gray-700)'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{type.emoji}</span>
              <span>{type.title}</span>
            </Link>
          ))}
        </div>
      )}

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