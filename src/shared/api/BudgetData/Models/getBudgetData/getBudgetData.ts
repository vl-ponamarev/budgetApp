import { API } from '../../../ApiSPA'
import { API_BUDGET } from '../../settings'

interface ILocalPayload {
  username: string
  date: string
}

export const getBudgetData = async (payload: ILocalPayload): Promise<any> => {
  const endpoint = { ...API_BUDGET.getData }

  const response = await API.apiQuery<any>({
    method: endpoint.method,
    url: endpoint.url,
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
