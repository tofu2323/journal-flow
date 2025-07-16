import { Link } from 'react-router-dom'

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

const Home = () => {
  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>
          今日はどんなジャーナルを書きますか？
        </h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
          思いついた時にサクッと記録して、フロー状態でジャーナリングしましょう
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {journalTypes.map((journal) => (
          <Link
            key={journal.type}
            to={`/journal/${journal.type}`}
            className="card"
            style={{ 
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>{journal.emoji}</span>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>{journal.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
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