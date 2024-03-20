import { API_LOGIN } from '../../settings'
import { API } from '../../../ApiSPA'
import { IFullAccount } from '../../../../stores/accounts'
interface ILocalPayload {
  username: string
  password: string
  data?: { token: string; user: { login: string; id: number; email: string } }
}
export const login = async (payload: ILocalPayload): Promise<any> => {
  const endpoint = { ...API_LOGIN.login }
  const response = await API.apiQuery<IFullAccount>({
    method: endpoint.method,
    url: endpoint.url,
    data: payload,
  })

  return {
    ...response,
    success: response?.success ?? false,
    data: response.data,
    error: response?.errors,
  }
}
