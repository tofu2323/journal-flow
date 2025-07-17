import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { JournalType, JournalEntry } from '../types'
import { saveJournal, getJournals, updateJournal } from '../utils/db'
import { format } from 'date-fns'

const JournalForm = () => {
  const { type, id } = useParams<{ type: JournalType; id?: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<any>({})
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      setIsEditing(true)
      loadExistingJournal()
    }
  }, [id])

  const loadExistingJournal = async () => {
    if (!id) return
    
    setLoading(true)
    try {
      const journals = await getJournals()
      const existing = journals.find(j => j.id === id)
      if (existing) {
        setFormData(existing)
      }
    } catch (error) {
      console.error('Failed to load journal:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!type) return
    
    const now = new Date()
    
    try {
      if (isEditing && id) {
        // 編集モード
        const updatedJournal: JournalEntry = {
          ...formData,
          updatedAt: now
        }
        await updateJournal(updatedJournal)
        console.log('Journal updated successfully:', updatedJournal)
        navigate(`/journal/detail/${id}`)
      } else {
        // 新規作成モード
        const journal: JournalEntry = {
          id: `${type}-${now.getTime()}`,
          type,
          date: format(now, 'yyyy-MM-dd'),
          createdAt: now,
          updatedAt: now,
          ...formData
        }
        await saveJournal(journal)
        console.log('Journal saved successfully:', journal)
        navigate('/')
      }
    } catch (error) {
      console.error('Failed to save journal:', error)
      alert('保存に失敗しました。もう一度お試しください。')
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const renderForm = () => {
    switch (type) {
      case 'formal-practice':
        return (
          <>
            <h2>🧘‍♂️ フォーマル実践の記録</h2>
            <div className="form-group">
              <label className="form-label">実践内容</label>
              <input
                type="text"
                className="form-input"
                placeholder="ボディスキャン、静坐瞑想、ヨガなど"
                value={formData.practiceType || ''}
                onChange={(e) => handleChange('practiceType', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">実践時間（分）</label>
              <input
                type="number"
                className="form-input"
                placeholder="30"
                value={formData.duration || ''}
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">主な気づき・感想</label>
              <textarea
                className="form-textarea"
                placeholder="呼吸、体の感覚、感情、思い、その他..."
                value={formData.insights || ''}
                onChange={(e) => handleChange('insights', e.target.value)}
              />
            </div>
          </>
        )

      case 'pleasant-event':
        return (
          <>
            <h2>☀️ 快な出来事の記録</h2>
            <div className="form-group">
              <label className="form-label">どんな出来事でしたか？</label>
              <textarea
                className="form-textarea"
                placeholder="心地よいと感じた出来事を詳しく..."
                value={formData.event || ''}
                onChange={(e) => handleChange('event', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">そのとき、快の感情に気づいていましたか？</label>
              <select
                className="form-input"
                value={formData.awarenessAtTime === true ? 'true' : formData.awarenessAtTime === false ? 'false' : ''}
                onChange={(e) => handleChange('awarenessAtTime', e.target.value === 'true')}
              >
                <option value="">選択してください</option>
                <option value="true">はい、気づいていました</option>
                <option value="false">いいえ、後で気づきました</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">そのとき、体はどのように感じましたか？</label>
              <textarea
                className="form-textarea"
                placeholder="体の感覚を詳しく..."
                value={formData.bodyFeelings || ''}
                onChange={(e) => handleChange('bodyFeelings', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">そのとき、どんなムードだったか、感情や思考はどうでしたか？</label>
              <textarea
                className="form-textarea"
                placeholder="感情や思考の状態を..."
                value={formData.moodAndThoughts || ''}
                onChange={(e) => handleChange('moodAndThoughts', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">これを書いている今は、心の中にどんな思いがありますか？</label>
              <textarea
                className="form-textarea"
                placeholder="今の気持ちを..."
                value={formData.currentThoughts || ''}
                onChange={(e) => handleChange('currentThoughts', e.target.value)}
              />
            </div>
          </>
        )

      case 'informal-practice':
        return (
          <>
            <h2>🚶 インフォーマル実践の記録</h2>
            <div className="form-group">
              <label className="form-label">実践内容</label>
              <input
                type="text"
                className="form-input"
                placeholder="歩く瞑想、食べる瞑想、日常の気づきなど"
                value={formData.practiceType || ''}
                onChange={(e) => handleChange('practiceType', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">実践時間（分）</label>
              <input
                type="number"
                className="form-input"
                placeholder="15"
                value={formData.duration || ''}
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">主な気づき・感想</label>
              <textarea
                className="form-textarea"
                placeholder="日常の中での気づき、体の感覚、感情、思い..."
                value={formData.insights || ''}
                onChange={(e) => handleChange('insights', e.target.value)}
              />
            </div>
          </>
        )

      case 'unpleasant-event':
        return (
          <>
            <h2>☁️ 不快な出来事の記録</h2>
            <div className="form-group">
              <label className="form-label">どんな出来事でしたか？</label>
              <textarea
                className="form-textarea"
                placeholder="不快と感じた出来事を詳しく..."
                value={formData.event || ''}
                onChange={(e) => handleChange('event', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">そのとき、不快の感情に気づいていましたか？</label>
              <select
                className="form-input"
                value={formData.awarenessAtTime === true ? 'true' : formData.awarenessAtTime === false ? 'false' : ''}
                onChange={(e) => handleChange('awarenessAtTime', e.target.value === 'true')}
              >
                <option value="">選択してください</option>
                <option value="true">はい、気づいていました</option>
                <option value="false">いいえ、後で気づきました</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">そのとき、体はどのように感じましたか？</label>
              <textarea
                className="form-textarea"
                placeholder="体の感覚、緊張、痛み、不快感など..."
                value={formData.bodyFeelings || ''}
                onChange={(e) => handleChange('bodyFeelings', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">そのとき、どんなムードだったか、感情や思考はどうでしたか？</label>
              <textarea
                className="form-textarea"
                placeholder="怒り、悲しみ、不安、思考のパターンなど..."
                value={formData.moodAndThoughts || ''}
                onChange={(e) => handleChange('moodAndThoughts', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">これを書いている今は、心の中にどんな思いがありますか？</label>
              <textarea
                className="form-textarea"
                placeholder="今の気持ち、学び、気づきなど..."
                value={formData.currentThoughts || ''}
                onChange={(e) => handleChange('currentThoughts', e.target.value)}
              />
            </div>
          </>
        )

      case 'difficult-communication':
        return (
          <>
            <h2>🗣️ 困難なコミュニケーションの記録</h2>
            <div className="form-group">
              <label className="form-label">コミュニケーションの内容</label>
              <textarea
                className="form-textarea"
                placeholder="どのような会話や状況でしたか？"
                value={formData.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">相手は誰でしたか？</label>
              <input
                type="text"
                className="form-input"
                placeholder="家族、友人、同僚など（具体名は避けて）"
                value={formData.person || ''}
                onChange={(e) => handleChange('person', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">問題はどのように発生しましたか？</label>
              <textarea
                className="form-textarea"
                placeholder="きっかけや経緯を..."
                value={formData.problemOrigin || ''}
                onChange={(e) => handleChange('problemOrigin', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">相手や状況に対して本当に望んでいたことは何でしたか？</label>
              <textarea
                className="form-textarea"
                placeholder="あなたの本当の願いや期待..."
                value={formData.myDesire || ''}
                onChange={(e) => handleChange('myDesire', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">実際に得られたものは何でしたか？</label>
              <textarea
                className="form-textarea"
                placeholder="結果として何が起こったか..."
                value={formData.whatIGot || ''}
                onChange={(e) => handleChange('whatIGot', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">相手が望んでいたことは何だと思いますか？</label>
              <textarea
                className="form-textarea"
                placeholder="相手の立場から考えて..."
                value={formData.theirDesire || ''}
                onChange={(e) => handleChange('theirDesire', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">相手は実際に何を得たと思いますか？</label>
              <textarea
                className="form-textarea"
                placeholder="相手にとっての結果..."
                value={formData.whatTheyGot || ''}
                onChange={(e) => handleChange('whatTheyGot', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">その時、どのように感じましたか？</label>
              <textarea
                className="form-textarea"
                placeholder="感情、体の感覚、思考など..."
                value={formData.feelings || ''}
                onChange={(e) => handleChange('feelings', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">この問題は解決しましたか？</label>
              <select
                className="form-input"
                value={formData.resolved === true ? 'true' : formData.resolved === false ? 'false' : ''}
                onChange={(e) => handleChange('resolved', e.target.value === 'true')}
              >
                <option value="">選択してください</option>
                <option value="true">はい、解決しました</option>
                <option value="false">いいえ、まだ解決していません</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">どのように解決したか、または解決したいですか？</label>
              <textarea
                className="form-textarea"
                placeholder="解決方法や今後の対応について..."
                value={formData.resolution || ''}
                onChange={(e) => handleChange('resolution', e.target.value)}
              />
            </div>
          </>
        )

      default:
        return <p>このジャーナルタイプはまだ実装されていません。</p>
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
        <form onSubmit={handleSubmit}>
          {renderForm()}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">
              {isEditing ? '更新する' : '保存する'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate(isEditing ? `/journal/detail/${id}` : '/')}
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JournalForm