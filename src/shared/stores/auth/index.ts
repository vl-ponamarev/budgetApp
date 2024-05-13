import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export interface IAuthStore {
  localeName: string
  isAuth: boolean
  setAuth: (value: IAuthStore['isAuth']) => void
  token: string
  setToken: (value: IAuthStore['token']) => void
}

export const authStore = create<IAuthStore>()(
  devtools(
    persist(
      (set) => ({
        localeName: 'Данные авторизации',
        isAuth: false,
        setAuth: (value) => {
          set((state) => ({
            ...state,
            isAuth: value,
          }))
        },
        token: '',
        setToken: (value) => {
          set((state) => ({
            ...state,
            token: value,
          }))
        },
      }),
      { name: 'authStore' },
    ),
  ),
)
