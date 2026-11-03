
import { useNavigate } from 'react-router-dom'

// 販売履歴キャンセル完了ページコンポーネント
function SalesHistoryDeleteCompletePage() {
  const navigate = useNavigate()

  // 販売履歴一覧へ戻る
  const handleHistory = () => {
    navigate('/sales/history')
  }

  // トップページへ戻る
  const handleHome = () => {
    navigate('/')
  }

  return (
    <main className="main">
      {/* メインコンテンツのページ見出し */}
      <div className="page-heading">
        <h2>販売履歴キャンセル完了</h2>
        <p>販売履歴のキャンセルが完了しました。</p>
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

// 他のファイルからSalesHistoryDeleteCompletePageを使用できるようにする
export default SalesHistoryDeleteCompletePage
