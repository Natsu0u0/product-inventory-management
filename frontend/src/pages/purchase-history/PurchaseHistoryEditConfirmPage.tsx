
import { useNavigate } from 'react-router-dom'

// 編集データの型
type EditData = {
  purchaseId: number
  productId: string
  productName: string
  supplierId: string
  supplierName: string
  quantity: string
  notes: string
}

// 仕入履歴編集確認ページコンポーネント
function PurchaseHistoryEditConfirmPage() {
  const navigate = useNavigate()

  // sessionStorageから編集データを取得
  const storedData = sessionStorage.getItem('purchaseEditData')

  const editData: EditData | null = storedData
    ? JSON.parse(storedData)
    : null

  // エラー表示
  const handleRegister = async () => {
    if (!editData) return

    try {
      // 編集内容をAPIへ送信
      const response = await fetch(
        'http://localhost:8000/purchase/history?user_id=1',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            purchase_id: editData.purchaseId,
            product_id: Number(editData.productId),
            supplier_id: Number(editData.supplierId),
            purchase_quantity: Number(editData.quantity),
            status: '修正',
            notes: editData.notes,
          }),
        },
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(
          data.detail || '仕入履歴の修正に失敗しました。',
        )
      }

      // API成功後に完了画面へ遷移
      navigate('/purchase/history/edit/complete')
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : '仕入履歴の修正に失敗しました。',
      )
    }
  }

  // 編集データが存在しない場合
  if (!editData) {
    return (
      <main className="main">
        <div className="page-heading">
          <h2>修正内容がありません</h2>
          <p>仕入履歴一覧からやり直してください。</p>
        </div>

        <div
          className="form-actions"
          style={{ justifyContent: 'center' }}
        >
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/purchase/history')}
          >
            仕入履歴へ戻る
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="main">
      <div className="page-heading">
        <h2>仕入履歴修正確認</h2>
        <p>修正内容に間違いがないか確認してください。</p>
      </div>

      {/* 修正内容 */}
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>仕入履歴番号</th>
              <th>商品名</th>
              <th>仕入先</th>
              <th>仕入数量</th>
              <th>備考</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{editData.purchaseId}</td>
              <td>{editData.productName}</td>
              <td>{editData.supplierName}</td>
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
            navigate(`/purchase/history/edit/${editData.purchaseId}`)
          }
        >
          戻る
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={handleRegister}
        >
          修正
        </button>
      </div>
    </main>
  )
}

export default PurchaseHistoryEditConfirmPage
