import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import adminService from '../services/adminService.js'
import { errMsg } from '../services/api.js'
import { money, fdate } from '../utils/format.js'
import Modal from '../components/Modal.jsx'

const EMPTY = {
  name: '',
  price: '',
  description: ''
}

export default function Products() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [f, setF] = useState(EMPTY)
  const [formErr, setFormErr] = useState('')

  const load = () => {
    adminService
      .getProducts()
      .then((r) => setRows(r.data))
      .catch((e) => setError(errMsg(e)))
  }

  useEffect(() => {
    load()
  }, [])

  const openNew = () => {
    setEditing(null)
    setF(EMPTY)
    setFormErr('')
    setOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)

    setF({
      name: p.name,
      price: p.price,
      description: p.description || ''
    })

    setFormErr('')
    setOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()

    if (
      !f.name.trim() ||
      f.price === '' ||
      Number(f.price) < 0
    ) {
      return setFormErr(
        'សូមបញ្ចូលឈ្មោះ និងតម្លៃឲ្យត្រឹមត្រូវ'
      )
    }

    try {
      const payload = {
        name: f.name.trim(),
        price: Number(f.price),
        description: f.description.trim()
      }

      if (editing) {
        await adminService.updateProduct(
          editing.id,
          payload
        )
      } else {
        await adminService.createProduct(payload)
      }

      setOpen(false)
      load()

    } catch (err) {
      setFormErr(errMsg(err))
    }
  }

  const remove = async (p) => {
    if (!confirm(`លុបផលិតផល "${p.name}"?`)) {
      return
    }

    try {
      await adminService.deleteProduct(p.id)
      load()
    } catch (err) {
      setError(errMsg(err))
    }
  }

  return (
    <div className="card">

      <div className="card-head">

        <h3>បញ្ជីផលិតផល</h3>

        <button
          className="btn"
          onClick={openNew}
        >
          <Plus size={16} />
          បន្ថែមផលិតផល
        </button>

      </div>

      {error && (
        <div className="err">
          {error}
        </div>
      )}

      <div className="wrap">

        <table>

          <thead>
            <tr>
              <th>ល.រ</th>
              <th>ឈ្មោះ</th>
              <th>តម្លៃ</th>
              <th>ពិពណ៌នា</th>
              <th>កាលបរិច្ឆេទ</th>
              <th>សកម្មភាព</th>
            </tr>
          </thead>

          <tbody>

            {rows.map((p) => (
              <tr key={p.id}>

                <td>{p.id}</td>

                <td>{p.name}</td>

                <td>
                  {money(p.price)}
                </td>

                <td
                  className="muted"
                  style={{ maxWidth: 260 }}
                >
                  {p.description}
                </td>

                <td>
                  {fdate(p.created_at)}
                </td>

                <td className="actions">

                  <button
                    className="icon-btn"
                    onClick={() => openEdit(p)}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    className="icon-btn danger"
                    onClick={() => remove(p)}
                  >
                    <Trash2 size={15} />
                  </button>

                </td>

              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="muted"
                >
                  មិនទាន់មានផលិតផល
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

      {open && (
        <Modal
          title={
            editing
              ? 'កែប្រែផលិតផល'
              : 'បន្ថែមផលិតផលថ្មី'
          }
          onClose={() => setOpen(false)}
        >

          <form onSubmit={submit}>

            <label>
              ឈ្មោះផលិតផល
            </label>

            <input
              value={f.name}
              onChange={(e) =>
                setF({
                  ...f,
                  name: e.target.value
                })
              }
              autoFocus
            />

            <label>
              តម្លៃ ($)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={f.price}
              onChange={(e) =>
                setF({
                  ...f,
                  price: e.target.value
                })
              }
            />

            <label>
              ពិពណ៌នា (Description)
            </label>

            <textarea
              rows={3}
              value={f.description}
              onChange={(e) =>
                setF({
                  ...f,
                  description: e.target.value
                })
              }
              placeholder="ពិពណ៌នាអំពីផលិតផលនេះ..."
            />

            {formErr && (
              <div className="err">
                {formErr}
              </div>
            )}

            <button
              type="submit"
              className="btn full"
              style={{ marginTop: 14 }}
            >
              {editing
                ? 'រក្សាទុកការកែប្រែ'
                : 'បន្ថែមផលិតផល'}
            </button>

          </form>

        </Modal>
      )}

    </div>
  )
}