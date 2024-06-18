import { Chart } from 'react-google-charts'
import { getCurrentDate } from '@/shared/utils/currentDate'
import { Button, DatePicker, Typography } from 'antd'
import { Dayjs } from 'dayjs'

export const data = [
  ['Месяц', 'Доходы', 'Расходы'],
  ['04.2024', 1000, 400],
  ['05.2024', 1170, 460],
  ['06.2024', 660, 1120],
]

export const options = {
  chart: {
    title: '',
    // subtitle: 'Sales, Expenses, and Profit: 2014-2017',
  },
}

export function CompareChart() {
  const { RangePicker } = DatePicker
  const { Text } = Typography
  const currentDate = getCurrentDate()
  console.log(currentDate)

  function getPreviousDates(currentDate: string) {
    const dates = []
    const [month, year] = currentDate.split('.').map(Number)

    for (let i = 0; i < 3; i++) {
      const date = new Date(year, month - 1)
      date.setMonth(date.getMonth() - i)
      const formattedMonth = ('0' + (date.getMonth() + 1)).slice(-2)
      const formattedYear = date.getFullYear()
      dates.push(`${formattedMonth}.${formattedYear}`)
    }

    return dates.reverse()
  }

  const dateArray = getPreviousDates(currentDate)

  console.log(dateArray)

  const onRangeChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: string[],
  ) => {
    if (dates) {
      console.log('From: ', dates[0], ', to: ', dates[1])
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    } else {
      console.log('Clear')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',

        width: '100%',
        height: '600px',
      }}
    >
      <Text style={{ fontSize: '16px', color: 'gray', marginBottom: 20 }}>
        Сравнение доходов и расходов по месяцам
      </Text>
      <Chart
        chartType="Bar"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
        }}
      >
        <Text
          style={{
            fontSize: '16px',
            color: 'gray',
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          Выбрать месяцы
        </Text>
        <RangePicker picker="month" onChange={onRangeChange} />
        <Button style={{ marginTop: 20 }}>Сравнить</Button>
      </div>
    </div>
  )
}
