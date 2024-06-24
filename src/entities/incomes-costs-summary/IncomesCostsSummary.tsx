import budgetStore, { IBudgetStore } from '@/shared/stores/budget'
import { addSpacesToNumber } from '@/shared/utils/addSpacesToNumber'
import { getSummary } from '@/shared/utils/getSummary'
import { getSummaryText } from '@/shared/utils/getSummaryText'
import { Typography } from 'antd'

const IncomesCostsSummary: React.FC = () => {
  const [userBudgetData] = budgetStore((s: IBudgetStore) => [s.userBudgetData])
  const { Text } = Typography

  const incomes = userBudgetData?.budget_data?.incomes
    ? getSummary(userBudgetData?.budget_data?.incomes)
    : 0
  const costs = userBudgetData?.budget_data?.costs
    ? getSummary(userBudgetData?.budget_data?.costs)
    : 0

  const incomesSum = addSpacesToNumber(incomes) ?? 0
  // console.log(incomesSum)
  const costsSum = addSpacesToNumber(costs) ?? 0
  // console.log(costsSum)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
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
          width: '100%',
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
