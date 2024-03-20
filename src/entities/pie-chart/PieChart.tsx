import { Chart } from 'react-google-charts'
import { budgetStore } from '../../shared/stores/budget'
import { useEffect, useState } from 'react'

const options = {
  title: 'Статистика затрат',
  is3D: true,
}

export function PieChart() {
  const budgetData = budgetStore((s) => s.budgetData)
  const categories = budgetData?.budget_data?.categories
  const [pieChartData, setPieChartData] = useState<any>([])

  console.log(budgetData)

  const preparedData = budgetData?.budget_data?.costs
    .reduce((acc: any, item: any) => {
      item.costs.forEach((cost: any) => {
        const existingCategory = acc.find(
          (c: any) => c.category_id === cost.category_id,
        )
        if (existingCategory) {
          existingCategory.amount += cost.amount
        } else {
          acc.push({ category_id: cost.category_id, amount: cost.amount })
        }
      })
      return acc
    }, [])
    .map((item: any) => {
      const { name } = categories.find((c: any) => c.id === item.category_id)
      return [name, item.amount]
    })

  console.log(preparedData)

  const data = [...[['Task', 'Hours per Day']], ...(preparedData ?? [])]

  useEffect(() => {
    if (data.length > 0) {
      setPieChartData(data)
    }
  }, [budgetData])

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
