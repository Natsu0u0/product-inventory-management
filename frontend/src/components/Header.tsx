// ヘッダーコンポーネント
function Header() {
  return (
    <header className="header">
      {/* システムタイトルの見出し */}
      <h1>商品・在庫管理システム</h1>
    </header>
  )
}

// 他のファイルからHeaderを使用できるようにする
export default Header