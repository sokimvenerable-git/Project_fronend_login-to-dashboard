import { X } from 'lucide-react'

export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="បិទ"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}
