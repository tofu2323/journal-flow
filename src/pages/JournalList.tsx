const JournalList = () => {
  return (
    <div className="container">
      <div className="card">
        <h2>📖 ジャーナルの振り返り</h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          過去のエントリーを振り返って、気づきを深めましょう
        </p>
        
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#9ca3af' }}>
            まだエントリーがありません。<br />
            最初のジャーナルを書いてみましょう！
          </p>
        </div>
      </div>
    </div>
  )
}

export default JournalList