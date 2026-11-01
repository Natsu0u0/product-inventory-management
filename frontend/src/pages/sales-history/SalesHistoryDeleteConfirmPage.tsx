// 売上履歴削除確認ページコンポーネント
function SalesHistoryDeleteConfirmPage() {
    return (
    <main className="main">
      {/* メインコンテンツのページ見出し */}
      <div className="page-heading">
        <h2>売上履歴削除確認</h2>
        <p>売上履歴を削除します。よろしいですか？</p>
      </div>
    </main>
  )
}

// 他のファイルからSalesHistoryDeleteConfirmPageを使用できるようにする
export default SalesHistoryDeleteConfirmPage