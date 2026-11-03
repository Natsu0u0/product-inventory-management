import { useNavigate } from 'react-router-dom'

// 各種登録完了ページコンポーネント
function RegistrationCompletePage() {
  const navigate = useNavigate()

  // 各種登録画面へ戻る
  const handleBack = () => {
    navigate('/registration')
  }

  return (
    <main className="main">
      <div className="page-heading">
        <h2>各種登録</h2>
        <p>登録が完了しました。</p>
      </div>

      <div className="form-container">
        <div className="form-group">
          <p>データの登録が正常に完了しました。</p>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="primary-button"
            onClick={handleBack}
          >
            各種登録へ戻る
          </button>
        </div>
      </div>
    </main>
  )
}

export default RegistrationCompletePage