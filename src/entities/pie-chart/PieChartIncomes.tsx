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
    title: '',
    is3D: true,
    titleTextStyle: {
      fontSize: 16,
      bold: true,
      // use padding to push the title to the right
      paddingRight: '100px',
    },
  }

  const preparedData1 = userBudgetData?.budget_data?.incomes.reduce(
    (acc: any, item: any) => {
      {
        const existingCategory = acc.find(
          (c: any) => String(c.category_id) === String(item.category_id),
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
    },
    [],
  )

  console.log(preparedData1)

  const preparedData = preparedData1?.map((item: any) => {
    console.log(item)

    const { name } = incomes_categories
      ? incomes_categories.find(
          (c: any) => String(c.id) === String(item.category_id),
        )
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
