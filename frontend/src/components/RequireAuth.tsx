// ログイン状態の確認と子ルートの表示に使用する機能をインポート
import { Navigate, Outlet } from 'react-router-dom'


// RequireAuthコンポーネントが受け取るプロパティの型を定義
type RequireAuthProps = {
  isLoggedIn: boolean
}


// ログイン状態に応じて表示する画面を切り替える
function RequireAuth({ isLoggedIn }: RequireAuthProps) {
  if (!isLoggedIn) {
    // ログイン状態がfalseの場合、ログインページにリダイレクトする
    return <Navigate to="/login" replace />
  }
  // ログイン状態がtrueの場合、子ルートのコンポーネントを表示する
  return <Outlet />
}

// 他のファイルからRequireAuthを使用できるようにする
export default RequireAuth