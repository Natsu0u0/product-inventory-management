
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

// 登録種別
type RegistrationType = 'product' | 'purchase' | 'sales'

// 商品情報
type Product = {
  product_id: number
  product_name: string
  category: string
}

// 仕入先情報
type Supplier = {
  supplier_id: number
  supplier_name: string
}

// 販売先情報
type Customer = {
  customer_id: number
  customer_name: string
}

// 各種登録ページコンポーネント
function RegistrationPage() {
  // 登録種別
  const [registrationType, setRegistrationType] =
    useState<RegistrationType>('product')

  // マスタ情報
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])

  // 入力項目
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [remarks, setRemarks] = useState('')

  // エラー表示
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()

  // マスタ情報を取得
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [productResponse, supplierResponse, customerResponse] =
          await Promise.all([
            fetch('http://localhost:8000/products'),
            fetch('http://localhost:8000/suppliers'),
            fetch('http://localhost:8000/customers'),
          ])

        if (
          !productResponse.ok ||
          !supplierResponse.ok ||
          !customerResponse.ok
        ) {
          throw new Error('マスタ情報の取得に失敗しました。')
        }

        const productData = await productResponse.json()
        const supplierData = await supplierResponse.json()
        const customerData = await customerResponse.json()

        setProducts(productData.products)
        setSuppliers(supplierData.suppliers)
        setCustomers(customerData.customers)
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'マスタ情報の取得に失敗しました。',
        )
      }
    }

    fetchMasterData()
  }, [])

  // 登録種別変更時に入力内容をリセット
  const handleRegistrationTypeChange = (value: RegistrationType) => {
    setRegistrationType(value)
    setProductName('')
    setCategory('')
    setSupplierId('')
    setCustomerId('')
    setProductId('')
    setQuantity('')
    setRemarks('')
    setErrorMessage('')
  }

  // 確認画面へ進む
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const selectedProduct = products.find(
      (product) => String(product.product_id) === productId,
    )

    const selectedSupplier = suppliers.find(
      (supplier) => String(supplier.supplier_id) === supplierId,
    )

    const selectedCustomer = customers.find(
      (customer) => String(customer.customer_id) === customerId,
    )

    const registrationData = {
      registrationType,
      productName,
      category,
      supplierId,
      supplierName: selectedSupplier?.supplier_name ?? '',
      customerId,
      customerName: selectedCustomer?.customer_name ?? '',
      productId,
      selectedProductName: selectedProduct?.product_name ?? '',
      quantity,
      remarks,
    }

    sessionStorage.setItem(
      'registrationData',
      JSON.stringify(registrationData),
    )

    navigate('/registration/confirm')
  }

  return (
    <main className="main">
      <div className="page-heading">
        <h2>各種登録</h2>
        <p>登録する内容を選択してください。</p>
      </div>

      <div className="form-container">
        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="registrationType">登録種別</label>
            <select
              id="registrationType"
              value={registrationType}
              onChange={(event) =>
                handleRegistrationTypeChange(
                  event.target.value as RegistrationType,
                )
              }
            >
              <option value="product">商品登録</option>
              <option value="purchase">仕入登録</option>
              <option value="sales">販売登録</option>
            </select>
          </div>

          {registrationType === 'product' && (
            <>
              <div className="form-group">
                <label htmlFor="productName">商品名</label>
                <input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">カテゴリ</label>
                <input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  required
                />
              </div>
            </>
          )}

          {(registrationType === 'purchase' ||
            registrationType === 'sales') && (
            <>
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

              {registrationType === 'purchase' && (
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
              )}

              {registrationType === 'sales' && (
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
              )}

              <div className="form-group">
                <label htmlFor="quantity">個数</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="remarks">備考</label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              確認画面へ
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default RegistrationPage
