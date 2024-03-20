import { API_BUDGET } from '../../settings'
import { API } from '../../../ApiSPA'
import { IFullAccount } from '../../../../stores/accounts'
interface ILocalPayload {
  username: string
  password: string
}
export const createBudgetData = async (
  payload: ILocalPayload,
  month: string,
): Promise<any> => {
  const endpoint = { ...API_BUDGET.createData }
  const response = await API.apiQuery<IFullAccount>({
    method: endpoint.method,
    url: `${endpoint.url}data/${month}/data`,
    data: payload,
  })

  console.log(response)
  return {
    ...response,
    success: response?.success ?? false,
    data: response.data,
    error: response?.errors,
  }
}
