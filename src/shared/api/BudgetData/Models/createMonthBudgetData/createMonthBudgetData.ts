import { axios } from '../../../ApiSPA'
import { API_BUDGET } from '../../settings'

interface ILocalPayload {
  username: string
  password: string
}
export const createMonthBudgetData = async (
  payload: ILocalPayload,
): Promise<any> => {
  const endpoint = { ...API_BUDGET.updateData }
  const response = await axios.post(`${endpoint.url}data`, {
    ...payload,
  })

  return {
    ...response,
  }
}
