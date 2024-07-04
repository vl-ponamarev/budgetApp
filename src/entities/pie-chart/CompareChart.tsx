import { Chart } from 'react-google-charts'
import { getCurrentDate } from '@/shared/utils/currentDate'
import { Button, DatePicker, DatePickerProps, Typography } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import budgetStore, { IBudgetStore } from '@/shared/stores/budget'
import { getSummary } from '@/shared/utils/getSummary'
import { addSpacesToNumber } from '@/shared/utils/addSpacesToNumber'

export function CompareChart() {
  const { Text } = Typography
  const currentDate = getCurrentDate()

  const [getUserBudgetDataOnSelectedMonth, userBudgetDataOnSelectedMonth] =
    budgetStore((s: IBudgetStore) => [
      s.getUserBudgetDataOnSelectedMonth,
      s.userBudgetDataOnSelectedMonth,
      s.monthBudgetData,
    ])

  const options = {
    chart: {
      title: '',
      // subtitle: 'text',
    },
  }

  interface DataInfo {
    costsDiff?: number
    incomesDiff?: number
    incomeResult?: string
    costsResult?: string
  }

  const [startDate, setStartDate] = useState<Dayjs | undefined | string>(
    undefined,
  )
  const [data, setData] = useState<any>(undefined)
  const [endDate, setEndDate] = useState<Dayjs | undefined | string>(
    currentDate,
  )

  const onChangeStartDate: DatePickerProps['onChange'] = (date, dateString) => {
    setStartDate(date ? date.format('MM.YYYY') : undefined)
  }

  const onPanelChange: DatePickerProps['onPanelChange'] = (value, mode) => {
    console.log(value, mode)
  }
  const onChangeEndDate: DatePickerProps['onChange'] = (date, dateString) => {
    setEndDate(date ? date.format('MM.YYYY') : undefined)
  }
  const currentDateDayjs = dayjs()

  const [getData, setGetData] = useState<any>(false)

  const compareHandler = () => {
    setGetData(true)
  }

  useEffect(() => {
    if (startDate && endDate && getData) {
      const id = localStorage.getItem('id')

      getUserBudgetDataOnSelectedMonth([
        { month: startDate.toString(), userId: Number(id) },
        { month: endDate.toString(), userId: Number(id) },
      ])

      setGetData(false)
    }
    setGetData(false)
  }, [getData])

  useEffect(() => {
    if (userBudgetDataOnSelectedMonth) {
      const incomesStartMonthSumm = getSummary(
        userBudgetDataOnSelectedMonth &&
          userBudgetDataOnSelectedMonth[0].budget_data.incomes,
      )
      const costsStartMonthSumm = getSummary(
        userBudgetDataOnSelectedMonth &&
          userBudgetDataOnSelectedMonth[0].budget_data.costs,
      )
      const incomesEndMonthSumm = getSummary(
        userBudgetDataOnSelectedMonth &&
          userBudgetDataOnSelectedMonth[1]?.budget_data?.incomes,
      )

      const costsEndMonthSumm = getSummary(
        userBudgetDataOnSelectedMonth &&
          userBudgetDataOnSelectedMonth[1]?.budget_data?.costs,
      )

      setData([
        ['Месяц', 'Доходы', 'Расходы'],
        [startDate, incomesStartMonthSumm, costsStartMonthSumm],
        [endDate, incomesEndMonthSumm, costsEndMonthSumm],
      ])
    }

    setGetData(false)
  }, [userBudgetDataOnSelectedMonth])

  let dataInfo: DataInfo = {}

  if (data && data[1] && data[2]) {
    const [_, firstMonthIncomes, firstMonthCosts] = data[1]
    const [__, secondMonthIncomes, secondMonthCosts] = data[2]
    const costsDiff = firstMonthCosts - secondMonthCosts
    const incomesDiff = firstMonthIncomes - secondMonthIncomes
    const incomeResult = incomesDiff < 0 ? 'меньше' : 'больше'
    const costsResult = costsDiff < 0 ? 'меньше' : 'больше'

    dataInfo = {
      costsDiff,
      incomesDiff,
      incomeResult,
      costsResult,
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',

        width: '20vw',
        height: '600px',
      }}
    >
      <Text style={{ fontSize: '14px', color: 'black', marginBottom: 20 }}>
        Сравнение доходов и расходов по месяцам
      </Text>
      {data ? (
        <Chart
          chartType="Bar"
          width="90%"
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
        {data && data[1] && data[2] && startDate && endDate && (
          <>
            <Text keyboard>{`Доходы за ${startDate} ${
              dataInfo.incomeResult
            } доходов за ${endDate} на ${addSpacesToNumber(
              Math.abs(dataInfo.incomesDiff ?? 0),
            )} ₽`}</Text>
            <Text
              keyboard
              style={{ marginTop: 10 }}
            >{`Расходы за ${startDate} ${
              dataInfo.costsResult
            } расходов за ${endDate} на ${addSpacesToNumber(
              Math.abs(dataInfo.costsDiff ?? 0),
            )} ₽`}</Text>
          </>
        )}

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
            style={{ marginRight: 5 }}
            format="MM.YYYY"
            allowClear
          />
          <DatePicker
            onChange={onChangeEndDate}
            picker="month"
            defaultValue={currentDateDayjs}
            format="MM.YYYY"
            allowClear
          />
        </div>
        <Button style={{ marginTop: 20 }} onClick={compareHandler}>
          Сравнить
        </Button>
      </div>
    </div>
  )
}
