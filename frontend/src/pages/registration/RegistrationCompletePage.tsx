import { useNavigate } from 'react-router-dom'

// 各種登録完了ページコンポーネント
function RegistrationCompletePage() {
  const navigate = useNavigate()

  // 登録データをクリアして各種登録画面へ戻る
  const handleBack = () => {
    sessionStorage.removeItem('registrationData')
    navigate('/registration')
  }

  // 登録データをクリアしてトップページへ戻る
  const handleHome = () => {
    sessionStorage.removeItem('registrationData')
    navigate('/')
  }

  // 確認画面へ戻る
  const handleConfirm = () => {
    navigate('/registration/confirm')
  }

  return (
    <main className="main">
      <div className="page-heading">
        <h2>各種登録</h2>
      </div>

      <div className="form-container">
        <div className="form-group" style={{ textAlign: 'center' }}>
          <p>登録が完了しました。</p>
          <p>データの登録が正常に完了しました。</p>
        </div>

        <div
          className="form-actions"
          style={{ justifyContent: 'center', gap: '16px' }}
        >
          
          <button
            type="button"
            className="secondary-button"
            onClick={handleConfirm}
          >
            戻る
          </button>

          
          <button
            type="button"
            className="secondary-button"
            onClick={handleBack}
          >
            各種登録へ戻る
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={handleHome}
          >
            トップページへ戻る
          </button>
        </div>
      </div>
    </main>
  )
}

export default RegistrationCompletePage