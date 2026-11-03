
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 販売履歴のデータ型
type SalesHistory = {
  sales_id: number
  customer_id: number
  product_id: number
  product_name: string
  category: string
  status: string
  sales_quantity: number
  notes: string | null
  created_at: string
  customer_name: string
}

// 販売履歴一覧ページコンポーネント
function SalesHistoryPage() {
  const navigate = useNavigate()

  // 販売履歴一覧
  const [salesHistories, setSalesHistories] = useState<SalesHistory[]>([])

  // エラーメッセージ
  const [errorMessage, setErrorMessage] = useState('')

  // APIから販売履歴を取得
  const fetchSalesHistories = async () => {
    try {
      const response = await fetch(
        'http://localhost:8000/sales/history'
      )

      if (!response.ok) {
        throw new Error('販売履歴の取得に失敗しました。')
      }

      const data = await response.json()

      // 販売履歴を最大30件表示
      setSalesHistories(
        (data.sales_histories ?? []).slice(0, 30)
      )

      setErrorMessage('')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '販売履歴の取得に失敗しました。'
      )
    }
  }

  // 初回表示時に販売履歴を取得
  useEffect(() => {
    fetchSalesHistories()
  }, [])

  // キャンセル元の販売履歴番号を取得
  const cancelledSalesIds = salesHistories
    .map((history) => {
      const match = history.notes?.match(/キャンセル元販売履歴番号：(\d+)/)
      return match ? Number(match[1]) : null
    })
    .filter((id): id is number => id !== null)

  return (
    <main className="main">
      {/* メインコンテンツのページ見出し */}
      <div className="page-heading">
        <h2>販売履歴</h2>
        <p>登録された販売履歴を確認できます。</p>
      </div>

      {/* エラーメッセージ */}
      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      {/* 販売履歴が存在しない場合 */}
      {!errorMessage && salesHistories.length === 0 && (
        <p>販売履歴はありません。</p>
      )}

      {/* 販売履歴一覧 */}
      {!errorMessage && salesHistories.length > 0 && (
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
                <th>操作</th>
              </tr>
            </thead>

            <tbody>
              {salesHistories.map((history) => {
                // キャンセル履歴かどうかを判定
                const isCancelHistory =
                  history.notes?.includes(
                    'キャンセル元販売履歴番号：'
                  ) ?? false

                // キャンセル済みの元履歴かどうかを判定
                const isCancelledOriginal =
                  cancelledSalesIds.includes(history.sales_id)

                // 操作ボタンを表示しない履歴かどうかを判定
                const isOperationDisabled =
                  isCancelHistory || isCancelledOriginal

                return (
                  <tr key={history.sales_id}>
                    <td>{history.sales_id}</td>
                    <td>{history.created_at}</td>
                    <td>{history.product_name}</td>
                    <td>{history.category}</td>
                    <td>{history.customer_name}</td>
                    <td>{history.status}</td>
                    <td>{history.sales_quantity}</td>
                    <td>{history.notes || '-'}</td>
                    <td>
                      {!isOperationDisabled && (
                        <div className="history-actions">
                          <button
                            type="button"
                            className="history-edit-button"
                            onClick={() =>
                              navigate(
                                `/sales/history/edit/${history.sales_id}`
                              )
                            }
                          >
                            修正
                          </button>

                          <button
                            type="button"
                            className="history-cancel-button"
                            onClick={() =>
                              navigate(
                                `/sales/history/delete/${history.sales_id}`
                              )
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

// 他のファイルからSalesHistoryPageを使用できるようにする
export default SalesHistoryPage
