import { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import axiosInstance from '../axios/axios'
import { IApiReturn, libConfig } from '../index'

import { SuccessResponse, ErrorResponse, applyLibConfig } from '../utils'

interface IApiQueryProps {
  method: Method
  url: string
  data?: any
  page?: number
  limit?: number
  extraHeaders?: any
  debug?: boolean
  transitional?: any
  noNestedData?: boolean
}

export const apiQuery = async <T = any>({
  method,
  url,
  data,
  page,
  limit,
  extraHeaders,
  debug = false,
  transitional,
}: IApiQueryProps): Promise<IApiReturn<T | undefined>> => {
  try {
    // eslint-disable-next-line prefer-const
    let config: AxiosRequestConfig = {
      url,
      method,
      params: {
        page,
        limit,
      },
      data: data,
      transitional:
        transitional !== undefined
          ? transitional
          : {
              silentJSONParsing: true,
              forcedJSONParsing: true,
              clarifyTimeoutError: false,
            },
    }
    console.log(data)

    config = applyLibConfig(libConfig, config)

    if (extraHeaders) {
      config.headers = extraHeaders
    }

    console.log('config', config)
    const response: AxiosResponse = await axiosInstance(config)

    if (debug) {
      console.log('response config', config)
    }

    return SuccessResponse({
      data: response,
    })
  } catch (error) {
    console.log(error)

    return ErrorResponse({
      error: error,
    })
  }
}
