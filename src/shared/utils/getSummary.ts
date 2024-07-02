export const getSummary = (data: any[]) => {
  return data?.reduce((acc: number, item) => (acc += Number(item.amount)), 0)
}
