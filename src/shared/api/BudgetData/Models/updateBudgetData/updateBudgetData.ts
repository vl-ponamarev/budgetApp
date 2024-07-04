import { IUserBudgetData } from '../../../../../shared/stores/budget'
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
