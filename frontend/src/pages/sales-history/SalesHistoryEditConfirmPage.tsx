
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 編集データの型
type EditData = {
  salesId: number
  productId: string
  productName: string
  customerId: string
  customerName: string
  quantity: string
  notes: string
}

// 販売履歴編集確認ページコンポーネント
function SalesHistoryEditConfirmPage() {
  const navigate = useNavigate()

  // sessionStorageから編集データを取得
  const storedData = sessionStorage.getItem('salesEditData')

  const editData: EditData | null = storedData
    ? JSON.parse(storedData)
    : null

  // エラーメッセージ
  const [errorMessage, setErrorMessage] = useState('')

  // 修正処理
  const handleUpdate = async () => {
    if (!editData) return

    try {
      // ログインユーザーIDを取得
      const userId = sessionStorage.getItem('user_id') || '1'

      // 編集内容をAPIへ送信
      const response = await fetch(
        `http://localhost:8000/sales/history?user_id=${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sales_id: editData.salesId,
            product_id: Number(editData.productId),
            customer_id: Number(editData.customerId),
            sales_quantity: Number(editData.quantity),
            status: '修正',
            notes: editData.notes,
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(
          data.detail || '販売履歴の修正に失敗しました。'
        )
      }

      // API成功後に完了画面へ遷移
      navigate('/sales/history/edit/complete')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '販売履歴の修正に失敗しました。'
      )
    }
  }

  // 編集データが存在しない場合
  if (!editData) {
    return (
      <main className="main">
        {/* メインコンテンツのページ見出し */}
        <div className="page-heading">
          <h2>修正内容がありません</h2>
          <p>販売履歴一覧からやり直してください。</p>
        </div>

        <div
          className="form-actions"
          style={{ justifyContent: 'center' }}
        >
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/sales/history')}
          >
            販売履歴へ戻る
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="main">
      {/* メインコンテンツのページ見出し */}
      <div className="page-heading">
        <h2>販売履歴編集確認</h2>
        <p>販売履歴を編集します。よろしいですか？</p>
      </div>

      {/* エラーメッセージ */}
      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      {/* 編集内容の確認 */}
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>販売履歴番号</th>
              <th>商品名</th>
              <th>販売先</th>
              <th>販売数量</th>
              <th>備考</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{editData.salesId}</td>
              <td>{editData.productName}</td>
              <td>{editData.customerName}</td>
              <td>{editData.quantity}</td>
              <td>{editData.notes || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 操作ボタン */}
      <div
        className="form-actions"
        style={{ justifyContent: 'center', gap: '16px' }}
      >
        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            navigate(`/sales/history/edit/${editData.salesId}`)
          }
        >
          戻る
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={handleUpdate}
        >
          修正
        </button>
      </div>
    </main>
  )
}

// 他のファイルからSalesHistoryEditConfirmPageを使用できるようにする
export default SalesHistoryEditConfirmPage
