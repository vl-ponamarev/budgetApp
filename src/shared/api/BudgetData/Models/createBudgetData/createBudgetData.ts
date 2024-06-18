import { IUserBudgetData } from 'shared/stores/budget'
import { API } from '../../../ApiSPA'
import { API_BUDGET } from '../../settings'

export const createBudgetData = async (
  data: IUserBudgetData,
  month: string,
  userId: number,
): Promise<any> => {
  const endpoint = { ...API_BUDGET.createData }
  const response = await API.apiQuery<any>({
    method: endpoint.method,
    url: `${endpoint.url}data/${month}/users_data/${userId}`,
    data: data,
  })

  return {
    ...response,
    success: response?.success ?? false,
    data: response.data,
    error: response?.errors,
  }
}
