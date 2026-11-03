
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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

// 商品情報
type Product = {
  product_id: number
  product_name: string
}

// 仕入先情報
type Supplier = {
  supplier_id: number
  supplier_name: string
}

// 編集データの型
type EditData = {
  purchaseId: number
  productId: string
  productName: string
  supplierId: string
  supplierName: string
  quantity: string
  notes: string
}

// 仕入履歴編集ページ
function PurchaseHistoryEditPage() {
  const { purchaseId } = useParams()
  const navigate = useNavigate()

  // 仕入履歴・マスタ情報
  const [history, setHistory] = useState<PurchaseHistory | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  // 入力項目
  const [productId, setProductId] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')

  // エラー表示
  const [errorMessage, setErrorMessage] = useState('')

  // APIから仕入履歴とマスタ情報を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyResponse, productResponse, supplierResponse] =
          await Promise.all([
            fetch('http://localhost:8000/purchase/history'),
            fetch('http://localhost:8000/products'),
            fetch('http://localhost:8000/suppliers'),
          ])

        if (
          !historyResponse.ok ||
          !productResponse.ok ||
          !supplierResponse.ok
        ) {
          throw new Error('情報の取得に失敗しました。')
        }

        const historyData = await historyResponse.json()
        const productData = await productResponse.json()
        const supplierData = await supplierResponse.json()

        // 指定された仕入履歴を取得
        const targetHistory = historyData.purchase_histories.find(
          (item: PurchaseHistory) =>
            item.purchase_id === Number(purchaseId),
        )

        if (!targetHistory) {
          throw new Error('指定された仕入履歴が見つかりません。')
        }

        // 取得したマスタ情報を画面に設定
        setProducts(productData.products)
        setSuppliers(supplierData.suppliers)
        setHistory(targetHistory)

        // 確認画面から戻った場合は保存済みの入力内容を復元
        const storedData = sessionStorage.getItem('purchaseEditData')

        if (storedData) {
          const savedData: EditData = JSON.parse(storedData)

          if (savedData.purchaseId === Number(purchaseId)) {
            setProductId(savedData.productId)
            setSupplierId(savedData.supplierId)
            setQuantity(savedData.quantity)
            setNotes(savedData.notes)
            return
          }
        }

        // 初回表示時は既存の仕入履歴を入力欄に設定
        setProductId(String(targetHistory.product_id))
        setSupplierId(String(targetHistory.supplier_id))
        setQuantity(String(targetHistory.purchase_quantity))
        setNotes(targetHistory.notes ?? '')
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '仕入履歴の情報を取得できませんでした。',
        )
      }
    }

    fetchData()
  }, [purchaseId])

  // 確認画面へ進む
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // 選択された商品・仕入先の名称を取得
    const selectedProduct = products.find(
      (item) => String(item.product_id) === productId,
    )

    const selectedSupplier = suppliers.find(
      (item) => String(item.supplier_id) === supplierId,
    )

    // 編集内容を保存
    const editData: EditData = {
      purchaseId: Number(purchaseId),
      productId,
      productName: selectedProduct?.product_name ?? '',
      supplierId,
      supplierName: selectedSupplier?.supplier_name ?? '',
      quantity,
      notes,
    }

    sessionStorage.setItem(
      'purchaseEditData',
      JSON.stringify(editData),
    )

    navigate('/purchase/history/edit/confirm')
  }

  return (
    <main className="main">
      <div className="page-heading">
        <h2>仕入履歴修正</h2>
        <p>仕入履歴の内容を修正してください。</p>
      </div>

      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      {history && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* 仕入履歴番号 */}
            <div className="form-group">
              <label>仕入履歴番号</label>
              <p>{history.purchase_id}</p>
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

            {/* 仕入先選択 */}
            <div className="form-group">
              <label htmlFor="supplierId">仕入先</label>
              <select
                id="supplierId"
                value={supplierId}
                onChange={(event) => setSupplierId(event.target.value)}
                required
              >
                <option value="">仕入先を選択してください</option>
                {suppliers.map((supplier) => (
                  <option
                    key={supplier.supplier_id}
                    value={supplier.supplier_id}
                  >
                    {supplier.supplier_name}
                  </option>
                ))}
              </select>
            </div>

            {/* 仕入数量 */}
            <div className="form-group">
              <label htmlFor="quantity">仕入数量</label>
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
                onClick={() => navigate('/purchase/history')}
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

export default PurchaseHistoryEditPage
