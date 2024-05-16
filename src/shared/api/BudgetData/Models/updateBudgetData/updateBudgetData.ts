// import { axios } from '../../../ApiSPA'
// import { API_BUDGET } from '../../settings'

// interface ILocalPayload {
//   username: string
//   password: string
// }
// export const updateBudgetData = async (
//   payload: ILocalPayload,
//   id: number,
// ): Promise<any> => {
//   const endpoint = { ...API_BUDGET.updateData }
//   const response = await axios.patch(`${endpoint.url}data/${id}`, {
//     ...payload,
//   })

//   return {
//     ...response,
//   }
// }

import { IUserBudgetData } from 'shared/stores/budget'
import { API } from '../../../ApiSPA'
import { API_BUDGET } from '../../settings'

export const updateBudgetData = async (
  data: IUserBudgetData,
  month: number,
  userId: number,
): Promise<any> => {
  const endpoint = { ...API_BUDGET.createData }
  console.log(data)
  console.log(month)

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
