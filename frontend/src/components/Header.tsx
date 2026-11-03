// ヘッダーコンポーネント
function Header({
  isLoggedIn,
  onLogout,
}: {
  isLoggedIn: boolean
  onLogout: () => void
}) {
  return (
    <header className="header">
      {/* システムタイトルの見出し */}
      <h1>商品・在庫管理システム</h1>
      {/* ログイン状態に応じてログアウトボタンを表示 */}
      {isLoggedIn && (
        <button onClick={onLogout}>ログアウト</button>
      )}
    </header>
  )
}

// 他のファイルからHeaderを使用できるようにする
export default Header