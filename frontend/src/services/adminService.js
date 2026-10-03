import api from './api.js'

const adminService = {
  getStats: () => api.get('/admin/stats.php'),
  getReports: () => api.get('/admin/reports.php'),

  getUsers: () => api.get('/admin/users.php'),
  createUser: (d) => api.post('/admin/users.php', d),
  updateUser: (id, d) => api.put(`/admin/users.php?id=${id}`, d),
  deleteUser: (id) => api.delete(`/admin/users.php?id=${id}`),

  getProducts: () => api.get('/admin/products.php'),
  createProduct: (d) => api.post('/admin/products.php', d),
  updateProduct: (id, d) => api.put(`/admin/products.php?id=${id}`, d),
  deleteProduct: (id) => api.delete(`/admin/products.php?id=${id}`),

  getOrders: () => api.get('/admin/orders.php'),
  createOrder: (d) => api.post('/admin/orders.php', d),
  updateOrderStatus: (id, status) => api.put(`/admin/orders.php?id=${id}`, { status }),
  deleteOrder: (id) => api.delete(`/admin/orders.php?id=${id}`),

  updateProfile: (d) => api.put('/admin/profile.php', d),
  changePassword: (d) => api.put('/admin/password.php', d),
}

export default adminService
