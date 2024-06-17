import { API } from '../../../ApiSPA'
import { API_BUDGET } from '../../settings'

interface ILocalPayload {
  month: number
  userId: number
}

export const getUserBudgetData = async (data: ILocalPayload): Promise<any> => {
  const endpoint = { ...API_BUDGET.getData }
  const response = await API.apiQuery<any>({
    method: endpoint.method,
    url: `${endpoint.url}${data.month}/users_data/${data.userId}`,
  })

  return {
    ...response,
    success: response?.success ?? false,
    data: response.data,
    error: response?.errors,
  }
}
