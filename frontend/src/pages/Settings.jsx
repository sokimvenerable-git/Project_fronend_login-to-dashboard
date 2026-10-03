import { useState } from 'react'
import adminService from '../services/adminService.js'
import { errMsg } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Settings() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' })
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })

  const [pw, setPw] = useState({ current_password: '', new_password: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })

  const saveProfile = async (e) => {
    e.preventDefault()
    setProfileMsg({ type: '', text: '' })
    if (!profile.name.trim() || !profile.email.trim()) return setProfileMsg({ type: 'err', text: 'សូមបញ្ចូលឈ្មោះ និងអ៊ីមែល' })
    try {
      const { data } = await adminService.updateProfile(profile)
      updateUser(data.user)
      setProfileMsg({ type: 'ok', text: '✔ បានរក្សាទុកដោយជោគជ័យ' })
    } catch (err) { setProfileMsg({ type: 'err', text: errMsg(err) }) }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    setPwMsg({ type: '', text: '' })
    if (pw.new_password.length < 6) return setPwMsg({ type: 'err', text: 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៦ តួអក្សរ' })
    if (pw.new_password !== pw.confirm) return setPwMsg({ type: 'err', text: 'ពាក្យសម្ងាត់បញ្ជាក់មិនត្រូវគ្នា' })
    try {
      await adminService.changePassword({ current_password: pw.current_password, new_password: pw.new_password })
      setPw({ current_password: '', new_password: '', confirm: '' })
      setPwMsg({ type: 'ok', text: '✔ បានប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ' })
    } catch (err) { setPwMsg({ type: 'err', text: errMsg(err) }) }
  }

  return (
    <div className="grid g2">
      <form className="card" onSubmit={saveProfile}>
        <h3>ព័ត៌មានគណនី</h3>
        <label>ឈ្មោះ</label>
        <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        <label>អ៊ីមែល</label>
        <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
        {profileMsg.text && <div className={profileMsg.type === 'ok' ? 'ok' : 'err'}>{profileMsg.text}</div>}
        <button className="btn" style={{ marginTop: 14 }}>រក្សាទុក</button>
      </form>

      <form className="card" onSubmit={savePassword}>
        <h3>ប្តូរពាក្យសម្ងាត់</h3>
        <label>ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
        <input type="password" value={pw.current_password} onChange={(e) => setPw({ ...pw, current_password: e.target.value })} />
        <label>ពាក្យសម្ងាត់ថ្មី</label>
        <input type="password" value={pw.new_password} onChange={(e) => setPw({ ...pw, new_password: e.target.value })} />
        <label>បញ្ជាក់ពាក្យសម្ងាត់ថ្មី</label>
        <input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
        {pwMsg.text && <div className={pwMsg.type === 'ok' ? 'ok' : 'err'}>{pwMsg.text}</div>}
        <button className="btn" style={{ marginTop: 14 }}>ប្តូរពាក្យសម្ងាត់</button>
      </form>
    </div>
  )
}
