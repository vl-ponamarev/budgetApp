import { addSpacesToNumber } from './addSpacesToNumber'

export const getSummaryText = (
  incomes: number | undefined,
  costs: number | undefined,
) => {
  const incomesCostsDifference = incomes && costs ? incomes - costs : 0

  if (incomesCostsDifference > 0) {
    return `Доходы превышают расходы на ${addSpacesToNumber(
      Math.abs(incomesCostsDifference),
    )} ₽`
  }
  return `Расходы превышают доходы на ${addSpacesToNumber(
    Math.abs(incomesCostsDifference),
  )} ₽`
}
