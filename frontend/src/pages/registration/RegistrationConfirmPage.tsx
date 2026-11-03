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

  // 完了画面へ進む
  const handleRegister = () => {
    navigate('/registration/complete')
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