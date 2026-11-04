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

// ポップアップの種類
type ModalType = 'confirm' | 'error' | 'success' | null

// 在庫管理ページ
function InventoryPage() {
  const [inventories, setInventories] = useState<Inventory[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  // 削除対象の在庫ID
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(null)

  // ポップアップの状態
  const [modalType, setModalType] = useState<ModalType>(null)
  const [modalMessage, setModalMessage] = useState('')

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

  // 削除確認ポップアップを表示
  const handleDeleteClick = (inventoryId: number) => {
    setSelectedInventoryId(inventoryId)
    setModalType('confirm')
    setModalMessage('この在庫データを削除してもよろしいですか？')
  }

  // 在庫データ削除
  const handleDelete = async () => {
    if (selectedInventoryId === null) return

    try {
      const response = await fetch(
        `http://localhost:8000/inventories/${selectedInventoryId}`,
        {
          method: 'DELETE'
        }
      )

      const data = await response.json()

      // 削除に失敗した場合
      if (!response.ok) {
        setModalType('error')
        setModalMessage(
          data.detail || '在庫データの削除に失敗しました。'
        )
        return
      }

      // 削除成功
      setModalType('success')
      setModalMessage('在庫データを削除しました。')

    } catch {
      setModalType('error')
      setModalMessage('サーバーとの通信に失敗しました。')
    }
  }

  // ポップアップを閉じる
  const handleModalClose = () => {
    const isSuccess = modalType === 'success'

    setModalType(null)
    setSelectedInventoryId(null)

    // 削除成功後に一覧を再取得
    if (isSuccess) {
      fetchInventories()
    }
  }

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
                <th style={{ textAlign: 'right' }}>操作</th>
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
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteClick(inventory.inventory_id)
                      }
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ポップアップ */}
      {modalType !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '8px',
              width: 'min(400px, 90%)',
              textAlign: 'center'
            }}
          >
            <p>{modalMessage}</p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '24px'
              }}
            >
              {modalType === 'confirm' && (
                <>
                  <button
                    type="button"
                    onClick={handleModalClose}
                  >
                    戻る
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                  >
                    削除する
                  </button>
                </>
              )}

              {(modalType === 'error' || modalType === 'success') && (
                <button
                  type="button"
                  onClick={handleModalClose}
                >
                  閉じる
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default InventoryPage