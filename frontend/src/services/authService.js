import api from './api.js'

const authService = {
  login: (email, password) => api.post('/auth/login.php', { email, password }),
  register: (data) => api.post('/auth/register.php', data),
}

export default authService
