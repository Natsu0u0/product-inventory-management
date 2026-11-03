// CSSファイル読み込み
import './App.css'

// React Router読み込み
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

// ReactのuseStateフックを読み込み
import { useState } from 'react'

// 共通コンポーネント読み込み
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import RequireAuth from './components/RequireAuth'

// ログインページ
import LoginPage from './pages/login/LoginPage'

// トップページ
import HomePage from './pages/home/HomePage'

// 在庫管理
import InventoryPage from './pages/inventory/InventoryPage'

// 各種登録
import RegistrationPage from './pages/registration/RegistrationPage'
import RegistrationConfirmPage from './pages/registration/RegistrationConfirmPage'
import RegistrationCompletePage from './pages/registration/RegistrationCompletePage'

// 商品管理
import ProductEditPage from './pages/products/ProductEditPage'
import ProductEditConfirmPage from './pages/products/ProductEditConfirmPage'
import ProductEditCompletePage from './pages/products/ProductEditCompletePage'
import ProductDeletePage from './pages/products/ProductDeletePage'
import ProductDeleteConfirmPage from './pages/products/ProductDeleteConfirmPage'
import ProductDeleteCompletePage from './pages/products/ProductDeleteCompletePage'

// 仕入履歴
import PurchaseHistoryPage from './pages/purchase-history/PurchaseHistoryPage'
import PurchaseHistoryEditPage from './pages/purchase-history/PurchaseHistoryEditPage'
import PurchaseHistoryEditConfirmPage from './pages/purchase-history/PurchaseHistoryEditConfirmPage'
import PurchaseHistoryEditCompletePage from './pages/purchase-history/PurchaseHistoryEditCompletePage'
import PurchaseHistoryDeletePage from './pages/purchase-history/PurchaseHistoryDeletePage'
import PurchaseHistoryDeleteConfirmPage from './pages/purchase-history/PurchaseHistoryDeleteConfirmPage'
import PurchaseHistoryDeleteCompletePage from './pages/purchase-history/PurchaseHistoryDeleteCompletePage'

// 販売履歴
import SalesHistoryPage from './pages/sales-history/SalesHistoryPage'
import SalesHistoryEditPage from './pages/sales-history/SalesHistoryEditPage'
import SalesHistoryEditConfirmPage from './pages/sales-history/SalesHistoryEditConfirmPage'
import SalesHistoryEditCompletePage from './pages/sales-history/SalesHistoryEditCompletePage'
import SalesHistoryDeletePage from './pages/sales-history/SalesHistoryDeletePage'
import SalesHistoryDeleteConfirmPage from './pages/sales-history/SalesHistoryDeleteConfirmPage'
import SalesHistoryDeleteCompletePage from './pages/sales-history/SalesHistoryDeleteCompletePage'


// アプリケーションの画面構成を定義する
function AppContent() {

  // ログイン状態をsessionStorageから取得する
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem('isLoggedIn') === 'true'
  )

  // ログアウト処理
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('user_id')

    // ログイン状態をfalseに設定
    setIsLoggedIn(false)
    navigate('/')
  }

  // 現在のURL情報を取得する
  const location = useLocation()

  // ログイン画面かどうかを判定する
  const isLoginPage = location.pathname === '/login'

  return (
    <div className={isLoginPage ? 'login-layout' : 'app'}>

      {/* ログイン画面以外ではヘッダーを表示 */}
      {!isLoginPage && (
        <Header
          // ログイン状態をHeaderに渡す
          isLoggedIn={isLoggedIn}
          // ログアウト処理をHeaderに渡す
          onLogout={handleLogout}
        />
      )}

      {/* サイドメニューとメインコンテンツ */}
      <div className={isLoginPage ? 'login-content' : 'layout'}>

        {/* ログイン画面以外ではサイドバーを表示 */}
        {!isLoginPage && <Sidebar />}

        {/* URLに応じてメインコンテンツを切り替える */}
        <Routes>

          {/* ログインページ：ログイン前でもアクセス可能 */}
          <Route
            path="/login"
            element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
          />

          {/* ログイン前のトップページ：ログイン前でもアクセス可能 */}
          <Route
            path="/"
            element={<HomePage isLoggedIn={isLoggedIn} />}
          />

          {/* ログイン必須の画面 */}
          <Route element={<RequireAuth isLoggedIn={isLoggedIn} />}>

            {/* ログイン後のトップページ */}
            <Route
              path="/Home"
              element={<HomePage isLoggedIn={isLoggedIn} />}
            />

            {/* 在庫管理 */}
            <Route
              path="/inventory"
              element={<InventoryPage />}
            />

            {/* 各種登録 */}
            <Route
              path="/registration"
              element={<RegistrationPage />}
            />
            <Route
              path="/registration/confirm"
              element={<RegistrationConfirmPage />}
            />
            <Route
              path="/registration/complete"
              element={<RegistrationCompletePage />}
            />

            {/* 商品編集 */}
            <Route
              path="/products/edit"
              element={<ProductEditPage />}
            />
            <Route
              path="/products/edit/confirm"
              element={<ProductEditConfirmPage />}
            />
            <Route
              path="/products/edit/complete"
              element={<ProductEditCompletePage />}
            />

            {/* 商品削除 */}
            <Route
              path="/products/delete"
              element={<ProductDeletePage />}
            />
            <Route
              path="/products/delete/confirm"
              element={<ProductDeleteConfirmPage />}
            />
            <Route
              path="/products/delete/complete"
              element={<ProductDeleteCompletePage />}
            />

            {/* 仕入履歴 */}
            <Route
              path="/purchase/history"
              element={<PurchaseHistoryPage />}
            />

            {/* 仕入履歴編集 */}
            <Route
              path="/purchase/history/edit/confirm"
              element={<PurchaseHistoryEditConfirmPage />}
            />
            <Route
              path="/purchase/history/edit/complete"
              element={<PurchaseHistoryEditCompletePage />}
            />
            <Route
              path="/purchase/history/edit/:purchaseId"
              element={<PurchaseHistoryEditPage />}
            />

            {/* 仕入履歴キャンセル */}
            <Route
              path="/purchase/history/delete/confirm"
              element={<PurchaseHistoryDeleteConfirmPage />}
            />
            <Route
              path="/purchase/history/delete/complete"
              element={<PurchaseHistoryDeleteCompletePage />}
            />
            <Route
              path="/purchase/history/delete/:purchaseId"
              element={<PurchaseHistoryDeletePage />}
            />

            {/* 販売履歴 */}
            <Route
              path="/sales/history"
              element={<SalesHistoryPage />}
            />

            {/* 販売履歴編集 */}
            <Route
              path="/sales/history/edit/confirm"
              element={<SalesHistoryEditConfirmPage />}
            />
            <Route
              path="/sales/history/edit/complete"
              element={<SalesHistoryEditCompletePage />}
            />
            <Route
              path="/sales/history/edit/:salesId"
              element={<SalesHistoryEditPage />}
            />

            {/* 販売履歴キャンセル */}
            <Route
              path="/sales/history/delete/confirm"
              element={<SalesHistoryDeleteConfirmPage />}
            />
            <Route
              path="/sales/history/delete/complete"
              element={<SalesHistoryDeleteCompletePage />}
            />
            <Route
              path="/sales/history/delete/:salesId"
              element={<SalesHistoryDeletePage />}
            />

          </Route>
        </Routes>

      </div>
    </div>
  )
}


// アプリケーション全体のコンポーネント
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

// 他のファイルからAppを使用できるようにする
export default App