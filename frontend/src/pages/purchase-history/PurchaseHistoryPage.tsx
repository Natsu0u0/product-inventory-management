
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 仕入履歴のデータ型
type PurchaseHistory = {
  purchase_id: number
  supplier_id: number
  product_id: number
  product_name: string
  category: string
  status: string
  purchase_quantity: number
  notes: string | null
  created_at: string
  supplier_name: string
}

// 仕入履歴一覧ページ
function PurchaseHistoryPage() {
  const [purchaseHistories, setPurchaseHistories] =
    useState<PurchaseHistory[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  // APIから仕入履歴を取得
  const fetchPurchaseHistories = async () => {
    try {
      const response = await fetch(
        'http://localhost:8000/purchase/history'
      )

      if (!response.ok) {
        throw new Error('仕入履歴の取得に失敗しました。')
      }

      const data = await response.json()
      setPurchaseHistories(data.purchase_histories)
      setErrorMessage('')
    } catch {
      setErrorMessage('仕入履歴の取得に失敗しました。')
    }
  }

  useEffect(() => {
    fetchPurchaseHistories()
  }, [])

  // キャンセル処理
  const handleCancel = async (purchaseId: number) => {
    const confirmed = window.confirm(
      `仕入履歴番号 ${purchaseId} をキャンセルしますか？`
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8000/purchase/history/${purchaseId}/cancel?user_id=1`,
        {
          method: 'POST'
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'キャンセルに失敗しました。')
      }

      setMessage('仕入履歴をキャンセルしました。')
      await fetchPurchaseHistories()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'キャンセルに失敗しました。'
      )
    }
  }

  // キャンセル元の仕入履歴番号を取得
  const cancelledPurchaseIds = purchaseHistories
    .map((history) => {
      const match = history.notes?.match(
        /キャンセル元仕入履歴番号：(\d+)/
      )
      return match ? Number(match[1]) : null
    })
    .filter((id): id is number => id !== null)

  return (
    <main className="main">
      <div className="page-heading">
        <h2>仕入履歴</h2>
        <p>登録された仕入履歴を確認できます。</p>
      </div>

      {errorMessage && <p>{errorMessage}</p>}
      {message && <p>{message}</p>}

      {!errorMessage && purchaseHistories.length === 0 && (
        <p>仕入履歴はありません。</p>
      )}

      {!errorMessage && purchaseHistories.length > 0 && (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>仕入履歴番号</th>
                <th>登録日</th>
                <th>商品名</th>
                <th>カテゴリ</th>
                <th>仕入先</th>
                <th>ステータス</th>
                <th>仕入数量</th>
                <th>備考</th>
                <th>操作</th>
              </tr>
            </thead>

            <tbody>
              {purchaseHistories.map((history) => {
                const isCancelHistory =
                  history.notes?.includes('キャンセル元仕入履歴番号：') ?? false

                const isCancelledOriginal =
                  cancelledPurchaseIds.includes(history.purchase_id)

                const isOperationDisabled =
                  isCancelHistory || isCancelledOriginal

                return (
                  <tr key={history.purchase_id}>
                    <td>{history.purchase_id}</td>
                    <td>{history.created_at}</td>
                    <td>{history.product_name}</td>
                    <td>{history.category}</td>
                    <td>{history.supplier_name}</td>
                    <td>{history.status}</td>
                    <td>{history.purchase_quantity}</td>
                    <td>{history.notes || '-'}</td>
                    <td>
                      {!isOperationDisabled && (
                        <div className="history-actions">
                          <button
                            type="button"
                            className="history-edit-button"
                            onClick={() =>
                              navigate(
                                `/purchase/history/edit/${history.purchase_id}`
                              )
                            }
                          >
                            修正
                          </button>

                          <button
                            type="button"
                            className="history-cancel-button"
                            onClick={() =>
                              handleCancel(history.purchase_id)
                            }
                          >
                            キャンセル
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default PurchaseHistoryPage
