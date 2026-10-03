import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import adminService from '../services/adminService.js'
import { errMsg } from '../services/api.js'
import Modal from '../components/Modal.jsx'

const EMPTY = {
  name: '',
  email: '',
  password: '',
  role: 'user'
}

export default function Users() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [formErr, setFormErr] = useState('')

  const load = async () => {
    try {
      setError('')
      const res = await adminService.getUsers()
      setRows(res.data || [])
    } catch (e) {
      setError(errMsg(e))
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openNew = () => {
    setEditing(null)
    setForm(EMPTY)
    setFormErr('')
    setOpen(true)
  }

  const openEdit = (user) => {
    setEditing(user)

    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'user'
    })

    setFormErr('')
    setOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      return setFormErr('សូមបញ្ចូលឈ្មោះ')
    }

    if (!form.email.trim()) {
      return setFormErr('សូមបញ្ចូល Email')
    }

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role
      }

      if (form.password) {
        payload.password = form.password
      }

      if (editing) {
        await adminService.updateUser(editing.id, payload)
      } else {
        if (!form.password) {
          return setFormErr('សូមបញ្ចូល Password')
        }

        payload.password = form.password

        await adminService.createUser(payload)
      }

      setOpen(false)
      load()
    } catch (e) {
      setFormErr(errMsg(e))
    }
  }

  const remove = async (user) => {
    if (!confirm(`លុប User "${user.name}"?`)) return

    try {
      await adminService.deleteUser(user.id)
      load()
    } catch (e) {
      setError(errMsg(e))
    }
  }

  return (
    <div className="card">

      <div className="card-head">
        <h3>គ្រប់គ្រងអ្នកប្រើប្រាស់</h3>

        <button className="btn" onClick={openNew}>
          <Plus size={16} />
          បន្ថែម User
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
              <th>Email</th>
              <th>Role</th>
              <th>សកម្មភាព</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>

                <td className="actions">

                  <button
                    className="icon-btn"
                    onClick={() => openEdit(user)}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    className="icon-btn danger"
                    onClick={() => remove(user)}
                  >
                    <Trash2 size={15} />
                  </button>

                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  មិនទាន់មាន User
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal
          title={editing ? 'កែប្រែ User' : 'បន្ថែម User'}
          onClose={() => setOpen(false)}
        >

          <form onSubmit={submit}>

            <label>ឈ្មោះ</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
            />

            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
            />

            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
              placeholder={
                editing
                  ? 'ទុកទទេ បើមិនចង់ប្ដូរ'
                  : 'Password'
              }
            />

            <label>Role</label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value
                })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {formErr && (
              <div className="err">
                {formErr}
              </div>
            )}

            <button
              className="btn full"
              style={{ marginTop: 14 }}
            >
              {editing
                ? 'រក្សាទុកការកែប្រែ'
                : 'បន្ថែម User'}
            </button>

          </form>

        </Modal>
      )}

    </div>
  )
}