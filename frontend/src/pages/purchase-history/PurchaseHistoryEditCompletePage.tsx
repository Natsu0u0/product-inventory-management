
import { useNavigate } from 'react-router-dom'

// 仕入履歴編集完了ページコンポーネント
function PurchaseHistoryEditCompletePage() {
  const navigate = useNavigate()

  // 仕入履歴一覧へ戻る
  const handleHistory = () => {
    sessionStorage.removeItem('purchaseEditData')
    navigate('/purchase/history')
  }

  // トップページへ戻る
  const handleHome = () => {
    sessionStorage.removeItem('purchaseEditData')
    navigate('/')
  }

  return (
    <main className="main">
      <div className="page-heading">
        <h2>仕入履歴修正完了</h2>
      </div>

      <div className="form-container">
        {/* 完了メッセージ */}
        <div className="form-group" style={{ textAlign: 'center' }}>
          <p>仕入履歴の修正が完了しました。</p>
        </div>

        {/* 操作ボタン */}
        <div
          className="form-actions"
          style={{ justifyContent: 'center', gap: '16px' }}
        >
          <button
            type="button"
            className="secondary-button"
            onClick={handleHistory}
          >
            仕入履歴へ戻る
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

export default PurchaseHistoryEditCompletePage
