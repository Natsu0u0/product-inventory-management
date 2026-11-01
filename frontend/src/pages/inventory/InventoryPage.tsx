// 在庫管理ページコンポーネント
function InventoryPage() {
    return (
    <main className="main">
      {/* メインコンテンツのページ見出し */}
      <div className="page-heading">
        <h2>在庫管理</h2>
        <p>在庫管理ページです。</p>
      </div>
    </main>
  )
}

// 他のファイルからInventoryPageを使用できるようにする
export default InventoryPage