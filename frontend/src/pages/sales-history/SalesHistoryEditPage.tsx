
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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

// 商品情報
type Product = {
  product_id: number
  product_name: string
}

// 販売先情報
type Customer = {
  customer_id: number
  customer_name: string
}

// 編集データの型
type EditData = {
  salesId: number
  productId: string
  productName: string
  customerId: string
  customerName: string
  quantity: string
  notes: string
}

// 販売履歴編集ページコンポーネント
function SalesHistoryEditPage() {
  const { salesId } = useParams()
  const navigate = useNavigate()

  // 販売履歴とマスタ情報
  const [history, setHistory] = useState<SalesHistory | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])

  // 入力項目
  const [productId, setProductId] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')

  // エラーメッセージ
  const [errorMessage, setErrorMessage] = useState('')

  // APIから販売履歴とマスタ情報を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyResponse, productResponse, customerResponse] =
          await Promise.all([
            fetch('http://localhost:8000/sales/history'),
            fetch('http://localhost:8000/products'),
            fetch('http://localhost:8000/customers'),
          ])

        if (
          !historyResponse.ok ||
          !productResponse.ok ||
          !customerResponse.ok
        ) {
          throw new Error('情報の取得に失敗しました。')
        }

        const historyData = await historyResponse.json()
        const productData = await productResponse.json()
        const customerData = await customerResponse.json()

        // 指定された販売履歴を取得
        const targetHistory = historyData.sales_histories.find(
          (item: SalesHistory) =>
            item.sales_id === Number(salesId)
        )

        if (!targetHistory) {
          throw new Error('指定された販売履歴が見つかりません。')
        }

        // 取得したマスタ情報を設定
        setProducts(productData.products ?? [])
        setCustomers(customerData.customers ?? [])
        setHistory(targetHistory)

        // 確認画面から戻った場合は入力内容を復元
        const storedData = sessionStorage.getItem('salesEditData')

        if (storedData) {
          const savedData: EditData = JSON.parse(storedData)

          if (savedData.salesId === Number(salesId)) {
            setProductId(savedData.productId)
            setCustomerId(savedData.customerId)
            setQuantity(savedData.quantity)
            setNotes(savedData.notes)
            return
          }
        }

        // 初回表示時は既存の販売履歴を設定
        setProductId(String(targetHistory.product_id))
        setCustomerId(String(targetHistory.customer_id))
        setQuantity(String(targetHistory.sales_quantity))
        setNotes(targetHistory.notes ?? '')
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '販売履歴の取得に失敗しました。'
        )
      }
    }

    fetchData()
  }, [salesId])

  // 確認画面へ進む
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // 選択された商品と販売先の名称を取得
    const selectedProduct = products.find(
      (item) => String(item.product_id) === productId
    )

    const selectedCustomer = customers.find(
      (item) => String(item.customer_id) === customerId
    )

    // 編集内容を保存
    const editData: EditData = {
      salesId: Number(salesId),
      productId,
      productName: selectedProduct?.product_name ?? '',
      customerId,
      customerName: selectedCustomer?.customer_name ?? '',
      quantity,
      notes,
    }

    sessionStorage.setItem(
      'salesEditData',
      JSON.stringify(editData)
    )

    navigate('/sales/history/edit/confirm')
  }

  return (
    <main className="main">
      {/* メインコンテンツのページ見出し */}
      <div className="page-heading">
        <h2>販売履歴編集</h2>
        <p>販売履歴を編集してください。</p>
      </div>

      {/* エラーメッセージ */}
      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      {/* 販売履歴編集フォーム */}
      {history && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* 販売履歴番号 */}
            <div className="form-group">
              <label>販売履歴番号</label>
              <p>{history.sales_id}</p>
            </div>

            {/* 商品選択 */}
            <div className="form-group">
              <label htmlFor="productId">商品</label>
              <select
                id="productId"
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                required
              >
                <option value="">商品を選択してください</option>
                {products.map((product) => (
                  <option
                    key={product.product_id}
                    value={product.product_id}
                  >
                    {product.product_name}
                  </option>
                ))}
              </select>
            </div>

            {/* 販売先選択 */}
            <div className="form-group">
              <label htmlFor="customerId">販売先</label>
              <select
                id="customerId"
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                required
              >
                <option value="">販売先を選択してください</option>
                {customers.map((customer) => (
                  <option
                    key={customer.customer_id}
                    value={customer.customer_id}
                  >
                    {customer.customer_name}
                  </option>
                ))}
              </select>
            </div>

            {/* 販売数量 */}
            <div className="form-group">
              <label htmlFor="quantity">販売数量</label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
              />
            </div>

            {/* 備考 */}
            <div className="form-group">
              <label htmlFor="notes">備考</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
              />
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
              >
                戻る
              </button>

              <button type="submit" className="primary-button">
                確認画面へ
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

// 他のファイルからSalesHistoryEditPageを使用できるようにする
export default SalesHistoryEditPage
