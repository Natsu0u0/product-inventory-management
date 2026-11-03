
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// 販売履歴キャンセルページコンポーネント
function SalesHistoryDeletePage() {
  const { salesId } = useParams()
  const navigate = useNavigate()

  // 対象の販売履歴番号を引き継いで確認画面へ遷移
  useEffect(() => {
    if (salesId) {
      navigate(
        `/sales/history/delete/confirm?sales_id=${salesId}`,
        { replace: true }
      )
    } else {
      navigate('/sales/history', { replace: true })
    }
  }, [salesId, navigate])

  return null
}

// 他のファイルからSalesHistoryDeletePageを使用できるようにする
export default SalesHistoryDeletePage
