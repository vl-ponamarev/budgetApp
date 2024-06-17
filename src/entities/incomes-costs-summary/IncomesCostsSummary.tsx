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
  const incomesSum = userBudgetData?.budget_data?.incomes
    ? addSpacesToNumber(getSummary(userBudgetData.budget_data.incomes))
    : 0
  console.log(incomesSum)
  const costsSum = userBudgetData?.budget_data?.costs
    ? addSpacesToNumber(getSummary(userBudgetData.budget_data.costs))
    : 0
  console.log(costsSum)

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
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
  )
}

export default IncomesCostsSummary
