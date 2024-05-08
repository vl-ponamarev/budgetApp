import { ROUTES } from '../../config/paths'
import { IApiEntityScheme } from '../ApiSPA'
export const API_BUDGET_ENDPOINTS = [
  'getData',
  'updateData',
  'getMonthData',
] as const

type IEndpoint = (typeof API_BUDGET_ENDPOINTS)[number]

export const API_BUDGET: IApiEntityScheme<IEndpoint> = {
  getData: {
    method: 'POST',
    url: `${import.meta.env.VITE_BASE_URL}${ROUTES.BUDGET_DATA}`,
  },
  updateData: {
    method: 'PATCH',
    url: `${import.meta.env.VITE_BASE_URL}`,
  },
  getMonthData: {
    method: 'GET',
    url: `${import.meta.env.VITE_BASE_URL}`,
  },
}
