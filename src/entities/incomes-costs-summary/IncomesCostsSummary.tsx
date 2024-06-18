import budgetStore, { IBudgetStore } from '@/shared/stores/budget'
import { Typography } from 'antd'

const IncomesCostsSummary: React.FC = () => {
  const [userBudgetData] = budgetStore((s: IBudgetStore) => [s.userBudgetData])
  const { Text } = Typography
  const getSummary = (data: any[]) => {
    return data.reduce((acc: number, item) => (acc += Number(item.amount)), 0)
  }

  function addSpacesToNumber(number: number) {
    const numberStr = number.toString()
    let result
    if (numberStr.length > 3) {
      result = numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    } else {
      result = numberStr
    }

    return result
  }
  const incomes = userBudgetData?.budget_data?.incomes
    ? getSummary(userBudgetData?.budget_data?.incomes)
    : 0
  const costs = userBudgetData?.budget_data?.costs
    ? getSummary(userBudgetData?.budget_data?.costs)
    : 0

  const incomesSum = addSpacesToNumber(incomes) ?? 0
  console.log(incomesSum)
  const costsSum = addSpacesToNumber(costs) ?? 0
  console.log(costsSum)

  const getSummaryText = (incomes: number, costs: number) => {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '60vw' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '60vw',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Text strong style={{ fontSize: '12px' }}>
            Всего доходов
          </Text>
          <Text keyboard style={{ fontSize: '20px' }}>{`${incomesSum} ₽`}</Text>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Text strong style={{ fontSize: '12px' }}>
            Всего расходов
          </Text>
          <Text keyboard style={{ fontSize: '20px' }}>{`${costsSum} ₽`}</Text>
        </div>
      </div>
      <div
        style={{
          marginTop: '30px',
          display: 'flex',
          justifyContent: 'center',
          width: '60vw',
        }}
      >
        <Text keyboard style={{ fontSize: '20px' }}>
          {getSummaryText(incomes, costs)}
        </Text>
      </div>
    </div>
  )
}

export default IncomesCostsSummary
