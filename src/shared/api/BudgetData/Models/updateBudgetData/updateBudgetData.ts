// import { API_BUDGET } from '../../settings'
// import { API } from '../../../ApiSPA'
import { IUserBudgetData } from '../../../../../shared/stores/budget'

// export const updateBudgetData = async (
//   data: IUserBudgetData,
//   month: number,
//   userId: number,
// ): Promise<any> => {
//   const endpoint = { ...API_BUDGET.updateData }
//   const response = await API.apiQuery<any>({
//     method: endpoint.method,
//     url: `${endpoint.url}data/${month}/users_data/${userId}`,
//     data: data,
//   })

//   console.log(response)

//   return {
//     ...response,
//     success: response?.success ?? false,
//     data: response.data,
//     error: response?.errors,
//   }
// }

import { axios } from '../../../ApiSPA'
import { API_BUDGET } from '../../settings'

export const updateBudgetData = async (
  data: IUserBudgetData,
  month: number,
  userId: number,
): Promise<any> => {
  const endpoint = { ...API_BUDGET.updateData }
  const response = await axios.patch(
    `${endpoint.url}data/${month}/users_data/${userId}`,
    {
      ...data,
    },
  )

  return {
    ...response,
  }
}
