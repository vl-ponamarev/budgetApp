import { API_BUDGET } from '../../settings'
import { API } from '../../../ApiSPA'
import { IFullAccount } from '../../../../stores/accounts'
interface ILocalPayload {
  username: string
  password: string
}
export const updateBudgetData = async (
  payload: ILocalPayload,
  month: string,
): Promise<any> => {
  const endpoint = { ...API_BUDGET.updateData }
  const response = await API.apiQuery<IFullAccount>({
    method: endpoint.method,
    url: `${endpoint.url}data/${month}`,
    data: payload,
  })

  return {
    ...response,
    success: response?.success ?? false,
    data: response.data,
    error: response?.errors,
  }
}
