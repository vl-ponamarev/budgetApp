import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { IAuthStore, authStore } from '../auth/index'
import { Modal } from 'antd'
import { login } from '../../api/Login/Models/login'
import { signIn } from '../../api/Login/Models/sign-in'

export interface IFullAccount {
  token: string
  username: string
}

export interface IAccountStore {
  store: {
    data: IFullAccount
    state: string
    error: string | undefined
  }
  localeName: string
  setData: (value: IAccountStore['store']['data']) => void
  setError: (error?: string) => void
  login: (username: string, password: string) => void
  signIn: (username: string, password: string) => void
  logout: () => void
}
export const useAccountStore = create<IAccountStore>()(
  devtools(
    immer(
      persist(
        (set, get) => ({
          store: {
            data: {
              token: '',
              username: '',
            },
            state: '',
            error: '',
          },
          localeName: 'Данные пользователя',
          setData: (value) => {
            set((state) => {
              state.store.data = value
            })
          },
          setError: (error) => {
            set((state) => {
              state.store.error = error
            })
          },
          login: async (username, password) => {
            const response = await login({
              username,
              password,
            })
            if (response?.success && response?.code === 200) {
              if (response?.data !== undefined) {
                const { username, accessToken, id } = response.data
                localStorage.setItem('token', accessToken)
                localStorage.setItem('username', username)
                localStorage.setItem('id', id)
                get().setData(response.data)
                set((state) => ({
                  ...state,
                  isAuth: true,
                  token: response.data.accessToken,
                }))
                authStore.setState((state: IAuthStore) => ({
                  ...state,
                  isAuth: true,
                }))
              } else {
                get().setError('Нет данных')
              }
            } else {
              set((state) => ({
                ...state,
                isAuth: false,
                token: '',
              }))
              localStorage.removeItem('token')
              get().setError('Ошибка авторизации')
              Modal.error({
                title: 'Ошибка авторизации',
                // content: `${error}`,
              })
            }
          },
          signIn: async (username, password) => {
            const response = await signIn({
              username,
              password,
            })
            if (
              (response?.success && response?.code === 200) ||
              (response?.success && response?.code === 201)
            ) {
              if (response?.data !== undefined) {
                const { username, accessToken, id } = response.data
                localStorage.setItem('token', accessToken)
                localStorage.setItem('id', id)
                localStorage.setItem('username', username)
                get().setData(response.data)
                set((state) => ({
                  ...state,
                  isAuth: true,
                  token: response.data.accessToken,
                }))
                authStore.setState((state: IAuthStore) => ({
                  ...state,
                  isAuth: true,
                }))
              } else {
                get().setError('Нет данных')
              }
            } else {
              set((state) => ({
                ...state,
                isAuth: false,
                token: '',
              }))
              localStorage.removeItem('token')
              get().setError('Ошибка авторизации')
              Modal.error({
                title: 'Ошибка авторизации',
                // content: `${error}`,
              })
            }
          },
          logout: () => {
            authStore.setState((state: IAuthStore) => ({
              ...state,
              isAuth: false,
            }))
            localStorage.removeItem('token')
            localStorage.removeItem('username')
          },
        }),
        { name: 'accountStore' },
      ),
    ),
  ),
)

if (localStorage.getItem('refreshToken')) {
  authStore.setState((state: IAuthStore) => ({
    ...state,
    isAuth: true,
  }))
}

export const selectAccount = (state: IAccountStore) => state.store.data
export const selectLogout = (state: IAccountStore) => state.logout
