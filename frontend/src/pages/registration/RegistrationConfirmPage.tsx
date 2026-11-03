
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 登録データの型
type RegistrationData = {
  registrationType: 'product' | 'purchase' | 'sales'
  productName: string
  category: string
  supplierId: string
  supplierName: string
  customerId: string
  customerName: string
  productId: string
  selectedProductName: string
  quantity: string
  remarks: string
}

// 各種登録確認ページコンポーネント
function RegistrationConfirmPage() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // sessionStorageから登録データを取得
  const storedData = sessionStorage.getItem('registrationData')

  const registrationData: RegistrationData | null = storedData
    ? JSON.parse(storedData)
    : null

  // 登録データがない場合は登録画面へ戻る
  if (!registrationData) {
    return (
      <main className="main">
        <div className="page-heading">
          <h2>登録内容がありません</h2>
          <p>登録画面から入力し直してください。</p>
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/registration')}
          >
            登録画面へ戻る
          </button>
        </div>
      </main>
    )
  }

  // 登録種別の表示名
  const registrationTypeName = {
    product: '商品登録',
    purchase: '仕入登録',
    sales: '販売登録',
  }[registrationData.registrationType]

  // 登録画面へ戻る
  const handleBack = () => {
    navigate('/registration')
  }

  // 登録処理
  const handleRegister = async () => {
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const userId = localStorage.getItem('user_id')

      if (!userId) {
        throw new Error('ユーザー情報を取得できません。再ログインしてください。')
      }

      let url = ''
      let requestBody = {}

      // 商品登録
      if (registrationData.registrationType === 'product') {
        url = 'http://localhost:8000/products'

        requestBody = {
          product_name: registrationData.productName,
          category: registrationData.category,
        }
      }

      // 仕入登録
      if (registrationData.registrationType === 'purchase') {
        url = 'http://localhost:8000/purchase/history'

        requestBody = {
          product_id: Number(registrationData.productId),
          supplier_id: Number(registrationData.supplierId),
          status: '新規',
          purchase_quantity: Number(registrationData.quantity),
          notes: registrationData.remarks || null,
        }
      }

      // 販売登録
      if (registrationData.registrationType === 'sales') {
        url = 'http://localhost:8000/sales/history'

        requestBody = {
          product_id: Number(registrationData.productId),
          customer_id: Number(registrationData.customerId),
          status: '新規',
          sales_quantity: Number(registrationData.quantity),
          notes: registrationData.remarks || null,
        }
      }

      const response = await fetch(
        `${url}?user_id=${encodeURIComponent(userId)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.detail || '登録に失敗しました。入力内容を確認してください。'
        )
      }

      // 登録成功後に完了画面へ遷移
      sessionStorage.removeItem('registrationData')
      navigate('/registration/complete')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '登録処理中にエラーが発生しました。'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="main">
      <div className="page-heading">
        <h2>各種登録確認</h2>
        <p>登録内容に間違いがないか確認してください。</p>
      </div>

      <div className="form-container">
        <div className="form-group">
          <label>登録種別</label>
          <p>{registrationTypeName}</p>
        </div>

        {/* 商品登録 */}
        {registrationData.registrationType === 'product' && (
          <>
            <div className="form-group">
              <label>商品名</label>
              <p>{registrationData.productName}</p>
            </div>

            <div className="form-group">
              <label>カテゴリ</label>
              <p>{registrationData.category}</p>
            </div>
          </>
        )}

        {/* 仕入登録 */}
        {registrationData.registrationType === 'purchase' && (
          <>
            <div className="form-group">
              <label>商品</label>
              <p>{registrationData.selectedProductName}</p>
            </div>

            <div className="form-group">
              <label>仕入先</label>
              <p>{registrationData.supplierName}</p>
            </div>

            <div className="form-group">
              <label>個数</label>
              <p>{registrationData.quantity}</p>
            </div>
          </>
        )}

        {/* 販売登録 */}
        {registrationData.registrationType === 'sales' && (
          <>
            <div className="form-group">
              <label>商品</label>
              <p>{registrationData.selectedProductName}</p>
            </div>

            <div className="form-group">
              <label>販売先</label>
              <p>{registrationData.customerName}</p>
            </div>

            <div className="form-group">
              <label>個数</label>
              <p>{registrationData.quantity}</p>
            </div>
          </>
        )}

        {/* 備考 */}
        <div className="form-group">
          <label>備考</label>
          <p>{registrationData.remarks || 'なし'}</p>
        </div>

        {/* エラーメッセージ */}
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        {/* 操作ボタン */}
        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            戻る
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={handleRegister}
            disabled={isSubmitting}
          >
            {isSubmitting ? '登録中...' : '登録する'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default RegistrationConfirmPage
