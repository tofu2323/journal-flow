import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface WeeklyThemeData {
    id: string
    week: number
    theme: string
    description: string
    createdAt: Date
    updatedAt: Date
}

const WeeklyTheme = () => {
    const navigate = useNavigate()
    const [currentTheme, setCurrentTheme] = useState<WeeklyThemeData | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        week: 1,
        theme: '',
        description: ''
    })

    useEffect(() => {
        loadCurrentTheme()
    }, [])

    const loadCurrentTheme = () => {
        // LocalStorageから現在のテーマを読み込み
        const saved = localStorage.getItem('weeklyTheme')
        if (saved) {
            const theme = JSON.parse(saved)
            setCurrentTheme(theme)
            setFormData({
                week: theme.week,
                theme: theme.theme,
                description: theme.description
            })
        }
    }

    const handleSave = () => {
        const now = new Date()
        const themeData: WeeklyThemeData = {
            id: currentTheme?.id || `theme-${now.getTime()}`,
            week: formData.week,
            theme: formData.theme,
            description: formData.description,
            createdAt: currentTheme?.createdAt || now,
            updatedAt: now
        }

        localStorage.setItem('weeklyTheme', JSON.stringify(themeData))
        setCurrentTheme(themeData)
        setIsEditing(false)
    }

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        if (currentTheme) {
            setFormData({
                week: currentTheme.week,
                theme: currentTheme.theme,
                description: currentTheme.description
            })
        }
        setIsEditing(false)
    }

    return (
        <div className="container">
            <div className="card">
                <h2>🎯 今週のテーマ</h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                    MBSRクラスの宿題や今週意識したいテーマを設定しましょう
                </p>

                {!isEditing && currentTheme ? (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <span style={{
                                    background: '#4f46e5',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    第{currentTheme.week}週
                                </span>
                                <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                    {new Date(currentTheme.updatedAt).toLocaleDateString('ja-JP')} 更新
                                </span>
                            </div>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem', color: '#1d1d1f' }}>
                                {currentTheme.theme}
                            </h3>
                            <p style={{ color: '#6b7280', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                {currentTheme.description}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={handleEdit} className="btn btn-primary">
                                編集
                            </button>
                            <button onClick={() => navigate('/')} className="btn btn-secondary">
                                ホームに戻る
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="form-group">
                            <label className="form-label">週数</label>
                            <select
                                className="form-input"
                                value={formData.week}
                                onChange={(e) => setFormData(prev => ({ ...prev, week: parseInt(e.target.value) }))}
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(week => (
                                    <option key={week} value={week}>第{week}週</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">テーマ</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="例: ボディスキャンでの気づき、日常の中のマインドフルネス"
                                value={formData.theme}
                                onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">詳細・説明</label>
                            <textarea
                                className="form-textarea"
                                placeholder="テーマの詳細や今週意識したいポイントを記入してください..."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                style={{ minHeight: '120px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button
                                onClick={handleSave}
                                className="btn btn-primary"
                                disabled={!formData.theme.trim()}
                            >
                                保存
                            </button>
                            <button onClick={handleCancel} className="btn btn-secondary">
                                キャンセル
                            </button>
                        </div>
                    </div>
                )}

                {!currentTheme && !isEditing && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
                            まだテーマが設定されていません。<br />
                            今週のテーマを設定してみましょう！
                        </p>
                        <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                            テーマを設定
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WeeklyTheme