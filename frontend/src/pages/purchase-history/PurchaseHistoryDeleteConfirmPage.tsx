
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// 仕入履歴のデータ型
type PurchaseHistory = {
  purchase_id: number
  product_name: string
  category: string
  supplier_name: string
  status: string
  purchase_quantity: number
  notes: string | null
  created_at: string
}

// 仕入履歴キャンセル確認ページコンポーネント
function PurchaseHistoryDeleteConfirmPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // URLから仕入履歴番号を取得
  const purchaseId = Number(searchParams.get('purchase_id'))

  // 仕入履歴情報
  const [history, setHistory] = useState<PurchaseHistory | null>(null)

  // エラー表示
  const [errorMessage, setErrorMessage] = useState('')

  // APIから対象の仕入履歴を取得
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/purchase/history',
        )

        if (!response.ok) {
          throw new Error('仕入履歴の取得に失敗しました。')
        }

        const data = await response.json()

        // 指定された仕入履歴を取得
        const targetHistory = data.purchase_histories.find(
          (item: PurchaseHistory) =>
            item.purchase_id === purchaseId,
        )

        if (!targetHistory) {
          throw new Error('指定された仕入履歴が見つかりません。')
        }

        setHistory(targetHistory)
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '仕入履歴の取得に失敗しました。',
        )
      }
    }

    if (purchaseId > 0) {
      fetchHistory()
    } else {
      setErrorMessage('仕入履歴番号が指定されていません。')
    }
  }, [purchaseId])

    // キャンセル処理
    const handleCancel = async () => {
      console.log('キャンセルボタン押下')
      console.log('purchaseId:', purchaseId)

      try {
        const url = `http://localhost:8000/purchase/history/${purchaseId}/cancel?user_id=1`

        console.log('送信先:', url)

        const response = await fetch(url, {
          method: 'POST',
        })

        console.log('レスポンスステータス:', response.status)

        const responseText = await response.text()
        console.log('レスポンス内容:', responseText)

        if (!response.ok) {
          let message = 'キャンセルに失敗しました。'

          try {
            const data = JSON.parse(responseText)
            message = data.detail || message
          } catch {
            if (responseText) {
              message = responseText
            }
          }

          throw new Error(message)
        }

        console.log('キャンセル成功。完了画面へ遷移します。')
        navigate('/purchase/history/delete/complete')

      } catch (error) {
        console.error('キャンセル処理エラー:', error)

        window.alert(
          error instanceof Error
            ? error.message
            : 'キャンセルに失敗しました。',
        )
      }
    }

  return (
    <main className="main">
      <div className="page-heading">
        <h2>仕入履歴キャンセル確認</h2>
        <p>この仕入履歴を本当にキャンセルしますか？</p>
      </div>

      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      {history && (
        <>
          {/* キャンセル対象の仕入履歴 */}
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
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>{history.purchase_id}</td>
                  <td>{history.created_at}</td>
                  <td>{history.product_name}</td>
                  <td>{history.category}</td>
                  <td>{history.supplier_name}</td>
                  <td>{history.status}</td>
                  <td>{history.purchase_quantity}</td>
                  <td>{history.notes || '-'}</td>
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
              onClick={() => navigate('/purchase/history')}
            >
              戻る
            </button>

            <button
              type="button"
              className="history-cancel-button"
              onClick={handleCancel}
            >
              キャンセルする
            </button>
          </div>
        </>
      )}
    </main>
  )
}

export default PurchaseHistoryDeleteConfirmPage
