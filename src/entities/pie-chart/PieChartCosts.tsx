import { Chart } from 'react-google-charts'

import { useEffect, useState } from 'react'
import budgetStore, { IBudgetStore } from '../../shared/stores/budget'
import dayjs from 'dayjs'

export function PieChartCosts() {
  const userBudgetData = budgetStore((s) => s.userBudgetData)
  const costs_categories = userBudgetData?.budget_data?.costs_categories

  const [pieChartData, setPieChartData] = useState<any>([])

  const selectedMonth = budgetStore((s: IBudgetStore) => s.selectedMonth)

  const date = selectedMonth
    ? dayjs()
        .month(selectedMonth - 1)
        .format('MM.YYYY')
    : dayjs().format('MM.YYYY')

  const options = {
    title: `Статистика расходов за ${date}`,
    is3D: true,
  }

  const preparedData = userBudgetData?.budget_data?.costs
    .reduce((acc: any, item: any) => {
      const existingCategory = acc.find(
        (c: any) => c.category_id === item.category_id,
      )
      if (existingCategory) {
        existingCategory.amount += Number(item.amount)
      } else {
        acc.push({ category_id: item.category_id, amount: Number(item.amount) })
      }

      return acc
    }, [])
    .map((item: any) => {
      const { name } =
        costs_categories?.find((c: any) => c.id === item.category_id) ?? ''
      return [name, item.amount]
    })

  const data = [...[['Task', 'Hours per Day']], ...(preparedData ?? [])]

  useEffect(() => {
    if (data.length > 0) {
      setPieChartData(data)
    }
  }, [userBudgetData])

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
