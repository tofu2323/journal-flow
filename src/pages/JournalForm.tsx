import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { JournalType } from '../types'

const JournalForm = () => {
  const { type } = useParams<{ type: JournalType }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save to IndexedDB
    console.log('Saving:', { type, ...formData })
    navigate('/')
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
                onChange={(e) => handleChange('practiceType', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">実践時間（分）</label>
              <input
                type="number"
                className="form-input"
                placeholder="30"
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">主な気づき・感想</label>
              <textarea
                className="form-textarea"
                placeholder="呼吸、体の感覚、感情、思い、その他..."
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
                onChange={(e) => handleChange('event', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">そのとき、快の感情に気づいていましたか？</label>
              <select
                className="form-input"
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
                onChange={(e) => handleChange('bodyFeelings', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">そのとき、どんなムードだったか、感情や思考はどうでしたか？</label>
              <textarea
                className="form-textarea"
                placeholder="感情や思考の状態を..."
                onChange={(e) => handleChange('moodAndThoughts', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">これを書いている今は、心の中にどんな思いがありますか？</label>
              <textarea
                className="form-textarea"
                placeholder="今の気持ちを..."
                onChange={(e) => handleChange('currentThoughts', e.target.value)}
              />
            </div>
          </>
        )

      default:
        return <p>このジャーナルタイプはまだ実装されていません。</p>
    }
  }

  return (
    <div className="container">
      <div className="card">
        <form onSubmit={handleSubmit}>
          {renderForm()}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">
              保存する
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
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