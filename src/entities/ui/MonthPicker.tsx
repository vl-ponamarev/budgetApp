import type { DatePickerProps } from 'antd'
import { DatePicker } from 'antd'
import budgetStore from '../../shared/stores/budget'

const MonthPicker = () => {
  const [selectedMonth, setSelectedMonth] = budgetStore((s) => [
    s.selectedMonth,
    s.setSelectedMonth,
  ])
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    setSelectedMonth(dateString)
  }

  return <DatePicker onChange={onChange} picker="month" />
}

export default MonthPicker
