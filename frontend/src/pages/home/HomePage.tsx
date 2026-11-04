//React Routerの画面遷移機能をインポート
import { useNavigate, useLocation } from 'react-router-dom'

// トップページコンポーネント、ログイン状態を管理するisLoggedInプロパティを受け取る
function HomePage({ isLoggedIn }: { isLoggedIn: boolean }) {
  // 画面遷移を行うための関数を取得
  const navigate = useNavigate()
  // 現在のURL情報を取得
  const location = useLocation()

  // ログイン状態がfalse、かつ現在のURLが'/'の場合にログインボタンを表示する
  const showLoginButton = location.pathname === '/' && !isLoggedIn

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