import { API_LOGIN } from '../../settings'
import { API } from '../../../ApiSPA'
import { IFullAccount } from '../../../../stores/accounts'
interface ILocalPayload {
  username: string
  password: string
}
export const signIn = async (payload: ILocalPayload): Promise<any> => {
  const endpoint = { ...API_LOGIN.signin }
  const response = await API.apiQuery<IFullAccount>({
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
