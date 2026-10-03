import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { BarChart2 } from 'lucide-react'
import authService from '../services/authService.js'
import { errMsg } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/admin" replace />
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'register') await authService.register(f)
      const { data } = await authService.login(f.email, f.password)
      login(data.user, data.token)
      navigate('/admin')
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth">
      <form className="auth-box" onSubmit={submit}>
        <h1 className="muted">សូមស្វាគមន៍ </h1>
        <div className="brand"><BarChart2 size={24} /> <span>សូមចូលប្រើប្រាស់<b>ប្រព័ន្ធគ្រប់គ្រង</b></span></div>
        
        <div className="tabs">
          <button type="button" className={mode === 'login' ? 'on' : ''} onClick={() => setMode('login')}>ចូលគណនី</button>
          <button type="button" className={mode === 'register' ? 'on' : ''} onClick={() => setMode('register')}>ចុះឈ្មោះ</button>
        </div>
        {mode === 'register' && (<><label>ឈ្មោះ</label><input value={f.name} onChange={set('name')} placeholder="ឈ្មោះរបស់អ្នក" required /></>)}
        <label>អ៊ីមែល</label>
        <input type="email" value={f.email} onChange={set('email')} placeholder="admin@example.com" required />
        <label>ពាក្យសម្ងាត់</label>
        <input type="password" value={f.password} onChange={set('password')} placeholder="••••••••" minLength={mode === 'register' ? 6 : undefined} required />
        {error && <div className="err">{error}</div>}
        <button className="btn full" disabled={busy}>{busy ? 'សូមរង់ចាំ...' : mode === 'login' ? 'ចូលគណនី' : 'បង្កើតគណនី'}</button>
        <p className="muted small">គណនីសាកល្បង៖ admin@example.com / password</p>
      </form>
    </div>
  )
}
