import { apiQuery } from './apiRequests/apiQuery'
// import { apiGetAsArray } from './apiRequests/apiGetAsArray'
import axios from './axios/axios'

export const libConfig = {
  replacePatchToPost: true,
  replacePutToPost: true,
}

export const API = {
  apiQuery,
  // apiGetAsArray,
}

export * from './types'

export { axios }
