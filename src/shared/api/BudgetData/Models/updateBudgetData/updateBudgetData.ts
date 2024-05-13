import { axios } from '../../../ApiSPA'
import { API_BUDGET } from '../../settings'

interface ILocalPayload {
  username: string
  password: string
}
export const updateBudgetData = async (
  payload: ILocalPayload,
  id: number,
): Promise<any> => {
  const endpoint = { ...API_BUDGET.updateData }
  const response = await axios.patch(`${endpoint.url}data/${id}`, {
    ...payload,
  })

  return {
    ...response,
  }
}
