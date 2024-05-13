import axios from 'axios'
import { ROUTES } from '../../../config/paths'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
})

instance.interceptors.request.use((config) => {
  if (!config?.headers) {
    throw new Error(
      "Expected 'config' and 'config.headers' not to be undefined",
    )
  }
  config.headers = config.headers || {}
  config.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`

  return config
})

instance.interceptors.response.use(
  (config) => {
    return config
  },
  async (error) => {
    console.log(error)

    const originalRequest = error.config

    if (
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}${ROUTES.REFRESH}`,
          {
            withCredentials: true,
          },
        )

        localStorage.setItem('token', response.data.accessToken)
        return instance.request(originalRequest)
      } catch (err: unknown) {
        console.error('Не авторизован', err)
      }
    }
    return error.response
  },
)

export default instance
