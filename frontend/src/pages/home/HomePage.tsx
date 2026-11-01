// トップページコンポーネント
function HomePage() {
  return (
    <main className="main">
      {/* メインコンテンツのページ見出し */}
      <div className="page-heading">
        <h2>トップページ</h2>
        <p>トップページです。</p>
      </div>
    </main>
  )
}

// 他のファイルからHomePageを使用できるようにする
export default HomePage