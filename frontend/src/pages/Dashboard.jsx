import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { DollarSign, ShoppingCart, Package, Users as UsersIcon } from 'lucide-react'
import adminService from '../services/adminService.js'
import { errMsg } from '../services/api.js'
import { money, fdate, STATUS } from '../utils/format.js'
import { StatCard, StatusBadge, ChartTip } from '../components/ui.jsx'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [reports, setReports] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([adminService.getStats(), adminService.getReports()])
      .then(([s, r]) => { setStats(s.data); setReports(r.data) })
      .catch((e) => setError(errMsg(e)))
  }, [])

  if (error) return <div className="err">{error}</div>
  if (!stats) return <div className="muted">កំពុងផ្ទុកទិន្នន័យ...</div>

  const pie = (reports?.status_breakdown || []).map((s) => ({ name: STATUS[s.status]?.label || s.status, value: s.count, color: STATUS[s.status]?.color || '#999' }))

  return (
    <>
      <div className="grid g4">
        <StatCard icon={DollarSign} title="ចំណូលសរុប" value={money(stats.total_sales)} hint="មិនរាប់ការលុបចោល" />
        <StatCard icon={ShoppingCart} title="ការបញ្ជាទិញ" value={stats.total_orders} hint="ការបញ្ជាទិញទាំងអស់" />
        <StatCard icon={Package} title="ផលិតផល" value={stats.total_products} hint="ក្នុងស្តុក" />
        <StatCard icon={UsersIcon} title="អ្នកប្រើប្រាស់" value={stats.total_users} hint="គណនីសរុប" />
      </div>

      <div className="grid g2" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>ចំណូល ១៤ ថ្ងៃចុងក្រោយ</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={reports?.sales_trend || []}>
              <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a78bfa" stopOpacity={0.7} /><stop offset="100%" stopColor="#a78bfa" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="#2a2540" vertical={false} />
              <XAxis dataKey="date" stroke="#8f89a8" fontSize={11} />
              <YAxis stroke="#8f89a8" fontSize={11} />
              <Tooltip {...ChartTip} formatter={(v) => money(v)} />
              <Area type="monotone" dataKey="total" stroke="#a78bfa" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3>ស្ថានភាពការបញ្ជាទិញ</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {pie.map((p, i) => <Cell key={i} fill={p.color} />)}
              </Pie>
              <Tooltip {...ChartTip} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#8f89a8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>ការបញ្ជាទិញថ្មីៗ</h3>
        <div className="wrap">
          <table>
            <thead><tr><th>ល.រ</th><th>អតិថិជន</th><th>សរុប</th><th>ស្ថានភាព</th><th>កាលបរិច្ឆេទ</th></tr></thead>
            <tbody>
              {stats.recent_orders.map((o) => (
                <tr key={o.id}><td>#{o.id}</td><td>{o.customer_name}</td><td>{money(o.total)}</td><td><StatusBadge status={o.status} /></td><td>{fdate(o.created_at)}</td></tr>
              ))}
              {stats.recent_orders.length === 0 && <tr><td colSpan={5} className="muted">មិនទាន់មានទិន្នន័យ</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
