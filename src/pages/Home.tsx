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
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{entries.length}</div>
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
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{getTotalWords()}</div>
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
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{getUniqueDays()}</div>
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

        {/* Search and Filter */}
        {entries.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            {/* Search Bar */}
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="🔍 ジャーナルを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#007AFF'
                  e.target.style.boxShadow = '0 0 0 4px rgba(0, 122, 255, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Type Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedType('all')}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid transparent',
                  borderColor: selectedType === 'all' ? '#007AFF' : '#e5e7eb',
                  borderRadius: '20px',
                  background: selectedType === 'all' ? '#007AFF' : 'white',
                  color: selectedType === 'all' ? 'white' : '#6b7280',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
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
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid transparent',
                      borderColor: selectedType === type.type ? '#007AFF' : '#e5e7eb',
                      borderRadius: '20px',
                      background: selectedType === type.type ? '#007AFF' : 'white',
                      color: selectedType === type.type ? 'white' : '#6b7280',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredEntries.map((entry) => (
              <Link
                key={entry.id}
                to={`/journal/detail/${entry.id}`}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block'
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
                  <span style={{ fontSize: '1.5rem' }}>{getJournalEmoji(entry.type)}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      lineHeight: '1.6',
                      color: '#374151',
                      marginBottom: '0.75rem'
                    }}>
                      {getEntryPreview(entry).substring(0, 120)}
                      {getEntryPreview(entry).length > 120 && '...'}
                    </p>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280'
                    }}>
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