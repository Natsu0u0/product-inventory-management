
import { useNavigate } from 'react-router-dom'

// 販売履歴編集完了ページコンポーネント
function SalesHistoryEditCompletePage() {
  const navigate = useNavigate()

  // 販売履歴一覧へ戻る
  const handleHistory = () => {
    sessionStorage.removeItem('salesEditData')
    navigate('/sales/history')
  }

  // トップページへ戻る
  const handleHome = () => {
    sessionStorage.removeItem('salesEditData')
    navigate('/')
  }

  return (
    <main className="main">
      {/* メインコンテンツのページ見出し */}
      <div className="page-heading">
        <h2>販売履歴編集完了</h2>
        <p>販売履歴の編集が完了しました。</p>
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
          販売履歴へ戻る
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={handleHome}
        >
          トップページへ戻る
        </button>
      </div>
    </main>
  )
}

// 他のファイルからSalesHistoryEditCompletePageを使用できるようにする
export default SalesHistoryEditCompletePage
