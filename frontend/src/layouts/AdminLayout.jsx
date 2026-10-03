import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Settings, LogOut, BarChart2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const MENU = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'ផ្ទាំងគ្រប់គ្រង' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'ការបញ្ជាទិញ' },
  { to: '/admin/products', icon: Package, label: 'ផលិតផល' },
  { to: '/admin/users', icon: Users, label: 'អ្នកប្រើប្រាស់' },
  { to: '/admin/reports', icon: BarChart3, label: 'របាយការណ៍' },
  { to: '/admin/settings', icon: Settings, label: 'ការកំណត់' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const out = () => { logout(); navigate('/login') }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><BarChart2 size={22} /> <span>ផ្ទាំង<b>គ្រប់គ្រង</b></span></div>
        <nav>
          {MENU.map(({ to, end, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => 'nav' + (isActive ? ' on' : '')}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="sp" />
        <button className="nav" onClick={out}><LogOut size={18} /> ចាកចេញ</button>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="who">
            <div className="av">{(user?.name || '?')[0].toUpperCase()}</div>
            <div><div className="who-n">{user?.name}</div><small>{user?.role === 'admin' ? 'អ្នកគ្រប់គ្រង' : 'អ្នកប្រើប្រាស់'}</small></div>
          </div>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  )
}
