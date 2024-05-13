import { API_INCOMES } from '../../settings'
import { API } from '../../../ApiSPA'

export const createUpdateIncomesData = async (
  payload: any,
  username: string,
): Promise<any> => {
  const responses = []
  const endpoint = { ...API_INCOMES.createUpdateIncomesData }
  for (const item of payload) {
    const urlBase = `${endpoint.url}/${item.month}/data`
    try {
      if (item.id) {
        const url = `${urlBase}/${username}/incomes/${item.id}`
        const updateResponse = await API.apiQuery<any>({
          method: endpoint.method,
          url: url,
          data: item,
        })

        responses.push(updateResponse.data)
      } else {
        const url = `${urlBase}/${username}/incomes`
        const createResponse = await API.apiQuery<any>({
          method: endpoint.method,
          url: url,
          data: item,
        })
        responses.push(createResponse.data)
      }
    } catch (error) {
      console.error('Error creating/updating incomes:', error)
      responses.push(null)
    }
  }

  return responses
}
