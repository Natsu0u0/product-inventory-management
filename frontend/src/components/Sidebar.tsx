
import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <p className="menu-title">メニュー</p>

      <nav>
        <NavLink to="/registration">各種登録</NavLink>
        <NavLink to="/inventory">在庫管理</NavLink>
        <NavLink to="/purchase/history">仕入履歴</NavLink>
        <NavLink to="/sales/history">販売履歴</NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
