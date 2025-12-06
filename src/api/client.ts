import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api/v1'

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor - добавляем токен
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor - обработка ошибок и refresh token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Если 401 и это не запрос на refresh - пробуем обновить токен
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const refreshToken = localStorage.getItem('refresh_token')
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refresh_token: refreshToken,
                    })

                    const { access_token, refresh_token } = response.data
                    localStorage.setItem('access_token', access_token)
                    localStorage.setItem('refresh_token', refresh_token)

                    originalRequest.headers.Authorization = `Bearer ${access_token}`
                    return apiClient(originalRequest)
                } catch (refreshError) {
                    // Refresh не удался - очищаем токены
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('refresh_token')
                    localStorage.removeItem('user')
                    window.location.href = '/login'
                    return Promise.reject(refreshError)
                }
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient