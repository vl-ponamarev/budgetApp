import { ROUTES } from '../../config/paths'
import { IApiEntityScheme } from '../ApiSPA'
export const API_LOGIN_ENDPOINTS = ['login', 'signin'] as const

type IEndpoint = (typeof API_LOGIN_ENDPOINTS)[number]

export const API_LOGIN: IApiEntityScheme<IEndpoint> = {
  login: {
    method: 'POST',
    url: `${import.meta.env.VITE_BASE_URL}${ROUTES.LOGIN}`,
  },
  signin: {
    method: 'POST',
    url: `${import.meta.env.VITE_BASE_URL}${ROUTES.SIGN_IN}`,
  },
}
