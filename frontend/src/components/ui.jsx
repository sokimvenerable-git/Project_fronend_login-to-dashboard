import { STATUS } from '../utils/format.js'

export function StatCard({ icon: Icon, title, value, hint }) {
  return (
    <div className="card stat">
      <div className="stat-top"><span>{title}</span><div className="stat-ic"><Icon size={18} /></div></div>
      <div className="stat-n">{value}</div>
      <div className="stat-h">{hint}</div>
    </div>
  )
}

export function StatusBadge({ status }) {
  const s = STATUS[status] || { label: status, color: '#999999' }
  return <span className="tag" style={{ color: s.color, background: s.color + '22' }}>{s.label}</span>
}

export const ChartTip = { contentStyle: { background: '#1c1829', border: '1px solid #2a2540', borderRadius: 10, color: '#f1eefc', fontFamily: 'inherit' } }
