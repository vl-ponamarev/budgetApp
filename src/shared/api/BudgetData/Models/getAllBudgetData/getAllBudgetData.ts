import { API_BUDGET } from '../../settings'
import { API } from '../../../ApiSPA'
import { IFullAccount } from '../../../../stores/accounts'

export const getAllBudgetData = async (): Promise<any> => {
  const endpoint = { ...API_BUDGET.getMonthData }
  const response = await API.apiQuery<IFullAccount>({
    method: endpoint.method,
    url: `${endpoint.url}data`,
  })

  return {
    ...response,
    success: response?.success ?? false,
    data: response.data,
    error: response?.errors,
  }
}
