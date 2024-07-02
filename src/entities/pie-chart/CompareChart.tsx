import { Chart } from 'react-google-charts'
import { getCurrentDate } from '@/shared/utils/currentDate'
import { Button, DatePicker, DatePickerProps, Typography } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import budgetStore, { IBudgetStore } from '@/shared/stores/budget'
import { getSummary } from '@/shared/utils/getSummary'

// export const data = [
//   ['Месяц', 'Доходы', 'Расходы'],
//   ['04.2024', 1000, 400],
//   ['05.2024', 1170, 460],
//   ['06.2024', 660, 1120],
// ]

export function CompareChart() {
  const { Text } = Typography
  const currentDate = getCurrentDate()

  const [
    userBudgetData,
    getUserBudgetDataOnSelectedMonth,
    userBudgetDataOnSelectedMonth,
    monthBudgetData,
  ] = budgetStore((s: IBudgetStore) => [
    s.userBudgetData,
    s.getUserBudgetDataOnSelectedMonth,
    s.userBudgetDataOnSelectedMonth,
    s.monthBudgetData,
  ])

  const options = {
    chart: {
      title: '',
      // subtitle: 'Sales, Expenses, and Profit: 2014-2017',
    },
  }

  console.log(currentDate)
  console.log(monthBudgetData)

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

  const [startDate, setStartDate] = useState<Dayjs | undefined | string>(
    undefined,
  )
  const [data, setData] = useState<any>(undefined)
  const [endDate, setEndDate] = useState<Dayjs | undefined | string>(
    currentDate,
  )

  const onChangeStartDate: DatePickerProps['onChange'] = (date, dateString) => {
    setStartDate(date.format('MM.YYYY'))
    console.log(date, dateString)
  }

  const onPanelChange: DatePickerProps['onPanelChange'] = (value, mode) => {
    console.log(value, mode)
  }
  const onChangeEndDate: DatePickerProps['onChange'] = (date, dateString) => {
    setEndDate(date.format('MM.YYYY'))
  }
  const currentDateDayjs = dayjs()

  const [getData, setGetData] = useState<any>(true)

  const compareHandler = () => {
    setGetData(!getData)
  }

  useEffect(() => {
    console.log(startDate)
    console.log(endDate)

    if (startDate && endDate) {
      const id = localStorage.getItem('id')
      if (endDate === currentDate) {
        getUserBudgetDataOnSelectedMonth(startDate.toString(), Number(id))
        console.log(userBudgetDataOnSelectedMonth)

        if (userBudgetDataOnSelectedMonth) {
          console.log(userBudgetDataOnSelectedMonth)

          const incomesStartMonthSumm = getSummary(
            userBudgetDataOnSelectedMonth.budget_data.incomes,
          )
          const costsStartMonthSumm = getSummary(
            userBudgetDataOnSelectedMonth.budget_data.costs,
          )
          const incomesEndMonthSumm = userBudgetData
            ? getSummary(userBudgetData?.budget_data?.incomes)
            : 0
          const costsEndMonthSumm = userBudgetData
            ? getSummary(userBudgetData?.budget_data?.costs)
            : 0

          setData([
            ['Месяц', 'Доходы', 'Расходы'],
            [startDate, incomesStartMonthSumm, costsStartMonthSumm],
            [endDate, incomesEndMonthSumm, costsEndMonthSumm],
          ])
        } else {
          setData(undefined)
        }
      } else {
        console.log('oks')

        const dataArray = []
        let startUserData
        let endUserData

        console.log(startDate)
        console.log(endDate)

        getUserBudgetDataOnSelectedMonth(startDate.toString(), Number(id))
        console.log(userBudgetDataOnSelectedMonth)

        if (userBudgetDataOnSelectedMonth) {
          startUserData = userBudgetDataOnSelectedMonth
          dataArray.push({ startUserData })
        } else {
          setData(undefined)
        }
        if (dataArray.length > 0) {
          getUserBudgetDataOnSelectedMonth(endDate.toString(), Number(id))
          if (userBudgetDataOnSelectedMonth) {
            console.log('oki')
            console.log(userBudgetDataOnSelectedMonth)

            endUserData = userBudgetDataOnSelectedMonth
            dataArray.push({ endUserData })
            console.log(dataArray)

            const incomesStartMonthSumm = getSummary(
              dataArray[0]?.startUserData?.budget_data.incomes,
            )
            const costsStartMonthSumm = getSummary(
              dataArray[0]?.startUserData?.budget_data.costs,
            )
            const incomesEndMonthSumm = dataArray[1]?.endUserData
              ? getSummary(dataArray[1]?.endUserData?.budget_data?.incomes)
              : 0
            const costsEndMonthSumm = dataArray[1]?.endUserData
              ? getSummary(dataArray[1]?.endUserData?.budget_data?.costs)
              : 0

            setData([
              ['Месяц', 'Доходы', 'Расходы'],
              [startDate, incomesStartMonthSumm, costsStartMonthSumm],
              [endDate, incomesEndMonthSumm, costsEndMonthSumm],
            ])
          }
        }

        console.log('dataArray', dataArray)
      }
    } else {
      setData(undefined)
    }
  }, [getData, startDate, endDate, monthBudgetData])

  console.log(getData)

  console.log(data)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',

        width: '30vw',
        height: '600px',
      }}
    >
      <Text style={{ fontSize: '16px', color: 'black', marginBottom: 20 }}>
        Сравнение доходов и расходов по месяцам
      </Text>
      {data ? (
        <Chart
          chartType="Bar"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />
      ) : (
        <Text
          style={{
            fontSize: '16px',
            color: 'gray',
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          Данные по выбранным месяцам отсутствуют{' '}
        </Text>
      )}
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
        <div
          style={{
            display: 'flex',
            minWidth: '64%',
          }}
        >
          <DatePicker
            onChange={onChangeStartDate}
            onPanelChange={onPanelChange}
            picker="month"
            // defaultValue={currentDate}
            style={{ marginRight: 5 }}
          />
          <DatePicker
            onChange={onChangeEndDate}
            picker="month"
            defaultValue={currentDateDayjs}
          />
        </div>
        <Button style={{ marginTop: 20 }} onClick={compareHandler}>
          Сравнить
        </Button>
      </div>
    </div>
  )
}
