//React Routerの画面遷移機能をインポート
import { useNavigate, useLocation } from 'react-router-dom'

// トップページコンポーネント
function HomePage() {
  // 画面遷移を行うための関数を取得
  const navigate = useNavigate()
  // 現在のURL情報を取得
  const location = useLocation()

  // ログインページへの遷移ボタンを表示するかどうかを判定
  const showLoginButton = location.pathname === '/'

  return (
    <main className="main">
      {/* メインコンテンツのページ見出し */}
      <div className="page-heading">
        <h2>トップページ</h2>
        <p>トップページです。</p>
        {/* ログインページへの遷移ボタン */}
        {showLoginButton && (
          <button
            type="button"
            onClick={() => navigate('/login')}
          >
            ログイン
          </button>
        )}
      </div>
    </main>
  )
}

// 他のファイルからHomePageを使用できるようにする
export default HomePage