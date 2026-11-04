
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

  // sessionStorageから登録データを取得
  const storedData = sessionStorage.getItem('registrationData')

  const registrationData: RegistrationData | null = storedData
    ? JSON.parse(storedData)
    : null

  // 登録データがない場合
  if (!registrationData) {
    return (
      <main className="main">
        <div className="page-heading">
          <h2>登録内容がありません</h2>
          <p>登録画面から入力し直してください。</p>
        </div>

        <div className="form-container">
          <div className="form-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => navigate('/registration')}
            >
              登録画面へ戻る
            </button>
          </div>
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
    try {
      // ログインユーザーIDを取得
      const userId = sessionStorage.getItem('user_id')

      if (!userId) {
        alert('ログイン情報を取得できません。再度ログインしてください。')
        return
      }

      let endpoint = ''
      let requestBody = {}

      // 商品登録の場合
      if (registrationData.registrationType === 'product') {
        endpoint = `/api/products?user_id=${userId}`

        requestBody = {
          category: registrationData.category,
          product_name: registrationData.productName,
        }
      }

      // 仕入登録の場合
      else if (registrationData.registrationType === 'purchase') {
        const supplierId = Number(registrationData.supplierId)
        const productId = Number(registrationData.productId)
        const quantity = Number(registrationData.quantity)

        if (
          !supplierId ||
          !productId ||
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          alert('仕入先・商品・仕入数量を正しく入力してください。')
          return
        }

        endpoint = `/api/purchase/history?user_id=${userId}`

        requestBody = {
          supplier_id: supplierId,
          product_id: productId,
          status: '新規',
          purchase_quantity: quantity,
          notes: registrationData.remarks,
        }
      }

      // 販売登録の場合
      else if (registrationData.registrationType === 'sales') {
        const customerId = Number(registrationData.customerId)
        const productId = Number(registrationData.productId)
        const quantity = Number(registrationData.quantity)

        if (
          !customerId ||
          !productId ||
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          alert('販売先・商品・販売数量を正しく入力してください。')
          return
        }

        endpoint = `/api/sales/history?user_id=${userId}`

        requestBody = {
          customer_id: customerId,
          product_id: productId,
          status: '新規',
          sales_quantity: quantity,
          notes: registrationData.remarks,
        }
      }

      // APIを呼び出す
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      // APIの処理結果を確認
      if (!response.ok) {
        const errorText = await response.text()

        console.error('HTTPステータス:', response.status)
        console.error('APIレスポンス:', errorText)

        throw new Error('登録に失敗しました。')
      }

      // 登録成功後に完了画面へ進む
      navigate('/registration/complete')
    } catch (error) {
      console.error('登録エラー:', error)
      alert('登録に失敗しました。入力内容や通信状況を確認してください。')
    }
  }

  return (
    <main className="main">
      <div className="page-heading">
        <h2>各種登録確認</h2>
        <p>登録内容に間違いがないか確認してください。</p>
      </div>

      {/* 登録内容 */}
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>登録種別</th>

              {registrationData.registrationType === 'product' && (
                <>
                  <th>商品名</th>
                  <th>カテゴリ</th>
                </>
              )}

              {registrationData.registrationType === 'purchase' && (
                <>
                  <th>商品名</th>
                  <th>仕入先</th>
                  <th>仕入数量</th>
                </>
              )}

              {registrationData.registrationType === 'sales' && (
                <>
                  <th>商品名</th>
                  <th>販売先</th>
                  <th>販売数量</th>
                </>
              )}

              <th>備考</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{registrationTypeName}</td>

              {registrationData.registrationType === 'product' && (
                <>
                  <td>{registrationData.productName}</td>
                  <td>{registrationData.category}</td>
                </>
              )}

              {registrationData.registrationType === 'purchase' && (
                <>
                  <td>{registrationData.selectedProductName}</td>
                  <td>{registrationData.supplierName}</td>
                  <td>{registrationData.quantity}</td>
                </>
              )}

              {registrationData.registrationType === 'sales' && (
                <>
                  <td>{registrationData.selectedProductName}</td>
                  <td>{registrationData.customerName}</td>
                  <td>{registrationData.quantity}</td>
                </>
              )}

              <td>{registrationData.remarks || '-'}</td>
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
          onClick={handleBack}
        >
          戻る
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={handleRegister}
        >
          登録
        </button>
      </div>
    </main>
  )
}

export default RegistrationConfirmPage
