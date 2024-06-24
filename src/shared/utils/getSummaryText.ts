import { addSpacesToNumber } from './addSpacesToNumber'

export const getSummaryText = (incomes: number, costs: number) => {
  const incomesCostsDifference = incomes - costs

  if (incomesCostsDifference > 0) {
    return `Доходы превышают расходы на ${addSpacesToNumber(
      Math.abs(incomesCostsDifference),
    )} ₽`
  }
  return `Расходы превышают доходы на ${addSpacesToNumber(
    Math.abs(incomesCostsDifference),
  )} ₽`
}
