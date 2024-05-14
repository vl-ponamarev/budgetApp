// import { apiQuery } from './apiQuery';
// import { PAYLOAD_DEFAULT_GET } from '../../../api/const';

// import { IApiReturn, ISchemeMethod } from '../types';
// import { jsonParseAsObject } from '../../../utils/common';

// interface IApiGetAsArrayProps {
//   endpoint: ISchemeMethod;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   payload?: any;
//   forceMockData?: boolean;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   mockData?: any[];
// }

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const apiGetAsArray = async <T extends any[]>({
//   endpoint,
//   payload = {
//     ...PAYLOAD_DEFAULT_GET,
//   },
//   forceMockData = false,
//   mockData = [],
// }: IApiGetAsArrayProps): Promise<IApiReturn<T>> => {
//   if (forceMockData) {
//     return {
//       success: true,
//       data: mockData,
//     } as IApiReturn<T>;
//   } else {
//     const query_params: string[] = [];

//     const { filters = {}, sorting = [], ...restPayload } = payload;

//     Object.keys(restPayload).map((key) => {
//       query_params.push(`${key}=${restPayload[key]}`);
//     });

//     Object.entries(filters).map(([key, value]) => {
//       query_params.push(`filter[${key}]=${Array.isArray(value) ? value.join(',') : value}`);
//     });

//     if (sorting.length > 0) {
//       query_params.push(`sort=${Array.isArray(sorting) ? sorting.join(',') : sorting}`);
//     }

//     if (query_params.length > 0) {
//       endpoint.url += `?${query_params.join('&')}`;
//     }

//     const response = await apiQuery<T>({
//       method: endpoint.method,
//       url: endpoint.url,
//     });
//     const dataArr = Array.isArray(response?.data) ? response?.data : [];
//     const dataOutput = dataArr.map((item) => {
//       if (item?.params && typeof item?.params == 'string') {
//         return { ...item, params: jsonParseAsObject(item.params) };
//       }

//       return item;
//     });

//     return { ...response, data: dataOutput };
//   }
// };
