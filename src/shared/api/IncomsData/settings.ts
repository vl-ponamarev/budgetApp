import { IApiEntityScheme } from '../ApiSPA'
export const API_INCOMES_ENDPOINTS = ['createUpdateIncomesData'] as const

type IEndpoint = (typeof API_INCOMES_ENDPOINTS)[number]

export const API_INCOMES: IApiEntityScheme<IEndpoint> = {
  createUpdateIncomesData: {
    method: 'PATCH',
    url: `${import.meta.env.VITE_BASE_URL}`,
  },
}
