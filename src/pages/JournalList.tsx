import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { JournalEntry, JournalType } from '../types'
import { getJournals } from '../utils/db'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

const journalTypeLabels = {
  'formal-practice': '🧘‍♂️ フォーマル実践',
  'informal-practice': '🚶 インフォーマル実践',
  'pleasant-event': '☀️ 快な出来事',
  'unpleasant-event': '☁️ 不快な出来事',
  'difficult-communication': '🗣️ 困難なコミュニケーション'
}

const JournalList = () => {
  const [journals, setJournals] = useState<JournalEntry[]>([])
  const [filteredJournals, setFilteredJournals] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<JournalType | 'all'>('all')

  useEffect(() => {
    loadJournals()
  }, [])

  useEffect(() => {
    filterJournals()
  }, [journals, searchQuery, selectedType])

  const loadJournals = async () => {
    try {
      const data = await getJournals()
      // 日付順でソート（新しい順）
      const sortedData = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setJournals(sortedData)
    } catch (error) {
      console.error('Failed to load journals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterJournals = () => {
    let filtered = journals

    // タイプフィルター
    if (selectedType !== 'all') {
      filtered = filtered.filter(journal => journal.type === selectedType)
    }

    // 検索フィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(journal => {
        const preview = getPreview(journal).toLowerCase()
        const typeLabel = journalTypeLabels[journal.type].toLowerCase()
        return preview.includes(query) || typeLabel.includes(query)
      })
    }

    setFilteredJournals(filtered)
  }

  const getPreview = (journal: JournalEntry) => {
    switch (journal.type) {
      case 'formal-practice':
      case 'informal-practice':
        return (journal as any).insights || ''
      case 'pleasant-event':
      case 'unpleasant-event':
        return (journal as any).event || ''
      case 'difficult-communication':
        return (journal as any).content || ''
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <h2>📖 すべてのジャーナル</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          過去のエントリーを振り返って、気づきを深めましょう
        </p>

        {/* 検索・フィルター */}
        {journals.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            {/* 検索バー */}
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="🔍 ジャーナルを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '1rem' }}
              />
            </div>

            {/* タイプフィルター */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedType('all')}
                className={`filter-btn ${selectedType === 'all' ? 'active' : ''}`}
              >
                すべて ({journals.length})
              </button>
              {Object.entries(journalTypeLabels).map(([type, label]) => {
                const count = journals.filter(j => j.type === type).length
                if (count === 0) return null
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type as JournalType)}
                    className={`filter-btn ${selectedType === type ? 'active' : ''}`}
                  >
                    {label} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        )}
        
        {journals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
              まだエントリーがありません。<br />
              最初のジャーナルを書いてみましょう！
            </p>
            <Link to="/" className="btn btn-primary">
              ジャーナルを書く
            </Link>
          </div>
        ) : filteredJournals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
              検索条件に一致するジャーナルが見つかりません。
            </p>
            <button 
              onClick={() => {
                setSearchQuery('')
                setSelectedType('all')
              }}
              className="btn btn-secondary"
            >
              フィルターをリセット
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredJournals.map((journal) => (
              <Link 
                key={journal.id} 
                to={`/journal/detail/${journal.id}`}
                className="card" 
                style={{ 
                  margin: 0, 
                  textDecoration: 'none', 
                  color: 'inherit',
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                    {journalTypeLabels[journal.type]}
                  </h3>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    {format(new Date(journal.createdAt), 'M月d日 HH:mm', { locale: ja })}
                  </span>
                </div>
                <p style={{ 
                  color: '#374151', 
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {getPreview(journal).substring(0, 100)}
                  {getPreview(journal).length > 100 && '...'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JournalList