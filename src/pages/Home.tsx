import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { JournalEntry } from '../types'
import { getJournals } from '../utils/db'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

const journalTypes = [
  {
    type: 'formal-practice',
    title: 'フォーマル実践',
    emoji: '🧘‍♂️',
    description: 'ボディスキャン・静坐瞑想・ヨガでの気づき'
  },
  {
    type: 'informal-practice', 
    title: 'インフォーマル実践',
    emoji: '🚶',
    description: '歩く・食べる・日常での気づき'
  },
  {
    type: 'pleasant-event',
    title: '快な出来事',
    emoji: '☀️',
    description: '心地よいと感じた出来事の記録'
  },
  {
    type: 'unpleasant-event',
    title: '不快な出来事', 
    emoji: '☁️',
    description: '不快と感じた出来事の記録'
  },
  {
    type: 'difficult-communication',
    title: '困難なコミュニケーション',
    emoji: '🗣️',
    description: '対人コミュニケーションの振り返り'
  }
]

const journalTypeLabels = {
  'formal-practice': '🧘‍♂️ フォーマル実践',
  'informal-practice': '🚶 インフォーマル実践',
  'pleasant-event': '☀️ 快な出来事',
  'unpleasant-event': '☁️ 不快な出来事',
  'difficult-communication': '🗣️ 困難なコミュニケーション'
}

const Home = () => {
  const [recentJournals, setRecentJournals] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecentJournals()
  }, [])

  const loadRecentJournals = async () => {
    try {
      const journals = await getJournals()
      // 最新の3件を取得
      const recent = journals
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
      setRecentJournals(recent)
    } catch (error) {
      console.error('Failed to load recent journals:', error)
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="container">
      {/* ヘッダー */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: '700' }}>
          Journal Flow
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          マインドフルネスの気づきを記録しよう
        </p>
      </div>

      {/* 最近のエントリー */}
      {!loading && recentJournals.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600' }}>最近の記録</h2>
            <Link to="/list" style={{ color: '#4f46e5', textDecoration: 'none', fontSize: '0.9rem' }}>
              すべて見る →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentJournals.map((journal) => (
              <Link 
                key={journal.id} 
                to={`/journal/detail/${journal.id}`}
                className="card" 
                style={{ 
                  margin: 0,
                  padding: '1rem',
                  textDecoration: 'none', 
                  color: 'inherit',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                    {journalTypeLabels[journal.type]}
                  </h3>
                  <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                    {format(new Date(journal.createdAt), 'M/d HH:mm', { locale: ja })}
                  </span>
                </div>
                <p style={{ 
                  color: '#6b7280', 
                  margin: 0,
                  fontSize: '0.9rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {getPreview(journal).substring(0, 80)}
                  {getPreview(journal).length > 80 && '...'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 新しいエントリーを作成 */}
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>
          新しい記録を作成
        </h2>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {journalTypes.map((journal) => (
          <Link
            key={journal.type}
            to={`/journal/${journal.type}`}
            className="card"
            style={{ 
              textDecoration: 'none', 
              color: 'inherit',
              padding: '1rem',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{journal.emoji}</span>
              <div>
                <h3 style={{ marginBottom: '0.25rem', fontSize: '1rem', fontWeight: '600' }}>{journal.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                  {journal.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home