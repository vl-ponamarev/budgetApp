import { Chart } from 'react-google-charts'
import { useEffect, useState } from 'react'
import budgetStore from '@/shared/stores/budget'
import { getCurrentDate } from '@/shared/utils/currentDate'

export function PieChartIncomes() {
  const userBudgetData = budgetStore((s) => s.userBudgetData)
  const incomes_categories = userBudgetData?.budget_data?.incomes_categories
  const [pieChartData, setPieChartData] = useState<any>([])

  console.log(incomes_categories)
  console.log(userBudgetData)

  const options = {
    title: `Статистика доходов за ${getCurrentDate()}`,
    is3D: true,
  }

  const preparedData = userBudgetData?.budget_data?.incomes
    .reduce((acc: any, item: any) => {
      {
        const existingCategory = acc.find(
          (c: any) => c.category_id === item.category_id,
        )
        if (existingCategory) {
          existingCategory.amount += Number(item.amount)
        } else {
          acc.push({
            category_id: item.category_id,
            amount: Number(item.amount),
          })
        }
      }
      return acc
    }, [])
    .map((item: any) => {
      const { name } = incomes_categories
        ? incomes_categories.find((c: any) => c.id === item.category_id)
        : ''
      return [name, item.amount]
    })

  console.log(preparedData)

  const data = [...[['Task', 'Hours per Day']], ...(preparedData ?? [])]

  useEffect(() => {
    if (data.length > 0) {
      setPieChartData(data)
    }
  }, [userBudgetData])

  console.log(pieChartData)

  return (
    <Chart
      chartType="PieChart"
      data={pieChartData}
      options={options}
      width={'100%'}
      height={'400px'}
    />
  )
}
