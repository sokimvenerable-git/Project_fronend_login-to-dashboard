export const money = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const fdate = (s) => (s ? String(s).slice(0, 10) : '')

export const STATUS = {
  pending: { label: 'កំពុងរង់ចាំ', color: '#facc15' },
  processing: { label: 'កំពុងដំណើរការ', color: '#60a5fa' },
  completed: { label: 'បានបញ្ចប់', color: '#84cc16' },
  cancelled: { label: 'បានលុបចោល', color: '#f87171' },
}
