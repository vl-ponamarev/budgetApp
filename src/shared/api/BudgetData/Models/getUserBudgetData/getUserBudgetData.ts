import { API } from '../../../ApiSPA'
import { API_BUDGET } from '../../settings'

export interface ILocalPayload {
  month: string
  userId: number
}

// export const getUserBudgetData = async (data: ILocalPayload): Promise<any> => {
//   const endpoint = { ...API_BUDGET.getData }
//   const response = await API.apiQuery<any>({
//     method: endpoint.method,
//     url: `${endpoint.url}${data.month}/users_data/${data.userId}`,
//   })

//   return {
//     ...response,
//     success: response?.success ?? false,
//     data: response.data,
//     error: response?.errors,
//   }
// }

export const getUserBudgetData = async (
  data: ILocalPayload[],
): Promise<any[]> => {
  const promises = data.map((item) =>
    API.apiQuery<any>({
      method: API_BUDGET.getData.method,
      url: `${API_BUDGET.getData.url}${item.month}/users_data/${item.userId}`,
    }).then((response) => ({
      ...response,
      success: response?.success ?? false,
      data: response.data,
      error: response?.errors,
    })),
  )

  return Promise.all(promises)
}
