import type { DatePickerProps } from 'antd'
import { DatePicker } from 'antd'
import budgetStore from '../../shared/stores/budget'
import dayjs from 'dayjs'
import { useEffect } from 'react'

const MonthPicker = () => {
  const [selectedMonth, setSelectedMonth] = budgetStore((s) => [
    s.selectedMonth,
    s.setSelectedMonth,
  ])
  const currentDate = dayjs()

  useEffect(() => {
    const currentDateFormatMM = currentDate.format('MM.YYYY')

    setSelectedMonth(currentDateFormatMM)
  }, [])

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    setSelectedMonth(dayjs(date).format('MM.YYYY'))
  }
  return (
    <DatePicker onChange={onChange} picker="month" defaultValue={currentDate} />
  )
}

export default MonthPicker
