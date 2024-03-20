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
  username: string,
): Promise<any> => {
  const endpoint = { ...API_BUDGET.updateData }
  const response = await API.apiQuery<IFullAccount>({
    method: endpoint.method,
    url: `${endpoint.url}data/${month}/data/${username}`,
    data: { budget_data: payload },
  })

  console.log(response)
  return {
    ...response,
    success: response?.success ?? false,
    data: response.data,
    error: response?.errors,
  }
}
