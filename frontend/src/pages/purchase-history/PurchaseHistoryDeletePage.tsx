
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// 仕入履歴キャンセルページコンポーネント
function PurchaseHistoryDeletePage() {
  const { purchaseId } = useParams()
  const navigate = useNavigate()

  // 対象の仕入履歴番号を引き継いで確認画面へ遷移
  useEffect(() => {
    if (purchaseId) {
      navigate(
        `/purchase/history/delete/confirm?purchase_id=${purchaseId}`,
        { replace: true },
      )
    } else {
      navigate('/purchase/history', { replace: true })
    }
  }, [purchaseId, navigate])

  return null
}

export default PurchaseHistoryDeletePage
