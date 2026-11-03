// ログインページのスタイルをインポート
import './LoginPage.css'

// 入力値を管理するuseStateをインポート
import { useState } from 'react'

// React RouterのuseNavigateフックをインポート
import { useNavigate } from 'react-router-dom'


// ログインページのコンポーネントを定義する
function LoginPage({ onLogin }: { onLogin: () => void }) {
  // 画面遷移を行うための関数を取得
  const navigate = useNavigate()

  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()

  const response = await fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: Number(userId),
      password: password,
    }),
  })

    // レスポンスのJSONデータを取得
    const data = await response.json()

      if (data.user?.message === 'ログイン成功') {
        // ログイン成功時,ログイン状態保存し、Homeページに遷移
        sessionStorage.setItem('isLoggedIn', 'true')
        // 親コンポーネントにログイン成功を通知
        onLogin()
        navigate('/Home')
      } else {
      console.log('ログイン失敗')
      }
          }

  return (
    <main className="login-page">
        
        {/* ログインフォーム */}
        <form className="login-form" onSubmit={handleSubmit}>
            {/* ログイン画面の見出し */}
                <div className="login-heading">
                <h2>ログイン</h2>
                <p>商品・在庫管理システム</p>
                </div>

        {/* ユーザーID入力 */}
        <div className="form-group">
            <label htmlFor="user_id">ユーザーID</label>
            <input
            type="text"
            id="user_id"
            placeholder="ユーザーIDを入力"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            />
        </div>

        {/* パスワード入力 */}
        <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
            type="password"
            id="password"
            placeholder="パスワードを入力"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            />
        </div>

        {/* ログイン */}
        <div className="form-group">
            <button type="submit">ログイン</button>
        </div>

        </form>
    </main>
  )
}

// 他のファイルからLoginPageを使用できるようにする
export default LoginPage