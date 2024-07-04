import type { DatePickerProps } from 'antd'
import { DatePicker } from 'antd'
import budgetStore from '../../shared/stores/budget'
import dayjs from 'dayjs'
import { useEffect } from 'react'

const MonthPicker = () => {
  const [setSelectedMonth] = budgetStore((s) => [s.setSelectedMonth])
  const currentDate = dayjs()

  useEffect(() => {
    const currentDateFormatMM = currentDate.format('MM')

    setSelectedMonth(Number(currentDateFormatMM))
  }, [])

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    setSelectedMonth(Number(dayjs(date).format('MM')))
  }
  return (
    <DatePicker onChange={onChange} picker="month" defaultValue={currentDate} />
  )
}

export default MonthPicker
