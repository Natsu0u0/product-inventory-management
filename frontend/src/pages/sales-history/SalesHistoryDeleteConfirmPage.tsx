
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// 販売履歴のデータ型
type SalesHistory = {
  sales_id: number
  product_name: string
  category: string
  customer_name: string
  status: string
  sales_quantity: number
  notes: string | null
  created_at: string
}

// 販売履歴キャンセル確認ページコンポーネント
function SalesHistoryDeleteConfirmPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // URLから販売履歴番号を取得
  const salesId = Number(searchParams.get('sales_id'))

  // 販売履歴情報
  const [history, setHistory] = useState<SalesHistory | null>(null)

  // エラーメッセージ
  const [errorMessage, setErrorMessage] = useState('')

  // キャンセル処理中かどうか
  const [isSubmitting, setIsSubmitting] = useState(false)

  // APIから対象の販売履歴を取得
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/sales/history'
        )

        if (!response.ok) {
          throw new Error('販売履歴の取得に失敗しました。')
        }

        const data = await response.json()

        // 指定された販売履歴を取得
        const targetHistory = data.sales_histories.find(
          (item: SalesHistory) =>
            item.sales_id === salesId
        )

        if (!targetHistory) {
          throw new Error('指定された販売履歴が見つかりません。')
        }

        setHistory(targetHistory)
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '販売履歴の取得に失敗しました。'
        )
      }
    }

    if (salesId > 0) {
      fetchHistory()
    } else {
      setErrorMessage('販売履歴番号が指定されていません。')
    }
  }, [salesId])

  // キャンセル処理
  const handleCancel = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      // ログインユーザーIDを取得
      const userId = sessionStorage.getItem('user_id') || '1'

      // キャンセルAPIを実行
      const response = await fetch(
        `http://localhost:8000/sales/history/${salesId}/cancel?user_id=${userId}`,
        {
          method: 'POST',
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(
          data.detail || '販売履歴のキャンセルに失敗しました。'
        )
      }

      // API成功後に完了画面へ遷移
      navigate('/sales/history/delete/complete')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '販売履歴のキャンセルに失敗しました。'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="main">
      {/* メインコンテンツのページ見出し */}
      <div className="page-heading">
        <h2>販売履歴キャンセル確認</h2>
        <p>この販売履歴を本当にキャンセルしますか？</p>
      </div>

      {/* エラーメッセージ */}
      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      {/* キャンセル対象の販売履歴 */}
      {history && (
        <>
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>販売履歴番号</th>
                  <th>登録日</th>
                  <th>商品名</th>
                  <th>カテゴリ</th>
                  <th>販売先</th>
                  <th>ステータス</th>
                  <th>販売数量</th>
                  <th>備考</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>{history.sales_id}</td>
                  <td>{history.created_at}</td>
                  <td>{history.product_name}</td>
                  <td>{history.category}</td>
                  <td>{history.customer_name}</td>
                  <td>{history.status}</td>
                  <td>{history.sales_quantity}</td>
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
              onClick={() => navigate('/sales/history')}
              disabled={isSubmitting}
            >
              戻る
            </button>

            <button
              type="button"
              className="history-cancel-button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {isSubmitting ? '処理中...' : 'キャンセルする'}
            </button>
          </div>
        </>
      )}
    </main>
  )
}

// 他のファイルからSalesHistoryDeleteConfirmPageを使用できるようにする
export default SalesHistoryDeleteConfirmPage
