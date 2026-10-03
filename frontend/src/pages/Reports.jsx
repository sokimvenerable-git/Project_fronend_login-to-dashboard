import { useEffect, useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react'
import adminService from '../services/adminService.js'
import { errMsg } from '../services/api.js'
import { money, STATUS } from '../utils/format.js'
import { StatCard, ChartTip } from '../components/ui.jsx'

export default function Reports() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { adminService.getReports().then((r) => setData(r.data)).catch((e) => setError(errMsg(e))) }, [])

  if (error) return <div className="err">{error}</div>
  if (!data) return <div className="muted">កំពុងផ្ទុកទិន្នន័យ...</div>

  const pie = (data.status_breakdown || []).map((s) => ({ name: STATUS[s.status]?.label || s.status, value: s.count, color: STATUS[s.status]?.color || '#999' }))
  const maxTop = Math.max(1, ...(data.top_customers || []).map((c) => c.total))

  return (
    <>
      <div className="grid g3">
        <StatCard icon={DollarSign} title="ចំណូលសរុប (Total Revenue)" value={money(data.summary.total_revenue)} hint="មិនរាប់ការលុបចោល" />
        <StatCard icon={ShoppingCart} title="ការបញ្ជាទិញសរុប (Total Orders)" value={data.summary.total_orders} hint="ការបញ្ជាទិញទាំងអស់" />
        <StatCard icon={TrendingUp} title="តម្លៃមធ្យម (Avg. Order Value)" value={money(data.summary.avg_order_value)} hint="ក្នុងមួយការបញ្ជាទិញ" />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>និន្នាការចំណូល ១៤ ថ្ងៃចុងក្រោយ</h3>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data.sales_trend}>
            <defs><linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a78bfa" stopOpacity={0.7} /><stop offset="100%" stopColor="#a78bfa" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid stroke="#2a2540" vertical={false} />
            <XAxis dataKey="date" stroke="#8f89a8" fontSize={11} />
            <YAxis stroke="#8f89a8" fontSize={11} />
            <Tooltip {...ChartTip} formatter={(v) => money(v)} />
            <Area type="monotone" dataKey="total" stroke="#a78bfa" fill="url(#rev2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid g2" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>ចំណូលប្រចាំខែ (៦ ខែ)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.monthly}>
              <CartesianGrid stroke="#2a2540" vertical={false} />
              <XAxis dataKey="month" stroke="#8f89a8" fontSize={11} />
              <YAxis stroke="#8f89a8" fontSize={11} />
              <Tooltip {...ChartTip} formatter={(v) => money(v)} />
              <Bar dataKey="total" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
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
        <h3>អតិថិជនកំពូល</h3>
        {(data.top_customers || []).map((c) => (
          <div key={c.customer}>
            <div className="row-between"><span>{c.customer} <span className="muted">({c.orders} ការបញ្ជាទិញ)</span></span><b>{money(c.total)}</b></div>
            <div className="bar"><div style={{ width: `${(c.total / maxTop) * 100}%` }} /></div>
          </div>
        ))}
        {(!data.top_customers || data.top_customers.length === 0) && <div className="muted">មិនទាន់មានទិន្នន័យ</div>}
      </div>
    </>
  )
}
