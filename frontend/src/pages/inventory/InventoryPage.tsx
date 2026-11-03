
import { useEffect, useState } from 'react'

// 在庫情報のデータ型
type Inventory = {
  inventory_id: number
  product_id: number
  product_name: string
  category: string
  stock_quantity: number
  notes: string | null
}

// 在庫管理ページ
function InventoryPage() {
  const [inventories, setInventories] = useState<Inventory[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  // APIから在庫一覧を取得
  const fetchInventories = async () => {
    try {
      const response = await fetch(
        'http://localhost:8000/inventories'
      )

      if (!response.ok) {
        throw new Error('在庫一覧の取得に失敗しました。')
      }

      const data = await response.json()
      setInventories(data.inventories ?? [])
      setErrorMessage('')
    } catch {
      setErrorMessage('在庫一覧の取得に失敗しました。')
    }
  }

  useEffect(() => {
    fetchInventories()
  }, [])

  return (
    <main className="main">
      <div className="page-heading">
        <h2>在庫管理</h2>
        <p>商品ごとの在庫状況を確認できます。</p>
      </div>

      {errorMessage && <p>{errorMessage}</p>}

      {!errorMessage && inventories.length === 0 && (
        <p>在庫情報はありません。</p>
      )}

      {!errorMessage && inventories.length > 0 && (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>在庫ID</th>
                <th>商品ID</th>
                <th>商品名</th>
                <th>カテゴリ</th>
                <th>在庫数量</th>
                <th>備考</th>
              </tr>
            </thead>

            <tbody>
              {inventories.map((inventory) => (
                <tr key={inventory.inventory_id}>
                  <td>{inventory.inventory_id}</td>
                  <td>{inventory.product_id}</td>
                  <td>{inventory.product_name}</td>
                  <td>{inventory.category}</td>
                  <td>{inventory.stock_quantity}</td>
                  <td>{inventory.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default InventoryPage
