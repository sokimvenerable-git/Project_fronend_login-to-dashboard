import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import adminService from '../services/adminService.js'
import { errMsg } from '../services/api.js'
import { money, fdate, STATUS } from '../utils/format.js'
import { StatusBadge } from '../components/ui.jsx'
import Modal from '../components/Modal.jsx'

export default function Orders() {
  const [rows, setRows] = useState([])
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [formErr, setFormErr] = useState('')
  const [f, setF] = useState({ customer_name: '', product_id: '', quantity: 1, status: 'pending' })

  const load = () => adminService.getOrders().then((r) => setRows(r.data)).catch((e) => setError(errMsg(e)))
  useEffect(() => { load(); adminService.getProducts().then((r) => setProducts(r.data)).catch(() => {}) }, [])

  const openNew = () => {
    setFormErr('')
    setF({ customer_name: '', product_id: products[0]?.id || '', quantity: 1, status: 'pending' })
    setOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    const product = products.find((p) => p.id === Number(f.product_id))
    if (!f.customer_name.trim() || !product || Number(f.quantity) < 1) return setFormErr('សូមបំពេញព័ត៌មានឲ្យគ្រប់')
    try {
      await adminService.createOrder({
        customer_name: f.customer_name.trim(),
        total: Number((product.price * Number(f.quantity)).toFixed(2)),
        status: f.status,
      })
      setOpen(false); load()
    } catch (err) { setFormErr(errMsg(err)) }
  }

  const setStatus = async (o, status) => {
    try { await adminService.updateOrderStatus(o.id, status); load() } catch (err) { setError(errMsg(err)) }
  }
  const remove = async (o) => {
    if (!confirm(`លុបការបញ្ជាទិញ #${o.id}?`)) return
    try { await adminService.deleteOrder(o.id); load() } catch (err) { setError(errMsg(err)) }
  }

  const total = products.find((p) => p.id === Number(f.product_id))
  const preview = total ? total.price * Number(f.quantity || 0) : 0

  return (
    <div className="card">
      <div className="card-head">
        <h3>បញ្ជីការបញ្ជាទិញ</h3>
        <button className="btn" onClick={openNew}><Plus size={16} /> បង្កើតការបញ្ជាទិញ</button>
      </div>
      {error && <div className="err">{error}</div>}
      <div className="wrap">
        <table>
          <thead><tr><th>ល.រ</th><th>អតិថិជន</th><th>អ្នកបញ្ជាទិញ</th><th>សរុប</th><th>ស្ថានភាព</th><th>កាលបរិច្ឆេទ</th><th>សកម្មភាព</th></tr></thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td><td>{o.customer_name}</td><td className="muted">{o.user_name || '—'}</td>
                <td>{money(o.total)}</td>
                <td>
                  <select className="mini-select" value={o.status} onChange={(e) => setStatus(o, e.target.value)}>
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </td>
                <td>{fdate(o.created_at)}</td>
                <td className="actions"><button className="icon-btn danger" onClick={() => remove(o)}><Trash2 size={15} /></button></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="muted">មិនទាន់មានការបញ្ជាទិញ</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal title="បង្កើតការបញ្ជាទិញ" onClose={() => setOpen(false)}>
          <form onSubmit={submit}>
            <label>ឈ្មោះអតិថិជន</label>
            <input value={f.customer_name} onChange={(e) => setF({ ...f, customer_name: e.target.value })} autoFocus />
            <label>ផលិតផល</label>
            <select value={f.product_id} onChange={(e) => setF({ ...f, product_id: e.target.value })}>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} — {money(p.price)}</option>)}
            </select>
            <div className="row2">
              <div><label>ចំនួន</label><input type="number" min="1" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} /></div>
              <div><label>ស្ថានភាព</label>
                <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
                  {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
            <div className="muted" style={{ margin: '10px 0' }}>សរុប៖ <b style={{ color: 'var(--tx)' }}>{money(preview)}</b></div>
            {formErr && <div className="err">{formErr}</div>}
            <button className="btn full">រក្សាទុកការបញ្ជាទិញ</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
