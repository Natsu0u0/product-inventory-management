// 商品削除確認ページコンポーネント
function ProductDeleteConfirmPage() {
    return (
    <main className="main">
      {/* メインコンテンツのページ見出し */}
      <div className="page-heading">
        <h2>商品削除確認</h2>
        <p>商品を削除します。よろしいですか？</p>
      </div>
    </main>
  )
}

// 他のファイルからProductDeleteConfirmPageを使用できるようにする
export default ProductDeleteConfirmPage