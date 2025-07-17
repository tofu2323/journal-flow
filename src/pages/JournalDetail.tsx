import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { JournalEntry } from '../types'
import { getJournals, deleteJournal } from '../utils/db'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

const journalTypeLabels = {
  'formal-practice': '🧘‍♂️ フォーマル実践',
  'informal-practice': '🚶 インフォーマル実践',
  'pleasant-event': '☀️ 快な出来事',
  'unpleasant-event': '☁️ 不快な出来事',
  'difficult-communication': '🗣️ 困難なコミュニケーション'
}

const JournalDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [journal, setJournal] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadJournal()
  }, [id])

  const loadJournal = async () => {
    if (!id) return
    
    try {
      const journals = await getJournals()
      const found = journals.find(j => j.id === id)
      setJournal(found || null)
    } catch (error) {
      console.error('Failed to load journal:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!journal || !confirm('このエントリーを削除しますか？')) return
    
    try {
      await deleteJournal(journal.id)
      navigate('/list')
    } catch (error) {
      console.error('Failed to delete journal:', error)
      alert('削除に失敗しました。')
    }
  }

  const renderContent = () => {
    if (!journal) return null

    switch (journal.type) {
      case 'formal-practice':
      case 'informal-practice':
        const practiceJournal = journal as any
        return (
          <>
            <div className="form-group">
              <label className="form-label">実践内容</label>
              <p>{practiceJournal.practiceType}</p>
            </div>
            <div className="form-group">
              <label className="form-label">実践時間</label>
              <p>{practiceJournal.duration}分</p>
            </div>
            <div className="form-group">
              <label className="form-label">主な気づき・感想</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{practiceJournal.insights}</p>
            </div>
          </>
        )

      case 'pleasant-event':
      case 'unpleasant-event':
        const eventJournal = journal as any
        return (
          <>
            <div className="form-group">
              <label className="form-label">出来事</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{eventJournal.event}</p>
            </div>
            <div className="form-group">
              <label className="form-label">その時の気づき</label>
              <p>{eventJournal.awarenessAtTime ? 'はい、気づいていました' : 'いいえ、後で気づきました'}</p>
            </div>
            <div className="form-group">
              <label className="form-label">体の感覚</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{eventJournal.bodyFeelings}</p>
            </div>
            <div className="form-group">
              <label className="form-label">感情・思考</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{eventJournal.moodAndThoughts}</p>
            </div>
            <div className="form-group">
              <label className="form-label">今の思い</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{eventJournal.currentThoughts}</p>
            </div>
          </>
        )

      case 'difficult-communication':
        const commJournal = journal as any
        return (
          <>
            <div className="form-group">
              <label className="form-label">コミュニケーションの内容</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{commJournal.content}</p>
            </div>
            <div className="form-group">
              <label className="form-label">相手</label>
              <p>{commJournal.person}</p>
            </div>
            <div className="form-group">
              <label className="form-label">問題の発生</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{commJournal.problemOrigin}</p>
            </div>
            <div className="form-group">
              <label className="form-label">あなたの望み</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{commJournal.myDesire}</p>
            </div>
            <div className="form-group">
              <label className="form-label">実際に得られたもの</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{commJournal.whatIGot}</p>
            </div>
            <div className="form-group">
              <label className="form-label">相手の望み</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{commJournal.theirDesire}</p>
            </div>
            <div className="form-group">
              <label className="form-label">相手が得たもの</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{commJournal.whatTheyGot}</p>
            </div>
            <div className="form-group">
              <label className="form-label">その時の感情</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{commJournal.feelings}</p>
            </div>
            <div className="form-group">
              <label className="form-label">解決状況</label>
              <p>{commJournal.resolved ? '解決済み' : '未解決'}</p>
            </div>
            <div className="form-group">
              <label className="form-label">解決方法</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{commJournal.resolution}</p>
            </div>
          </>
        )

      default:
        return <p>不明なジャーナルタイプです。</p>
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

  if (!journal) {
    return (
      <div className="container">
        <div className="card">
          <h2>エントリーが見つかりません</h2>
          <Link to="/list" className="btn btn-primary">
            一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>{journalTypeLabels[journal.type]}</h2>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {format(new Date(journal.createdAt), 'yyyy年M月d日 HH:mm', { locale: ja })}
          </span>
        </div>
        
        {renderContent()}
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Link to={`/journal/${journal.type}/edit/${journal.id}`} className="btn btn-primary">
            編集
          </Link>
          <button onClick={handleDelete} className="btn btn-secondary" style={{ background: '#ef4444', color: 'white' }}>
            削除
          </button>
          <Link to="/list" className="btn btn-secondary">
            一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JournalDetail